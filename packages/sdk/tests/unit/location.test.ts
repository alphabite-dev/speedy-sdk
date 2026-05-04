import { describe, it, expect, vi, beforeEach } from "vitest";
import { Location } from "../../src/resources/location";
import { ENDPOINTS } from "../../src/constants";
import { HttpClient } from "../../src/utils/http";

interface PostCall {
  url: string;
  data: object | undefined;
  config: { responseType?: string } | undefined;
}

function makeHttpStub(postImpl: (call: PostCall) => unknown): {
  http: HttpClient;
  calls: PostCall[];
} {
  const calls: PostCall[] = [];
  const post = vi.fn(async (url: string, data?: object, config?: object) => {
    const call: PostCall = { url, data, config: config as PostCall["config"] };
    calls.push(call);
    return postImpl(call);
  });
  const http = { post } as unknown as HttpClient;
  return { http, calls };
}

describe("Location resource", () => {
  let http: HttpClient;
  let calls: PostCall[];

  describe("getCountriesCsv", () => {
    beforeEach(() => {
      const stub = makeHttpStub(
        () =>
          "id,name,nameEn,isoAlpha2,isoAlpha3,requireState,defaultOfficeId\n" +
          "100,БЪЛГАРИЯ,Bulgaria,BG,BGR,false,1\n" +
          "276,GERMANY,Germany,DE,DEU,true,\n"
      );
      http = stub.http;
      calls = stub.calls;
    });

    it("posts to /location/country/csv with responseType text", async () => {
      const loc = new Location(http);
      await loc.getCountriesCsv();
      expect(calls).toHaveLength(1);
      expect(calls[0].url).toBe(ENDPOINTS.getAllCountries);
      expect(calls[0].config).toEqual({ responseType: "text" });
    });

    it("forwards language + clientSystemId options to body", async () => {
      const loc = new Location(http);
      await loc.getCountriesCsv({ language: "EN", clientSystemId: 7 });
      expect(calls[0].data).toEqual({ language: "EN", clientSystemId: 7 });
    });

    it("returns parsed rows with numeric + boolean coercion", async () => {
      const loc = new Location(http);
      const rows = await loc.getCountriesCsv();
      expect(rows).toEqual([
        {
          id: 100,
          name: "БЪЛГАРИЯ",
          nameEn: "Bulgaria",
          isoAlpha2: "BG",
          isoAlpha3: "BGR",
          requireState: false,
          defaultOfficeId: 1,
        },
        {
          id: 276,
          name: "GERMANY",
          nameEn: "Germany",
          isoAlpha2: "DE",
          isoAlpha3: "DEU",
          requireState: true,
          defaultOfficeId: undefined,
        },
      ]);
    });
  });

  describe("getStatesCsv", () => {
    it("interpolates countryId into URL and parses response", async () => {
      const stub = makeHttpStub(
        () => "id,name,nameEn,isoAlpha,countryId\n10,CALIFORNIA,California,CA,840\n"
      );
      const loc = new Location(stub.http);
      const rows = await loc.getStatesCsv(840);
      expect(stub.calls[0].url).toBe("/location/state/csv/840");
      expect(stub.calls[0].config).toEqual({ responseType: "text" });
      expect(rows).toEqual([
        { id: 10, name: "CALIFORNIA", nameEn: "California", isoAlpha: "CA", countryId: 840 },
      ]);
    });
  });

  describe("getSitesCsv", () => {
    it("coerces all numeric site columns", async () => {
      const stub = makeHttpStub(
        () =>
          "id,countryId,mainSiteId,type,typeEn,name,nameEn,municipality,municipalityEn,region,regionEn,postCode,addressNomenclature,x,y,servingDays,servingOfficeId,servingHubOfficeId\n" +
          "68134,100,,гр.,city,СОФИЯ,SOFIA,Sofia,Sofia,Sofia,Sofia,1000,1,42.6977,23.3219,5,1,2\n"
      );
      const loc = new Location(stub.http);
      const rows = await loc.getSitesCsv(100);
      expect(stub.calls[0].url).toBe("/location/site/csv/100");
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe(68134);
      expect(rows[0].countryId).toBe(100);
      expect(rows[0].mainSiteId).toBeUndefined();
      expect(rows[0].x).toBeCloseTo(42.6977);
      expect(rows[0].y).toBeCloseTo(23.3219);
      expect(rows[0].servingDays).toBe(5);
      expect(rows[0].servingOfficeId).toBe(1);
      expect(rows[0].servingHubOfficeId).toBe(2);
      expect(rows[0].name).toBe("СОФИЯ");
      expect(rows[0].nameEn).toBe("SOFIA");
    });
  });

  describe("getPostcodesCsv", () => {
    it("returns siteId as number, postcode as string", async () => {
      const stub = makeHttpStub(
        () => "postcode,siteId\n1000,68134\n1407,68134\n"
      );
      const loc = new Location(stub.http);
      const rows = await loc.getPostcodesCsv(100);
      expect(stub.calls[0].url).toBe("/location/postcode/csv/100");
      expect(rows).toEqual([
        { postcode: "1000", siteId: 68134 },
        { postcode: "1407", siteId: 68134 },
      ]);
    });
  });

  describe("findOffices", () => {
    it("posts to /location/office without responseType override", async () => {
      const stub = makeHttpStub(() => ({ offices: [] }));
      const loc = new Location(stub.http);
      const res = await loc.findOffices({ siteId: 68134, limit: 10 });
      expect(stub.calls[0].url).toBe(ENDPOINTS.findOffice);
      expect(stub.calls[0].data).toEqual({ siteId: 68134, limit: 10 });
      expect(stub.calls[0].config).toBeUndefined();
      expect(res).toEqual({ offices: [] });
    });

    it("defaults params to empty object", async () => {
      const stub = makeHttpStub(() => ({ offices: [] }));
      const loc = new Location(stub.http);
      await loc.findOffices();
      expect(stub.calls[0].data).toEqual({});
    });
  });
});
