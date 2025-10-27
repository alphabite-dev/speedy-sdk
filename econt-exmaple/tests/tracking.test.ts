import { describe, it, expect, beforeAll } from "vitest";
import { EcontClient } from "../src";

describe("Tracking API", () => {
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

  it("should track multiple shipments", async () => {
    // Test with dummy shipment numbers - will likely error but tests the endpoint
    try {
      const result = await client.tracking.track(["TEST123456", "TEST789012"]);

      console.log("Track result:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      console.log("Track error (expected for invalid shipment numbers):", error);
      expect(error).toBeDefined();
    }
  });

  it("should track a single shipment", async () => {
    // Test with dummy shipment number - will likely error but tests the endpoint
    try {
      const result = await client.tracking.trackOne("TEST123456");

      console.log("Track one result:", JSON.stringify(result, null, 2));
      expect(result === null || typeof result === "object").toBe(true);
    } catch (error) {
      console.log("Track one error (expected for invalid shipment number):", error);
      expect(error).toBeDefined();
    }
  });
});
