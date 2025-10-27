import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { GetOfficesRequest, GetOfficesResponse, Office } from "../types/offices";
import { City, Country } from "../types/common";
import { Street, GetStreetsResponse, Quarter, GetQuartersResponse } from "../types/nomenclatures";
import { CacheManager } from "../utils/cache";
import { HttpClient } from "../utils/http";

/**
 * Offices resource - handles office-related operations
 */
export class Offices extends BaseResource {
  private cache: CacheManager | null;

  constructor(http: HttpClient, cache: CacheManager | null = null) {
    super(http);
    this.cache = cache;
  }
  /**
   * Get list of Econt offices
   */
  async list(params?: GetOfficesRequest & { forceRefresh?: boolean }): Promise<Office[]> {
    const forceRefresh = params?.forceRefresh;
    const apiParams = { ...params };
    delete apiParams.forceRefresh;

    // Check cache first
    if (this.cache && !forceRefresh && !this.cache.isExpired("offices.json")) {
      const cachedOffices = this.cache.readJSON<Office[]>("offices.json");
      if (cachedOffices) {
        // Apply filters if provided
        let filtered = cachedOffices;
        if (apiParams.countryCode) {
          filtered = filtered.filter((o) => o.address.city.country.code2 === apiParams.countryCode);
        }
        if (apiParams.cityId) {
          filtered = filtered.filter((o) => o.address.city.id === apiParams.cityId);
        }
        if (apiParams.officeCode) {
          filtered = filtered.filter((o) => o.code === apiParams.officeCode);
        }
        return filtered;
      }
    }

    const response = await this.http.post<GetOfficesResponse>(ENDPOINTS.offices, apiParams || {});
    return response.offices || [];
  }

  /**
   * Get a specific office by code
   */
  async get(officeCode: string): Promise<Office | null> {
    const offices = await this.list({ officeCode });
    return offices.length > 0 ? offices[0] : null;
  }

  /**
   * Get offices in a specific city
   */
  async getByCity(cityId: number): Promise<Office[]> {
    return this.list({ cityId });
  }

  /**
   * Get offices in a specific country
   */
  async getByCountry(countryCode: string): Promise<Office[]> {
    return this.list({ countryCode });
  }

  /**
   * Get list of cities
   */
  async getCities(params?: { countryCode?: string; cityId?: number; forceRefresh?: boolean }): Promise<City[]> {
    const forceRefresh = params?.forceRefresh;
    const apiParams = { ...params };
    delete apiParams.forceRefresh;

    // Check cache first
    if (this.cache && !forceRefresh && !this.cache.isExpired("cities.json")) {
      const cachedCities = this.cache.readJSON<City[]>("cities.json");
      if (cachedCities) {
        // Apply filters if provided
        let filtered = cachedCities;
        if (apiParams.countryCode) {
          filtered = filtered.filter((c) => c.country.code2 === apiParams.countryCode);
        }
        if (apiParams.cityId) {
          filtered = filtered.filter((c) => c.id === apiParams.cityId);
        }
        return filtered;
      }
    }

    const response = await this.http.post<{ cities: City[] }>(ENDPOINTS.cities, apiParams || {});
    return response.cities || [];
  }

  /**
   * Get list of countries
   */
  async getCountries(params?: { forceRefresh?: boolean }): Promise<Country[]> {
    const forceRefresh = params?.forceRefresh;

    // Check cache first
    if (this.cache && !forceRefresh && !this.cache.isExpired("countries.json")) {
      const cachedCountries = this.cache.readJSON<Country[]>("countries.json");
      if (cachedCountries) {
        return cachedCountries;
      }
    }

    const response = await this.http.post<{ countries: Country[] }>(ENDPOINTS.countries, {});
    return response.countries || [];
  }

  /**
   * Search for streets in a city
   */
  async getStreets(cityID: number, params?: { streetName?: string; forceRefresh?: boolean }): Promise<Street[]> {
    const forceRefresh = params?.forceRefresh;
    const streetName = params?.streetName;

    // Check cache first
    if (this.cache && !forceRefresh && !this.cache.isExpired("streets.json")) {
      const cachedStreets = this.cache.readJSON<Record<number, Street[]>>("streets.json");
      if (cachedStreets && cachedStreets[cityID]) {
        let filtered = cachedStreets[cityID];
        if (streetName) {
          filtered = filtered.filter((s) => s.name?.toLowerCase().includes(streetName.toLowerCase()));
        }
        return filtered;
      }
    }

    const response = await this.http.post<GetStreetsResponse>(ENDPOINTS.streets, { cityID, streetName });
    return response.streets || [];
  }

  /**
   * Get quarters (neighborhoods) in a city
   */
  async getQuarters(cityID: number, params?: { forceRefresh?: boolean }): Promise<Quarter[]> {
    const forceRefresh = params?.forceRefresh;

    // Check cache first
    if (this.cache && !forceRefresh && !this.cache.isExpired("quarters.json")) {
      const cachedQuarters = this.cache.readJSON<Record<number, Quarter[]>>("quarters.json");
      if (cachedQuarters && cachedQuarters[cityID]) {
        return cachedQuarters[cityID];
      }
    }

    const response = await this.http.post<GetQuartersResponse>(ENDPOINTS.quarters, { cityID });
    return response.quarters || [];
  }
}
