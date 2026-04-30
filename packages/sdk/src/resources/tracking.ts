import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { TrackShipmentResponse, GetTrackingHistoryResponse } from "@alphabite/speedy-types";

/**
 * Tracking resource - handles shipment tracking operations
 */
export class Tracking extends BaseResource {
  /**
   * Track parcels
   */
  async track(parcels: Array<{ id?: string; ref?: string }>): Promise<TrackShipmentResponse> {
    return this.http.post<TrackShipmentResponse>(ENDPOINTS.track, { parcels });
  }

  /**
   * Get bulk tracking data files
   */
  async getBulkTrackingFiles(lastProcessedFileId: number): Promise<GetTrackingHistoryResponse> {
    return this.http.post<GetTrackingHistoryResponse>(ENDPOINTS.bulkTrackingDataFiles, {
      lastProcessedFileId,
    });
  }
}
