import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { GetClientProfilesResponse, CreateCDAgreementRequest, CreateCDAgreementResponse } from "../types/profile";

/**
 * Profile resource - handles profile-related operations
 */
export class ProfileService extends BaseResource {
  /**
   * Get client profiles
   */
  async getClientProfiles(): Promise<GetClientProfilesResponse> {
    const response = await this.http.post<GetClientProfilesResponse>(ENDPOINTS.getClientProfiles, {});
    return response;
  }

  /**
   * Create CD (Cash on Delivery) agreement
   */
  async createCDAgreement(request: CreateCDAgreementRequest): Promise<CreateCDAgreementResponse> {
    const response = await this.http.post<CreateCDAgreementResponse>(ENDPOINTS.createCDAgreement, request);
    return response;
  }
}
