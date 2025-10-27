import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import {
  CreateShipmentRequest,
  CreateShipmentResponse,
  GetShipmentResponse,
  CalculateShippingRequest,
  CalculateShippingResponse,
  CancelShipmentRequest,
  CancelShipmentResponse,
} from "../types/shipments";

/**
 * Shipments resource - handles shipment-related operations
 */
export class Shipments extends BaseResource {
  /**
   * Create a new shipment
   */
  async create(request: CreateShipmentRequest): Promise<CreateShipmentResponse> {
    return this.http.post<CreateShipmentResponse>(ENDPOINTS.createShipment, request);
  }

  /**
   * Get shipment information by IDs
   */
  async getInfo(shipmentIds: string[]): Promise<GetShipmentResponse> {
    return this.http.post<GetShipmentResponse>(ENDPOINTS.shipmentInfo, { shipmentIds });
  }

  /**
   * Calculate shipping cost
   */
  async calculate(request: CalculateShippingRequest): Promise<CalculateShippingResponse> {
    return this.http.post<CalculateShippingResponse>(ENDPOINTS.calculate, request);
  }

  /**
   * Cancel a shipment
   */
  async cancel(shipmentId: string, comment: string): Promise<CancelShipmentResponse> {
    const request: CancelShipmentRequest = { shipmentId, comment };
    return this.http.post<CancelShipmentResponse>(ENDPOINTS.cancelShipment, request);
  }
}
