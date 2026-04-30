import { describe, it, expect, beforeAll } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Debug API Responses", () => {
  let client: SpeedyClient;

  beforeAll(() => {
    client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });
  });

  it("should log calculation response structure WITH privatePerson", async () => {
    try {
      const requestData = {
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 68134,
          },
        },
        service: {
          serviceIds: [505],
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
        },
        payment: {
          courierServicePayer: "SENDER" as const,
        },
      };

      console.log("CALCULATION REQUEST:", JSON.stringify(requestData, null, 2));
      const result = await client.calculation.calculate(requestData);

      console.log("CALCULATION RESPONSE:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
    } catch (error) {
      console.log("CALCULATION ERROR:", error);
      throw error;
    }
  });

  it("should log findSites response structure", async () => {
    try {
      const result = await client.address.findSites({
        countryId: 100,
        name: "SOFIA",
      });

      console.log("FIND SITES RESPONSE:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
    } catch (error) {
      console.log("FIND SITES ERROR:", error);
      throw error;
    }
  });

  it("should log findComplexes response structure", async () => {
    try {
      const result = await client.address.findComplexes(68134, "KRASN");

      console.log("FIND COMPLEXES RESPONSE:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
    } catch (error) {
      console.log("FIND COMPLEXES ERROR:", error);
      throw error;
    }
  });

  it("should debug shipment from office creation", async () => {
    try {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "SENDER",
        },
        sender: {
          phone1: {
            number: "0888112233",
          },
          clientName: "Company LTD",
          contactName: "IVAN PETROV",
          email: "ivan@petrov.bg",
          privatePerson: false,
          dropoffOfficeId: 2,
        },
        recipient: {
          phone1: {
            number: "0899445566",
          },
          clientName: "VASIL GEORGIEV",
          email: "vasil@georgiev.bg",
          privatePerson: true,
          address: {
            countryId: 100,
            siteId: 68134,
            streetId: 3109,
            streetNo: "1A",
          },
        },
        ref1: "TEST FROM OFFICE DEBUG",
      });

      console.log("CREATE SHIPMENT FROM OFFICE RESPONSE:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
    } catch (error: any) {
      console.log("CREATE SHIPMENT FROM OFFICE ERROR:", error.message || error);
      if (error.response) {
        console.log("ERROR RESPONSE:", JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  });
});
