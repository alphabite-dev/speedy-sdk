/**
 * Shipment types for Speedy API
 */

import { PhoneNumber } from "./common";

export interface ShipmentAddress {
  countryId: number;
  siteId?: number;
  siteType?: string;
  siteName?: string;
  postCode?: string;
  streetId?: number;
  streetType?: string;
  streetName?: string;
  streetNo?: string;
  complexId?: number;
  complexType?: string;
  complexName?: string;
  blockNo?: string;
  entranceNo?: string;
  floorNo?: string;
  apartmentNo?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressNote?: string;
  poiId?: number;
}

export interface ShipmentParty {
  phone1: PhoneNumber;
  phone2?: PhoneNumber;
  phone3?: PhoneNumber;
  clientName?: string;
  contactName?: string;
  email?: string;
  privatePerson?: boolean;
  address?: ShipmentAddress;
  pickupOfficeId?: number;
  dropoffOfficeId?: number;
}

export interface ParcelSize {
  width: number;
  height: number;
  depth: number;
}

export interface ShipmentParcel {
  seqNo: number;
  weight: number;
  size?: ParcelSize;
}

export interface CODService {
  amount: number;
  processingType: "CASH" | "BANK_TRANSFER";
}

export interface DeclaredValueService {
  amount: number;
  fragile?: boolean;
  ignoreIfNotApplicable?: boolean;
}

export interface OBPDService {
  option: "OPEN" | "TEST" | "RETURN";
  returnShipmentServiceId?: number;
  returnShipmentPayer?: "SENDER" | "RECIPIENT" | "THIRD_PARTY";
}

export interface AdditionalServices {
  cod?: CODService;
  declaredValue?: DeclaredValueService;
  obpd?: OBPDService;
}

export interface Service {
  serviceId: number;
  additionalServices?: AdditionalServices;
  saturdayDelivery?: boolean;
  autoAdjustPickupDate?: boolean;
  pickupDate?: string;
}

export interface Payment {
  courierServicePayer: "SENDER" | "RECIPIENT" | "THIRD_PARTY";
  declaredValuePayer?: "SENDER" | "RECIPIENT" | "THIRD_PARTY";
  thirdPartyClientId?: number;
}

export interface ShipmentContent {
  parcelsCount: number;
  totalWeight: number;
  contents?: string;
  package?: string;
  parcels?: ShipmentParcel[];
}

export type ShipmentStatus =
  | "pending"
  | "processing"
  | "picked-up"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "delayed"
  | "failed";

export interface CreateShipmentRequest {
  service: Service;
  content: ShipmentContent;
  payment: Payment;
  sender: ShipmentParty;
  recipient: ShipmentParty;
  ref1?: string;
  ref2?: string;
}

export interface CreateShipmentResponse {
  id: string;
  parcels?: Array<{
    id: string;
    seqNo: number;
  }>;
}

export interface GetShipmentResponse {
  shipments?: Array<{
    id: string;
    pickupDate?: string;
    deliveryDeadline?: string;
  }>;
}

export interface CalculateShippingRequest {
  sender?: { siteId?: number; dropoffOfficeId?: number };
  recipient: { siteId?: number; pickupOfficeId?: number };
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

export interface CalculateShippingResponse {
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

export interface CancelShipmentRequest {
  shipmentId: string;
  comment: string;
}

export interface CancelShipmentResponse {
  success: boolean;
  message: string;
  cancelledAt: string;
}
