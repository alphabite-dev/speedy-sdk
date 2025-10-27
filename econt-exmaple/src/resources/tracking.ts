import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { GetShipmentStatusesRequest, GetShipmentStatusesResponse, ShipmentStatus } from "../types/tracking";

/**
 * Tracking resource - handles shipment tracking operations
 * Uses getShipmentStatuses endpoint
 */
export class Tracking extends BaseResource {
  /**
   * Track shipments by shipment numbers
   */
  async track(shipmentNumbers: string[]): Promise<ShipmentStatus[]> {
    const request: GetShipmentStatusesRequest = {
      shipmentNumbers,
    };

    const response = await this.http.post<GetShipmentStatusesResponse>(ENDPOINTS.getShipmentStatuses, request);

    return (response.shipmentStatuses || []).map((item) => item.status).filter((s): s is ShipmentStatus => !!s);
  }

  /**
   * Track a single shipment
   */
  async trackOne(shipmentNumber: string): Promise<ShipmentStatus | null> {
    const results = await this.track([shipmentNumber]);
    return results.length > 0 ? results[0] : null;
  }
}
