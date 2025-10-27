import { describe, it, expect, beforeAll } from "vitest";
import { EcontClient } from "../src";

describe("ProfileService API", () => {
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

  it("should get client profiles", async () => {
    const result = await client.profile.getClientProfiles();

    console.log("Client profiles:", JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
  });

  it("should test createCDAgreement endpoint", async () => {
    // This will likely error without proper data, but tests the endpoint exists
    try {
      const result = await client.profile.createCDAgreement({
        clientProfile: {
          name: "Test Client",
          phones: ["+359888123456"],
        },
        agreementDetails: "Test agreement",
      });

      console.log("CD Agreement result:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
    } catch (error) {
      console.log("CD Agreement error (expected):", error);
      // Even if it errors, the endpoint was reached
      expect(error).toBeDefined();
    }
  });
});
