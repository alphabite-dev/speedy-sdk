import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import {
  ValidateAddressRequest,
  ValidateAddressResponse,
  AddressServiceTimesRequest,
  AddressServiceTimesResponse,
  GetNearestOfficesRequest,
  GetNearestOfficesResponse,
} from "../types/address";

/**
 * Address resource - handles address-related operations
 */
export class AddressService extends BaseResource {
  /**
   * Validate an address
   */
  async validateAddress(request: ValidateAddressRequest): Promise<ValidateAddressResponse> {
    const response = await this.http.post<ValidateAddressResponse>(ENDPOINTS.validateAddress, request);
    return response;
  }

  /**
   * Get service times for an address
   */
  async addressServiceTimes(request: AddressServiceTimesRequest): Promise<AddressServiceTimesResponse> {
    const response = await this.http.post<AddressServiceTimesResponse>(ENDPOINTS.addressServiceTimes, request);
    return response;
  }

  /**
   * Find nearest offices to an address
   */
  async getNearestOffices(request: GetNearestOfficesRequest): Promise<GetNearestOfficesResponse> {
    const response = await this.http.post<GetNearestOfficesResponse>(ENDPOINTS.getNearestOffices, request);
    return response;
  }
}
