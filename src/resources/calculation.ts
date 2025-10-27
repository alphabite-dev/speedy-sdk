import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";

export interface CalculationRequest {
  sender?: { siteId?: number; dropoffOfficeId?: number };
  recipient: {
    privatePerson?: boolean;
    addressLocation?: { siteId?: number; countryId?: number; postCode?: string };
    pickupOfficeId?: number;
  };
  service: {
    serviceIds: number[];
    pickupDate?: string;
  };
  content: {
    parcelsCount?: number;
    totalWeight?: number;
    parcels?: Array<{ weight: number; size?: { width: number; height: number; depth: number } }>;
  };
  payment: {
    courierServicePayer: "SENDER" | "RECIPIENT" | "THIRD_PARTY";
  };
}

export interface CalculationResponse {
  calculations: Array<{
    serviceId: number;
    price: {
      amount: number;
      total: number;
      currency: string;
    };
    deliveryDeadline?: string;
  }>;
}

/**
 * Calculation resource - handles price calculation operations
 */
export class CalculationService extends BaseResource {
  /**
   * Calculate shipping costs
   */
  async calculate(request: CalculationRequest): Promise<CalculationResponse> {
    return this.http.post<CalculationResponse>(ENDPOINTS.calculate, request);
  }
}
