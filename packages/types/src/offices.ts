/**
 * Office types for Speedy API
 */

import { City, GeoLocation } from "./common";

export interface Office {
  id: number;
  name: string;
  nameEn?: string;
  type: OfficeType;
  city: City;
  address: string;
  addressEn?: string;
  location?: GeoLocation;
  workingTimeSchedule: WorkingTimeSchedule;
  phones: string[];
  email?: string | null;
  maxParcelDimensions?: OfficeDimensions;
  maxParcelWeight?: number;
  parkingAvailable?: boolean;
  cardPaymentAvailable?: boolean;
  cashPaymentAvailable?: boolean;
}

export type OfficeType = "office" | "apt" | "automated-postal-station";

export interface OfficeDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface WorkingTimeSchedule {
  monday?: WorkingHours;
  tuesday?: WorkingHours;
  wednesday?: WorkingHours;
  thursday?: WorkingHours;
  friday?: WorkingHours;
  saturday?: WorkingHours;
  sunday?: WorkingHours;
}

export interface WorkingHours {
  from: string;
  to: string;
}

export interface ListOfficesRequest {
  cityId?: number;
  siteId?: number;
  name?: string;
  type?: OfficeType;
  countryId?: number;
}

export interface ListOfficesResponse {
  offices: Office[];
}

export interface GetOfficeRequest {
  officeId: number;
}

export interface GetOfficeResponse {
  office: Office;
}

export interface SearchOfficesRequest {
  query: string;
  cityId?: number;
  countryId?: number;
  limit?: number;
}

export interface SearchOfficesResponse {
  offices: Office[];
}
