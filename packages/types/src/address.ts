/**
 * Address types for Speedy API
 */

import { Address, City } from "./common";

export interface ValidateAddressRequest {
  address: Address;
}

export interface ValidateAddressResponse {
  isValid: boolean;
  validatedAddress?: Address;
  suggestions?: Address[];
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface GetCitiesRequest {
  countryId?: number;
  name?: string;
  postCode?: string;
}

export interface GetCitiesResponse {
  sites: City[];
  cities?: City[]; // Backwards compatibility alias
}

export interface Street {
  id: number;
  name: string;
  nameEn?: string;
  type?: string;
  cityId: number;
}

export interface GetStreetsRequest {
  siteId: number;
  name?: string;
}

export interface GetStreetsResponse {
  streets: Street[];
}

export interface Quarter {
  id: number;
  name: string;
  nameEn?: string;
  type?: string;
  siteId: number;
}

export interface GetQuartersRequest {
  siteId: number;
  name?: string;
}

export interface GetQuartersResponse {
  complexes: Quarter[];
  quarters?: Quarter[]; // Backwards compatibility alias
}
