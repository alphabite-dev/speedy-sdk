import { HttpClient } from "./utils/http";
import { API_BASE_URLS, SDK_VERSION } from "./constants";
import { SpeedyConfig } from "./types/common";
import { CacheManager } from "./utils/cache";
import { Shipments } from "./resources/shipments";
import { Tracking } from "./resources/tracking";
import { Offices } from "./resources/offices";
import { AddressService } from "./resources/address";
import { PrintService } from "./resources/print";
import { CalculationService } from "./resources/calculation";

/**
 * Main Speedy SDK client
 */
export class SpeedyClient {
  private http: HttpClient;
  private cacheManager: CacheManager | null = null;

  public readonly shipments: Shipments;
  public readonly tracking: Tracking;
  public readonly offices: Offices;
  public readonly address: AddressService;
  public readonly print: PrintService;
  public readonly calculation: CalculationService;

  constructor(config: SpeedyConfig) {
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
    const baseURL = config.environment === "sandbox" ? API_BASE_URLS.sandbox : API_BASE_URLS.production;

    // Initialize HTTP client
    this.http = new HttpClient({
      baseURL,
      username: config.username,
      password: config.password,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
    });

    // Initialize resources
    this.shipments = new Shipments(this.http);
    this.tracking = new Tracking(this.http);
    this.offices = new Offices(this.http);
    this.address = new AddressService(this.http);
    this.print = new PrintService(this.http);
    this.calculation = new CalculationService(this.http);
  }

  /**
   * Export all nomenclature data to cache
   * Downloads offices, sites, streets, and complexes from Speedy API
   */
  async exportAllData(): Promise<void> {
    if (!this.cacheManager) {
      throw new Error("Cache is not enabled. Please configure cache in SpeedyConfig.");
    }

    console.log("Exporting all Speedy nomenclature data...");

    // Export all offices
    console.log("Fetching all offices...");
    const offices = await this.offices.find({});
    this.cacheManager.writeJSON("offices.json", offices);
    console.log(`✓ Exported ${offices.offices?.length || 0} offices`);

    // Write metadata
    this.cacheManager.writeMetadata(SDK_VERSION);

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
