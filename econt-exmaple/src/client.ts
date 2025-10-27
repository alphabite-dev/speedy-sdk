import { HttpClient } from "./utils/http";
import { API_BASE_URLS } from "./constants";
import { EcontConfig } from "./types/common";
import { CacheManager } from "./utils/cache";
import { Offices } from "./resources/offices";
import { AddressService } from "./resources/address";
import { Shipments } from "./resources/shipments";
import { Tracking } from "./resources/tracking";
import { ProfileService } from "./resources/profile";
import { ThreeWayLogisticsService } from "./resources/threewaylogistics";
import { PaymentReportService } from "./resources/paymentreport";

/**
 * Main Econt SDK client
 */
export class EcontClient {
  private http: HttpClient;
  private cacheManager: CacheManager | null = null;

  public readonly offices: Offices;
  public readonly address: AddressService;
  public readonly shipments: Shipments;
  public readonly tracking: Tracking;
  public readonly profile: ProfileService;
  public readonly threeWayLogistics: ThreeWayLogisticsService;
  public readonly paymentReport: PaymentReportService;

  constructor(config: EcontConfig) {
    // Validate credentials
    if (!config.username || config.username.trim() === "") {
      throw new Error("Username is required");
    }
    if (!config.password || config.password.trim() === "") {
      throw new Error("Password is required");
    }

    // Initialize cache manager if enabled
    if (config.cache?.enabled) {
      this.cacheManager = new CacheManager(config.cache.directory, config.cache.ttl);
    }

    // Determine base URL
    const baseURL = config.environment === "demo" ? API_BASE_URLS.demo : API_BASE_URLS.production;

    // Initialize HTTP client
    this.http = new HttpClient({
      baseURL,
      username: config.username,
      password: config.password,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
    });

    // Initialize resources
    this.offices = new Offices(this.http, this.cacheManager);
    this.address = new AddressService(this.http);
    this.shipments = new Shipments(this.http);
    this.tracking = new Tracking(this.http);
    this.profile = new ProfileService(this.http);
    this.threeWayLogistics = new ThreeWayLogisticsService(this.http);
    this.paymentReport = new PaymentReportService(this.http);
  }

  /**
   * Export all nomenclature data to cache
   * This fetches countries, cities, offices, streets, and quarters from the API
   * and saves them to JSON files in the cache directory
   */
  async exportAllData(): Promise<void> {
    if (!this.cacheManager) {
      throw new Error("Cache is not enabled. Please configure cache in EcontConfig.");
    }

    console.log("Exporting all Econt nomenclature data...");

    // Export countries
    console.log("Fetching countries...");
    const countries = await this.offices.getCountries({ forceRefresh: true });
    this.cacheManager.writeJSON("countries.json", countries);
    console.log(`✓ Exported ${countries.length} countries`);

    // Export all cities
    console.log("Fetching all cities...");
    const cities = await this.offices.getCities({ forceRefresh: true });
    this.cacheManager.writeJSON("cities.json", cities);
    console.log(`✓ Exported ${cities.length} cities`);

    // Export all offices
    console.log("Fetching all offices...");
    const offices = await this.offices.list({ forceRefresh: true });
    this.cacheManager.writeJSON("offices.json", offices);
    console.log(`✓ Exported ${offices.length} offices`);

    // Export streets for all cities
    console.log("Fetching streets for all cities...");
    const streetsMap: Record<number, any[]> = {};
    let streetCount = 0;

    for (const city of cities) {
      try {
        const streets = await this.offices.getStreets(city.id, { forceRefresh: true });
        if (streets && streets.length > 0) {
          streetsMap[city.id] = streets;
          streetCount += streets.length;
        }
      } catch (error) {
        // Some cities may not have streets, continue
        console.log(`  Skipped city ${city.name} (no streets)`);
      }
    }
    this.cacheManager.writeJSON("streets.json", streetsMap);
    console.log(`✓ Exported ${streetCount} streets for ${Object.keys(streetsMap).length} cities`);

    // Export quarters for all cities
    console.log("Fetching quarters for all cities...");
    const quartersMap: Record<number, any[]> = {};
    let quarterCount = 0;

    for (const city of cities) {
      try {
        const quarters = await this.offices.getQuarters(city.id, { forceRefresh: true });
        if (quarters && quarters.length > 0) {
          quartersMap[city.id] = quarters;
          quarterCount += quarters.length;
        }
      } catch (error) {
        // Some cities may not have quarters, continue
        console.log(`  Skipped city ${city.name} (no quarters)`);
      }
    }
    this.cacheManager.writeJSON("quarters.json", quartersMap);
    console.log(`✓ Exported ${quarterCount} quarters for ${Object.keys(quartersMap).length} cities`);

    // Write metadata
    this.cacheManager.writeMetadata("1.0.0");

    console.log("✓ Export complete!");
  }

  /**
   * Get cache status for all cached data
   */
  getCacheStatus(): Record<string, { exists: boolean; age: number | null; expired: boolean }> | null {
    if (!this.cacheManager) {
      return null;
    }
    return this.cacheManager.getStatus();
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    if (!this.cacheManager) {
      throw new Error("Cache is not enabled.");
    }
    this.cacheManager.clearAll();
  }
}
