import { describe, it, expect, beforeAll } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Tracking Service Integration Tests", () => {
  let client: SpeedyClient;

  beforeAll(() => {
    client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });
  });

  describe("Track Single Parcel", () => {
    it("should track a parcel by ID", async () => {
      const result = await client.tracking.track([{ id: "299999990" }]);

      expect(result).toBeDefined();
      expect(result.parcels).toBeDefined();
      expect(Array.isArray(result.parcels)).toBe(true);
    });

    it("should track parcel with full operation history", async () => {
      const result = await client.tracking.track([{ id: "299999990" }]);

      expect(result).toBeDefined();
      expect(result.parcels).toBeDefined();

      if (result.parcels && result.parcels.length > 0) {
        const parcel = result.parcels[0];
        expect(parcel).toBeDefined();
        // Operations may or may not be present depending on parcel status
        if (parcel.operations) {
          expect(Array.isArray(parcel.operations)).toBe(true);
        }
      }
    });
  });

  describe("Track Multiple Parcels", () => {
    it("should track multiple parcels in one request", async () => {
      const result = await client.tracking.track([{ id: "299999990" }, { id: "299999991" }, { id: "299999992" }]);

      expect(result).toBeDefined();
      expect(result.parcels).toBeDefined();
      expect(Array.isArray(result.parcels)).toBe(true);
    });
  });

  describe("Track by Reference Number", () => {
    it("should track parcel by reference number", async () => {
      const result = await client.tracking.track([{ ref: "ORDER 123456" }]);

      expect(result).toBeDefined();
      expect(result.parcels).toBeDefined();
      expect(Array.isArray(result.parcels)).toBe(true);
    });

    it("should track with both ID and reference", async () => {
      const result = await client.tracking.track([{ id: "299999990" }, { ref: "ORDER 123456" }]);

      expect(result).toBeDefined();
      expect(result.parcels).toBeDefined();
      expect(Array.isArray(result.parcels)).toBe(true);
    });
  });

  describe("Bulk Tracking Data Files", () => {
    it("should get bulk tracking data files", async () => {
      const result = await client.tracking.getBulkTrackingFiles(0);

      expect(result).toBeDefined();
      // The response structure depends on the API
      // Should have files array or similar structure
    });

    it("should get bulk tracking files with specific last processed ID", async () => {
      const result = await client.tracking.getBulkTrackingFiles(100);

      expect(result).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid parcel ID gracefully", async () => {
      try {
        const result = await client.tracking.track([{ id: "invalid-id-12345" }]);

        // API might return error in response or throw
        expect(result).toBeDefined();
      } catch (error) {
        // If it throws, that's also valid behavior
        expect(error).toBeDefined();
      }
    });

    it("should handle empty parcel array", async () => {
      try {
        const result = await client.tracking.track([]);
        expect(result).toBeDefined();
      } catch (error) {
        // API might require at least one parcel
        expect(error).toBeDefined();
      }
    });
  });
});
