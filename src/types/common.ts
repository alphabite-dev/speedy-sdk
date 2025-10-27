/**
 * Common types used across the SDK
 */

export interface CacheConfig {
  enabled: boolean;
  directory: string;
  ttl?: number;
}

export interface SpeedyConfig {
  username: string;
  password: string;
  environment?: "production" | "sandbox";
  timeout?: number;
  maxRetries?: number;
  cache?: CacheConfig;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface Address {
  id?: number | null;
  city?: City;
  fullAddress?: string;
  fullAddressEn?: string;
  quarter?: string | null;
  street?: string | null;
  streetNumber?: string;
  blockNumber?: string | null;
  entrance?: string | null;
  floor?: string | null;
  apartment?: string | null;
  postCode?: string | null;
  note?: string | null;
  location?: GeoLocation | null;
  officeId?: number | null;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface City {
  id: number;
  countryId: number;
  postCode: string;
  name: string;
  nameEn: string;
  regionName?: string | null;
  regionNameEn?: string | null;
  municipality?: string | null;
  municipalityEn?: string | null;
  servingOfficeId?: number | null;
  servingDays?: number | null;
}

export interface Country {
  id: number;
  isoAlpha2: string;
  isoAlpha3: string;
  name: string;
  nameEn: string;
  isEU: boolean;
}

export interface PhoneNumber {
  number: string;
  type?: "mobile" | "landline";
}

export interface ContactPerson {
  name: string;
  phones: PhoneNumber[];
  email?: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface Weight {
  value: number;
  unit: "kg" | "g";
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: "cm" | "m";
}
