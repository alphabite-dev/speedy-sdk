/**
 * Location nomenclature (CSV export) types
 */

export type LocationLanguage = "EN" | "BG";

export interface LocationCsvOptions {
  language?: LocationLanguage;
  clientSystemId?: number;
}

export interface GetCountriesCsvRequest extends LocationCsvOptions {}

export interface GetStatesCsvRequest extends LocationCsvOptions {
  countryId: number;
}

export interface GetSitesCsvRequest extends LocationCsvOptions {
  countryId: number;
}

export interface GetPostcodesCsvRequest extends LocationCsvOptions {
  countryId: number;
}

/**
 * Raw CSV text returned by Speedy nomenclature endpoints.
 * UTF-8, comma-separated, first row is header.
 */
export type LocationCsvResponse = string;

/** Row from /location/country/csv */
export interface CountryCsvRow {
  id: number;
  name: string;
  nameEn: string;
  isoAlpha2: string;
  isoAlpha3: string;
  postCodeFormats?: string;
  requireState?: boolean;
  addressType?: string;
  currencyCode?: string;
  defaultOfficeId?: number;
  streetTypes?: string;
  streetTypesEn?: string;
  complexTypes?: string;
  complexTypesEn?: string;
  siteNomen?: string;
}

/** Row from /location/state/csv/{countryId} */
export interface StateCsvRow {
  id: number;
  name: string;
  nameEn: string;
  isoAlpha?: string;
  countryId: number;
}

/** Row from /location/site/csv/{countryId} */
export interface SiteCsvRow {
  id: number;
  countryId: number;
  mainSiteId?: number;
  type?: string;
  typeEn?: string;
  name: string;
  nameEn: string;
  municipality?: string;
  municipalityEn?: string;
  region?: string;
  regionEn?: string;
  postCode?: string;
  addressNomenclature?: string;
  x?: number;
  y?: number;
  servingDays?: number;
  servingOfficeId?: number;
  servingHubOfficeId?: number;
}

/** Row from /location/postcode/csv/{countryId} */
export interface PostcodeCsvRow {
  postcode: string;
  siteId: number;
}
