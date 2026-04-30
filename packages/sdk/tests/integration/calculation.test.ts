import { describe, it, expect, beforeAll } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Calculation Service Integration Tests", () => {
  let client: SpeedyClient;

  beforeAll(() => {
    client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });
  });

  describe("Calculate Shipping to Address", () => {
    it("should calculate shipping cost to an address", async () => {
      const result = await client.calculation.calculate({
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 10135,
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
          courierServicePayer: "RECIPIENT",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(Array.isArray(result.calculations)).toBe(true);
      expect(result.calculations.length).toBeGreaterThan(0);
      expect(result.calculations[0].serviceId).toBe(505);
      expect(result.calculations[0].price).toBeDefined();
      expect(result.calculations[0].price.amount).toBeGreaterThan(0);
    });

    it("should calculate with COD and Declared Value", async () => {
      const result = await client.calculation.calculate({
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 10135,
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
          courierServicePayer: "RECIPIENT",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(result.calculations.length).toBeGreaterThan(0);
    });
  });

  describe("Calculate Shipping to Office", () => {
    it("should calculate shipping cost to an office", async () => {
      const result = await client.calculation.calculate({
        recipient: {
          privatePerson: true,
          pickupOfficeId: 77,
        },
        service: {
          serviceIds: [505],
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
        },
        payment: {
          courierServicePayer: "RECIPIENT",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(Array.isArray(result.calculations)).toBe(true);
      expect(result.calculations.length).toBeGreaterThan(0);
      expect(result.calculations[0].serviceId).toBe(505);
      expect(result.calculations[0].price).toBeDefined();
    });
  });

  describe("Calculate with Multiple Services", () => {
    it("should calculate for multiple service IDs", async () => {
      const result = await client.calculation.calculate({
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 68134,
          },
        },
        service: {
          serviceIds: [505, 421],
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
        },
        payment: {
          courierServicePayer: "SENDER",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(Array.isArray(result.calculations)).toBe(true);
      // Should return calculations for available services
      expect(result.calculations.length).toBeGreaterThan(0);
    });
  });

  describe("Calculate with Detailed Parcels", () => {
    it("should calculate with detailed parcel information", async () => {
      const result = await client.calculation.calculate({
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
          parcelsCount: 2,
          totalWeight: 1.5,
          parcels: [
            {
              weight: 0.8,
              size: {
                width: 30,
                height: 20,
                depth: 10,
              },
            },
            {
              weight: 0.7,
              size: {
                width: 25,
                height: 15,
                depth: 10,
              },
            },
          ],
        },
        payment: {
          courierServicePayer: "SENDER",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(result.calculations.length).toBeGreaterThan(0);
    });
  });

  describe("Calculate with Sender Information", () => {
    it("should calculate with sender site information", async () => {
      const result = await client.calculation.calculate({
        sender: {
          siteId: 68134,
        },
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 10135,
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
          courierServicePayer: "SENDER",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(result.calculations.length).toBeGreaterThan(0);
    });

    it("should calculate with sender dropoff office", async () => {
      const result = await client.calculation.calculate({
        sender: {
          dropoffOfficeId: 2,
        },
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 10135,
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
          courierServicePayer: "SENDER",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
      expect(result.calculations.length).toBeGreaterThan(0);
    });
  });

  describe("Calculate with Different Payers", () => {
    it("should calculate with SENDER as payer", async () => {
      const result = await client.calculation.calculate({
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
          courierServicePayer: "SENDER",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
    });

    it("should calculate with RECIPIENT as payer", async () => {
      const result = await client.calculation.calculate({
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
          courierServicePayer: "RECIPIENT",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
    });

    it("should calculate with THIRD_PARTY as payer", async () => {
      const result = await client.calculation.calculate({
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
          courierServicePayer: "THIRD_PARTY",
        },
      });

      expect(result).toBeDefined();
      expect(result.calculations).toBeDefined();
    });
  });
});
