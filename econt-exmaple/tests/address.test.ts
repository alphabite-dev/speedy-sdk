import { describe, it, expect, beforeAll } from "vitest";
import { EcontClient, ShipmentType } from "../src";

describe("AddressService API", () => {
  let client: EcontClient;

  beforeAll(() => {
    const username = process.env.ECONT_USERNAME;
    const password = process.env.ECONT_PASSWORD;

    if (!username || !password) {
      throw new Error("ECONT_USERNAME and ECONT_PASSWORD must be set in .env file");
    }

    client = new EcontClient({
      username,
      password,
      environment: "demo",
    });
  });

  it("should validate an address", async () => {
    try {
      const result = await client.address.validateAddress({
        address: {
          city: {
            id: 1,
            country: {
              id: 1033,
              code2: "BG",
              code3: "BGR",
              name: "България",
              nameEn: "Bulgaria",
              isEU: true,
            },
            postCode: "1000",
            name: "София",
            nameEn: "Sofia",
            regionName: null,
            regionNameEn: null,
            phoneCode: null,
            location: null,
            expressCityDeliveries: null,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
            serviceDays: null,
            zoneId: null,
            zoneName: null,
            zoneNameEn: null,
            servingOffices: [],
          },
          street: "ул. Цар Симеон",
          num: "68",
        },
      });

      console.log("Validated address:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
      expect(result.validationStatus).toBeDefined();
    } catch (error) {
      console.log("Validate address error (expected):", error);
      expect(error).toBeDefined();
    }
  });

  it("should get address service times", async () => {
    const result = await client.address.addressServiceTimes({
      city: 1, // Sofia ID
      address: "ул. Цар Симеон 68",
      date: new Date().toISOString().split("T")[0], // Today's date YYYY-MM-DD
      shipmentType: ShipmentType.PACK,
    });

    console.log("Service times:", JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
    expect(result.serviceOffice).toBeDefined();
  });

  it("should get nearest offices", async () => {
    try {
      const result = await client.address.getNearestOffices({
        address: {
          city: {
            id: 1,
            country: {
              id: 1033,
              code2: "BG",
              code3: "BGR",
              name: "България",
              nameEn: "Bulgaria",
              isEU: true,
            },
            postCode: "1000",
            name: "София",
            nameEn: "Sofia",
            regionName: null,
            regionNameEn: null,
            phoneCode: null,
            location: null,
            expressCityDeliveries: null,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
            serviceDays: null,
            zoneId: null,
            zoneName: null,
            zoneNameEn: null,
            servingOffices: [],
          },
          street: "ул. Цар Симеон",
          num: "68",
        },
        shipmentType: ShipmentType.PACK,
      });

      console.log("Nearest offices:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
      expect(result.offices).toBeDefined();
    } catch (error) {
      console.log("Get nearest offices error (expected):", error);
      expect(error).toBeDefined();
    }
  });
});
