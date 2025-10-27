import { Address } from "./common";
import { Office } from "./offices";
import { ShipmentType } from "./shipments";

/**
 * Address Service types
 */

export interface WorkingTime {
  start: string;
  end: string;
}

export interface WorkingDateTime {
  dayType: DayType;
  day: string;
  start: string;
  end: string;
}

export enum DayType {
  WORKDAY = "workday",
  HALFDAY = "halfday",
  HOLIDAY = "holiday",
}

export interface ValidateAddressRequest {
  address?: Address;
}

export interface ValidateAddressResponse {
  address?: Address;
  validationStatus?: string;
}

export interface AddressServiceTimesRequest {
  city: number;
  address: string;
  date: string;
  shipmentType: ShipmentType;
}

export interface AddressServiceTimesResponse {
  serviceOffice: Office;
  serviceOfficeLatitude: number;
  serviceOfficeLongitude: number;
  serviceOfficeClientsWorkTimes?: WorkingTime[];
  serviceOfficeCourierWorkTimes?: WorkingTime[];
  serviceOfficeTime?: WorkingDateTime;
  serviceOfficeNext30daysWorkTime?: WorkingDateTime[];
}

export interface GetNearestOfficesRequest {
  address?: Address;
  shipmentType?: ShipmentType;
}

export interface GetNearestOfficesResponse {
  offices?: Office[];
}
