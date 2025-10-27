import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import {
  ValidateAddressRequest,
  ValidateAddressResponse,
  GetCitiesRequest,
  GetCitiesResponse,
  GetStreetsRequest,
  GetStreetsResponse,
  GetQuartersRequest,
  GetQuartersResponse,
} from "../types/address";

/**
 * Address resource - handles address validation and lookup operations
 */
export class AddressService extends BaseResource {
  /**
   * Validate an address
   */
  async validate(request: ValidateAddressRequest): Promise<ValidateAddressResponse> {
    return this.http.post<ValidateAddressResponse>(ENDPOINTS.validateAddress, request);
  }

  /**
   * Find sites (cities) with optional filters
   */
  async findSites(params?: GetCitiesRequest): Promise<GetCitiesResponse> {
    const response = await this.http.post<GetCitiesResponse>(ENDPOINTS.findSite, params);
    // Add backwards compatibility - map sites to cities
    if (response.sites && !response.cities) {
      response.cities = response.sites;
    }
    return response;
  }

  /**
   * Find streets for a specific site
   */
  async findStreets(siteId: number, name?: string): Promise<GetStreetsResponse> {
    const params: GetStreetsRequest = { siteId, name };
    return this.http.post<GetStreetsResponse>(ENDPOINTS.findStreet, params);
  }

  /**
   * Find complexes (quarters) for a specific site
   */
  async findComplexes(siteId: number, name?: string): Promise<GetQuartersResponse> {
    const params: GetQuartersRequest = { siteId, name };
    const response = await this.http.post<GetQuartersResponse>(ENDPOINTS.findComplex, params);
    // Add backwards compatibility - map complexes to quarters
    if (response.complexes && !response.quarters) {
      response.quarters = response.complexes;
    }
    return response;
  }
}
