import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import {
  ListOfficesRequest,
  ListOfficesResponse,
  GetOfficeResponse,
  SearchOfficesRequest,
  SearchOfficesResponse,
} from "@alphabite/speedy-types";

/**
 * Offices resource - handles office/location operations
 */
export class Offices extends BaseResource {
  /**
   * Find offices with filters
   * At least one filter is required to prevent huge responses
   */
  async find(params: ListOfficesRequest): Promise<ListOfficesResponse> {
    if (!params || (!params.countryId && !params.cityId && !params.siteId && !params.name)) {
      throw new Error(
        "At least one filter (countryId, cityId, siteId, or name) is required to fetch offices"
      );
    }
    return this.http.post<ListOfficesResponse>(ENDPOINTS.findOffice, params);
  }

  /**
   * Get office details by ID
   */
  async get(officeId: number): Promise<GetOfficeResponse> {
    const url = ENDPOINTS.getOffice.replace(":id", officeId.toString());
    return this.http.post<GetOfficeResponse>(url, {});
  }

  /**
   * Find nearest offices to an address
   */
  async findNearest(request: SearchOfficesRequest): Promise<SearchOfficesResponse> {
    return this.http.post<SearchOfficesResponse>(ENDPOINTS.findNearestOffices, request);
  }
}
