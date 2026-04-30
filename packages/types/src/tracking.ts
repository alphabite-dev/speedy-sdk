/**
 * Tracking types for Speedy API
 */

import { ShipmentStatus } from "./shipments";

export interface TrackingInfo {
  trackingNumber: string;
  shipmentNumber: string;
  status: ShipmentStatus;
  currentLocation?: Location;
  estimatedDelivery?: string | null;
  actualDelivery?: string | null;
  events: TrackingEvent[];
  recipientName?: string;
  deliveryNote?: string | null;
}

export interface Location {
  officeId?: number;
  officeName?: string;
  cityName: string;
  address?: string;
}

export interface TrackingEvent {
  eventId: number;
  timestamp: string;
  status: ShipmentStatus;
  location: Location;
  description: string;
  operatorName?: string | null;
  note?: string | null;
}

export interface TrackShipmentRequest {
  trackingNumber: string;
}

export interface ParcelOperation {
  date: string;
  operationCode: string;
  operationDescription: string;
  siteId?: number;
  siteName?: string;
  operatorName?: string;
  note?: string;
}

export interface ParcelInfo {
  parcelId: string;
  ref1?: string;
  ref2?: string;
  operations?: ParcelOperation[];
}

export interface TrackShipmentResponse {
  parcels?: ParcelInfo[];
}

export interface GetTrackingHistoryRequest {
  trackingNumber: string;
}

export interface GetTrackingHistoryResponse {
  trackingNumber: string;
  events: TrackingEvent[];
}
