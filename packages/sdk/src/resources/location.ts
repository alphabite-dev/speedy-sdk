import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { parseCsvRows, CoerceSchema } from "../utils/csv";
import {
  LocationCsvOptions,
  ListOfficesRequest,
  ListOfficesResponse,
  CountryCsvRow,
  StateCsvRow,
  SiteCsvRow,
  PostcodeCsvRow,
} from "@alphabite/speedy-types";

const COUNTRY_SCHEMA: CoerceSchema = {
  numeric: ["id", "defaultOfficeId"],
  boolean: ["requireState"],
};

const STATE_SCHEMA: CoerceSchema = {
  numeric: ["id", "countryId"],
};

const SITE_SCHEMA: CoerceSchema = {
  numeric: [
    "id",
    "countryId",
    "mainSiteId",
    "x",
    "y",
    "servingDays",
    "servingOfficeId",
    "servingHubOfficeId",
  ],
};

const POSTCODE_SCHEMA: CoerceSchema = {
  numeric: ["siteId"],
};

/**
 * Location resource - nomenclature exports + office lookup.
 * CSV endpoints fetch raw CSV from Speedy and return parsed, typed rows.
 */
export class Location extends BaseResource {
  /**
   * GET /location/country/csv - all countries.
   * Columns: id, name, nameEn, isoAlpha2, isoAlpha3, postCodeFormats, requireState,
   * addressType, currencyCode, defaultOfficeId, streetTypes, streetTypesEn,
   * complexTypes, complexTypesEn, siteNomen.
   */
  async getCountriesCsv(opts: LocationCsvOptions = {}): Promise<CountryCsvRow[]> {
    const csv = await this.http.post<string>(ENDPOINTS.getAllCountries, opts, {
      responseType: "text",
    });
    return parseCsvRows<CountryCsvRow>(csv, COUNTRY_SCHEMA);
  }

  /**
   * GET /location/state/csv/{countryId} - all states for a country.
   * Columns: id, name, nameEn, isoAlpha, countryId.
   */
  async getStatesCsv(
    countryId: number,
    opts: LocationCsvOptions = {}
  ): Promise<StateCsvRow[]> {
    const url = ENDPOINTS.getAllStates.replace(":countryId", countryId.toString());
    const csv = await this.http.post<string>(url, opts, { responseType: "text" });
    return parseCsvRows<StateCsvRow>(csv, STATE_SCHEMA);
  }

  /**
   * GET /location/site/csv/{countryId} - all sites for a country.
   * Columns: id, countryId, mainSiteId, type, typeEn, name, nameEn, municipality,
   * municipalityEn, region, regionEn, postCode, addressNomenclature, x, y,
   * servingDays, servingOfficeId, servingHubOfficeId.
   */
  async getSitesCsv(
    countryId: number,
    opts: LocationCsvOptions = {}
  ): Promise<SiteCsvRow[]> {
    const url = ENDPOINTS.getAllSites.replace(":countryId", countryId.toString());
    const csv = await this.http.post<string>(url, opts, { responseType: "text" });
    return parseCsvRows<SiteCsvRow>(csv, SITE_SCHEMA);
  }

  /**
   * GET /location/postcode/csv/{countryId} - all postcodes for a country.
   * Columns: postcode, siteId.
   */
  async getPostcodesCsv(
    countryId: number,
    opts: LocationCsvOptions = {}
  ): Promise<PostcodeCsvRow[]> {
    const url = ENDPOINTS.getAllPostcodes.replace(":countryId", countryId.toString());
    const csv = await this.http.post<string>(url, opts, { responseType: "text" });
    return parseCsvRows<PostcodeCsvRow>(csv, POSTCODE_SCHEMA);
  }

  /**
   * POST /location/office - find offices.
   * All filters optional; pass at least one to avoid huge response.
   */
  async findOffices(params: ListOfficesRequest = {}): Promise<ListOfficesResponse> {
    return this.http.post<ListOfficesResponse>(ENDPOINTS.findOffice, params);
  }
}
