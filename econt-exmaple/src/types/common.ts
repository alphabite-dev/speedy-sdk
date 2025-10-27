/**
 * Common types used across the SDK
 */

export interface CacheConfig {
  enabled: boolean;
  directory: string;
  ttl?: number;
}

export interface EcontConfig {
  username: string;
  password: string;
  environment?: "production" | "demo";
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
  num?: string;
  other?: string;
  location?: GeoLocation | null;
  zip?: string | null;
  hezid?: string | null;
  officeCode?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  confidence: number;
}

export interface City {
  id: number;
  country: Country;
  postCode: string;
  name: string;
  nameEn: string;
  regionName: string | null;
  regionNameEn: string | null;
  phoneCode: string | null;
  location: GeoLocation | null;
  expressCityDeliveries: boolean | null;
  monday: boolean | null;
  tuesday: boolean | null;
  wednesday: boolean | null;
  thursday: boolean | null;
  friday: boolean | null;
  saturday: boolean | null;
  sunday: boolean | null;
  serviceDays: number | null;
  zoneId: number | null;
  zoneName: string | null;
  zoneNameEn: string | null;
  servingOffices: ServingOffice[];
}

export interface Country {
  id: number | null;
  code2: string;
  code3: string;
  name: string;
  nameEn: string;
  isEU: boolean;
}

export interface ServingOffice {
  officeCode: string;
  servingType: string;
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
