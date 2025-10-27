import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";

export interface PrintRequest {
  parcels: Array<{ id?: string }>;
  paperSize: "A4" | "A6" | "A4_4xA6";
  format?: "pdf" | "zpl";
}

export interface PrintResponse {
  data?: string; // base64 encoded
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Print resource - handles label printing operations
 */
export class PrintService extends BaseResource {
  /**
   * Print labels for parcels
   */
  async print(request: PrintRequest): Promise<PrintResponse> {
    return this.http.post<PrintResponse>(ENDPOINTS.print, request);
  }

  /**
   * Print with extended information
   */
  async printExtended(request: PrintRequest): Promise<PrintResponse> {
    return this.http.post<PrintResponse>(ENDPOINTS.printExtended, request);
  }

  /**
   * Get label information
   */
  async getLabelInfo(parcels: Array<{ id: string }>): Promise<PrintResponse> {
    return this.http.post<PrintResponse>(ENDPOINTS.labelInfo, { parcels });
  }
}
