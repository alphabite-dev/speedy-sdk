import { describe, it, expect, beforeAll } from "vitest";
import { EcontClient } from "../src";

describe("Offices API", () => {
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

  it("should get list of offices", async () => {
    const offices = await client.offices.list();

    console.log("Offices count:", offices.length);
    console.log("Sample office:", JSON.stringify(offices[0], null, 2));

    expect(Array.isArray(offices)).toBe(true);
    expect(offices.length).toBeGreaterThan(0);
  });

  it("should get offices by country code", async () => {
    const offices = await client.offices.list({ countryCode: "BGR" });

    console.log("BGR offices count:", offices.length);
    console.log("Sample BGR office:", JSON.stringify(offices[0], null, 2));

    expect(Array.isArray(offices)).toBe(true);
    expect(offices.length).toBeGreaterThan(0);
  });

  it("should get list of cities", async () => {
    const cities = await client.offices.getCities({ countryCode: "BGR" });

    console.log("Cities count:", cities.length);
    console.log("Sample city:", JSON.stringify(cities[0], null, 2));

    expect(Array.isArray(cities)).toBe(true);
    expect(cities.length).toBeGreaterThan(0);
  });

  it("should get list of countries", async () => {
    const countries = await client.offices.getCountries();

    console.log("Countries count:", countries.length);
    console.log("Sample country:", JSON.stringify(countries[0], null, 2));

    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
  });

  it("should get streets in a city", async () => {
    const streets = await client.offices.getStreets(1); // Sofia

    console.log("Streets count:", streets.length);
    if (streets.length > 0) {
      console.log("Sample street:", JSON.stringify(streets[0], null, 2));
    }

    expect(Array.isArray(streets)).toBe(true);
  });

  it("should get quarters in a city", async () => {
    const quarters = await client.offices.getQuarters(1); // Sofia

    console.log("Quarters count:", quarters.length);
    if (quarters.length > 0) {
      console.log("Sample quarter:", JSON.stringify(quarters[0], null, 2));
    }

    expect(Array.isArray(quarters)).toBe(true);
  });
});
