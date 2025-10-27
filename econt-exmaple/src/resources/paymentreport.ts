import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { PaymentReportRequest, PaymentReportResponse } from "../types/paymentreport";

/**
 * PaymentReport resource - handles payment reporting operations
 */
export class PaymentReportService extends BaseResource {
  /**
   * Get payment report
   */
  async getPaymentReport(request: PaymentReportRequest): Promise<PaymentReportResponse> {
    const response = await this.http.post<PaymentReportResponse>(ENDPOINTS.paymentReport, request);
    return response;
  }
}
