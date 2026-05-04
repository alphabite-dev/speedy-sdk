import { HttpClient } from "./utils/http";
import { API_BASE_URLS } from "./constants";
import { SpeedyConfig } from "@alphabite/speedy-types";
import { Shipments } from "./resources/shipments";
import { Tracking } from "./resources/tracking";
import { Offices } from "./resources/offices";
import { AddressService } from "./resources/address";
import { PrintService } from "./resources/print";
import { CalculationService } from "./resources/calculation";
import { Services } from "./resources/services";
import { Location } from "./resources/location";

/**
 * Main Speedy SDK client
 */
export class SpeedyClient {
  private http: HttpClient;

  public readonly shipments: Shipments;
  public readonly tracking: Tracking;
  public readonly offices: Offices;
  public readonly address: AddressService;
  public readonly print: PrintService;
  public readonly calculation: CalculationService;
  public readonly services: Services;
  public readonly location: Location;

  constructor(config: SpeedyConfig) {
    // Validate credentials
    if (!config.username || config.username.trim() === "") {
      throw new Error("Username is required");
    }
    if (!config.password || config.password.trim() === "") {
      throw new Error("Password is required");
    }

    // Determine base URL
    const baseURL = config.environment === "sandbox" ? API_BASE_URLS.sandbox : API_BASE_URLS.production;

    // Initialize HTTP client
    this.http = new HttpClient({
      baseURL,
      username: config.username,
      password: config.password,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
    });

    // Initialize resources
    this.shipments = new Shipments(this.http);
    this.tracking = new Tracking(this.http);
    this.offices = new Offices(this.http);
    this.address = new AddressService(this.http);
    this.print = new PrintService(this.http);
    this.calculation = new CalculationService(this.http);
    this.services = new Services(this.http);
    this.location = new Location(this.http);
  }
}
