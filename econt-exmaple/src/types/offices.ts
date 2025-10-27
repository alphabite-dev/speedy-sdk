import { City } from "./common";

/**
 * Office types
 */

export interface Office {
  id: number;
  code: string;
  isMPS: boolean;
  isAPS: boolean;
  name: string;
  nameEn: string;
  phones: string[];
  emails: string[];
  address: OfficeAddress;
  info: string;
  currency: string;
  language: string | null;
  normalBusinessHoursFrom: number;
  normalBusinessHoursTo: number;
  halfDayBusinessHoursFrom: number;
  halfDayBusinessHoursTo: number;
  shipmentTypes: string[];
  partnerCode: string;
  hubCode: string;
  hubName: string;
  hubNameEn: string;
  isDrive: boolean;
}

export interface OfficeAddress {
  id: number | null;
  city: City;
  fullAddress: string;
  fullAddressEn: string;
  quarter: string | null;
  street: string | null;
  num: string;
  other: string;
  location: Location | null;
  zip: string | null;
  hezid: string | null;
}

export interface Location {
  latitude: number;
  longitude: number;
  confidence: number;
}

export interface GetOfficesRequest {
  countryCode?: string;
  cityId?: number;
  officeCode?: string;
}

export interface GetOfficesResponse {
  offices: Office[];
}
