/**
 * Tracking types - re-exports from shipments
 * Tracking uses getShipmentStatuses endpoint from ShipmentService
 */

export {
  GetShipmentStatusesRequest,
  GetShipmentStatusesResponse,
  ShipmentStatus,
  ShipmentStatusResultElement,
  ShipmentTrackingEvent,
} from "./shipments";
