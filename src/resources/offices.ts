import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import {
  ListOfficesRequest,
  ListOfficesResponse,
  GetOfficeResponse,
  SearchOfficesRequest,
  SearchOfficesResponse,
} from "../types/offices";

/**
 * Offices resource - handles office/location operations
 */
export class Offices extends BaseResource {
  /**
   * Find offices with optional filters
   */
  async find(params?: ListOfficesRequest): Promise<ListOfficesResponse> {
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
