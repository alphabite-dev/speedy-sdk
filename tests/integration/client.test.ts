import { describe, it, expect } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Client Initialization and Configuration Tests", () => {
  it("should initialize client with valid credentials", () => {
    const client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });

    expect(client).toBeDefined();
    expect(client.shipments).toBeDefined();
    expect(client.tracking).toBeDefined();
    expect(client.offices).toBeDefined();
    expect(client.address).toBeDefined();
    expect(client.print).toBeDefined();
    expect(client.calculation).toBeDefined();
  });

  it("should throw error when username is missing", () => {
    expect(() => {
      new SpeedyClient({
        username: "",
        password: "password",
        environment: "production",
      });
    }).toThrow("Username is required");
  });

  it("should throw error when password is missing", () => {
    expect(() => {
      new SpeedyClient({
        username: "username",
        password: "",
        environment: "production",
      });
    }).toThrow("Password is required");
  });

  it("should initialize with cache configuration", () => {
    const client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
      cache: {
        enabled: true,
        directory: ".cache/speedy-test",
        ttl: 3600,
      },
    });

    expect(client).toBeDefined();
    const status = client.getCacheStatus();
    expect(status).toBeDefined();
  });

  it("should handle timeout configuration", () => {
    const client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
      timeout: 5000,
    });

    expect(client).toBeDefined();
  });

  it("should handle maxRetries configuration", () => {
    const client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
      maxRetries: 3,
    });

    expect(client).toBeDefined();
  });
});
