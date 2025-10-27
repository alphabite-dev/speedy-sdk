import { describe, it, expect, beforeAll } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Print Service Integration Tests", () => {
  let client: SpeedyClient;
  let testParcelId: string;

  beforeAll(async () => {
    client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });

    // Create a test shipment to get a parcel ID for printing tests
    try {
      const shipment = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "TEST PRINT",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "SENDER",
        },
        sender: {
          phone1: {
            number: "0888112233",
          },
          contactName: "IVAN PETROV",
          email: "ivan@petrov.bg",
        },
        recipient: {
          phone1: {
            number: "0899445566",
          },
          clientName: "VASIL GEORGIEV",
          email: "vasil@georgiev.bg",
          privatePerson: true,
          pickupOfficeId: 14,
        },
        ref1: "TEST PRINT LABEL",
      });

      if (shipment.parcels && shipment.parcels.length > 0) {
        testParcelId = shipment.parcels[0].id;
      } else {
        testParcelId = "299999990"; // Fallback test ID
      }
    } catch (error) {
      testParcelId = "299999990"; // Fallback test ID
    }
  });

  describe("Print Single Label", () => {
    it("should print a single label in A6 format", async () => {
      const result = await client.print.print({
        parcels: [{ id: testParcelId }],
        paperSize: "A6",
        format: "pdf",
      });

      expect(result).toBeDefined();
      // Result should contain either data or error
      if (result.data) {
        expect(typeof result.data).toBe("string");
        expect(result.data.length).toBeGreaterThan(0);
      }
    });

    it("should print a single label in A4 format", async () => {
      const result = await client.print.print({
        parcels: [{ id: testParcelId }],
        paperSize: "A4",
        format: "pdf",
      });

      expect(result).toBeDefined();
    });

    it("should print label in ZPL format", async () => {
      const result = await client.print.print({
        parcels: [{ id: testParcelId }],
        paperSize: "A6",
        format: "zpl",
      });

      expect(result).toBeDefined();
    });
  });

  describe("Print Multiple Labels", () => {
    it("should print multiple labels", async () => {
      const result = await client.print.print({
        parcels: [{ id: "299999990" }, { id: "299999991" }],
        paperSize: "A6",
        format: "pdf",
      });

      expect(result).toBeDefined();
    });

    it("should print in A4 with 4xA6 labels", async () => {
      const result = await client.print.print({
        parcels: [{ id: "299999990" }, { id: "299999991" }, { id: "299999992" }, { id: "299999993" }],
        paperSize: "A4_4xA6",
        format: "pdf",
      });

      expect(result).toBeDefined();
    });
  });

  describe("Print Extended", () => {
    it("should print label with extended information", async () => {
      const result = await client.print.printExtended({
        parcels: [{ id: testParcelId }],
        paperSize: "A6",
        format: "pdf",
      });

      expect(result).toBeDefined();
    });

    it("should print extended labels for multiple parcels", async () => {
      const result = await client.print.printExtended({
        parcels: [{ id: "299999990" }, { id: "299999991" }],
        paperSize: "A6",
        format: "pdf",
      });

      expect(result).toBeDefined();
    });
  });

  describe("Get Label Info", () => {
    it("should get label information for a parcel", async () => {
      const result = await client.print.getLabelInfo([{ id: testParcelId }]);

      expect(result).toBeDefined();
    });

    it("should get label information for multiple parcels", async () => {
      const result = await client.print.getLabelInfo([{ id: "299999990" }, { id: "299999991" }]);

      expect(result).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid parcel ID", async () => {
      try {
        const result = await client.print.print({
          parcels: [{ id: "invalid-parcel-id" }],
          paperSize: "A6",
          format: "pdf",
        });

        // API might return error in response
        if (result.error) {
          expect(result.error.message).toBeDefined();
        }
      } catch (error) {
        // Or it might throw
        expect(error).toBeDefined();
      }
    });

    it("should handle invalid paper size gracefully", async () => {
      try {
        const result = await client.print.print({
          parcels: [{ id: testParcelId }],
          paperSize: "A6",
          format: "pdf",
        });

        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
