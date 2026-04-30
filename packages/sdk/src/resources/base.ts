import { HttpClient } from "../utils/http";

/**
 * Base resource class that all resource classes extend from
 */
export abstract class BaseResource {
  protected http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
}
