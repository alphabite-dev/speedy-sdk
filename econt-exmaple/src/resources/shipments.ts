import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import {
  ShippingLabel,
  CreateLabelRequest,
  CreateLabelResponse,
  CreateLabelsRequest,
  CreateLabelsResponse,
  DeleteLabelsRequest,
  DeleteLabelsResponse,
  UpdateLabelRequestData,
  UpdateLabelResponseData,
  UpdateLabelsRequest,
  UpdateLabelsResponse,
  CheckPossibleShipmentEditionsRequest,
  CheckPossibleShipmentEditionsResponse,
  GroupingRequest,
  GroupingResponse,
  GroupingCancelationRequest,
  GroupingCancelationResponse,
  RequestCourierRequest,
  RequestCourierResponse,
  GetShipmentStatusesRequest,
  GetShipmentStatusesResponse,
  GetRequestCourierStatusRequest,
  GetRequestCourierStatusResponse,
  GetMyAWBRequest,
  GetMyAWBResponse,
  SetITUCodeRequest,
  SetITUCodeResponse,
} from "../types/shipments";

/**
 * Shipments resource - handles shipment-related operations
 */
export class Shipments extends BaseResource {
  /**
   * Create a shipping label
   */
  async createLabel(
    label: ShippingLabel,
    options?: {
      requestCourierTimeFrom?: string;
      requestCourierTimeTo?: string;
      mode?: "calculate" | "validate" | "create" | "calculate_with_block";
    }
  ): Promise<CreateLabelResponse> {
    const request: CreateLabelRequest = {
      label,
      ...options,
    };

    const response = await this.http.post<CreateLabelResponse>(ENDPOINTS.createLabel, request);
    return response;
  }

  /**
   * Calculate shipping cost (alias for createLabel with mode=calculate)
   */
  async calculate(label: ShippingLabel): Promise<CreateLabelResponse> {
    return this.createLabel(label, { mode: "calculate" });
  }

  /**
   * Validate label (alias for createLabel with mode=validate)
   */
  async validate(label: ShippingLabel): Promise<CreateLabelResponse> {
    return this.createLabel(label, { mode: "validate" });
  }

  /**
   * Create multiple shipping labels
   */
  async createLabels(
    labels: ShippingLabel[],
    options?: {
      runAsyncAndEmailResultTo?: string;
      mode?: "validate" | "calculate" | "create";
    }
  ): Promise<CreateLabelsResponse> {
    const request: CreateLabelsRequest = {
      labels,
      ...options,
    };

    const response = await this.http.post<CreateLabelsResponse>(ENDPOINTS.createLabels, request);
    return response;
  }

  /**
   * Delete/cancel labels
   */
  async deleteLabels(shipmentNumbers: string[]): Promise<DeleteLabelsResponse> {
    const request: DeleteLabelsRequest = {
      shipmentNumbers,
    };

    const response = await this.http.post<DeleteLabelsResponse>(ENDPOINTS.deleteLabels, request);
    return response;
  }

  /**
   * Update a label
   */
  async updateLabel(data: UpdateLabelRequestData): Promise<UpdateLabelResponseData> {
    const response = await this.http.post<UpdateLabelResponseData>(ENDPOINTS.updateLabel, data);
    return response;
  }

  /**
   * Update multiple labels
   */
  async updateLabels(request: UpdateLabelsRequest): Promise<UpdateLabelsResponse> {
    const response = await this.http.post<UpdateLabelsResponse>(ENDPOINTS.updateLabels, request);
    return response;
  }

  /**
   * Check if shipment can be edited
   */
  async checkPossibleShipmentEditions(shipmentNums: number[]): Promise<CheckPossibleShipmentEditionsResponse> {
    const request: CheckPossibleShipmentEditionsRequest = {
      shipmentNums,
    };

    const response = await this.http.post<CheckPossibleShipmentEditionsResponse>(
      ENDPOINTS.checkPossibleShipmentEditions,
      request
    );
    return response;
  }

  /**
   * Group shipments
   */
  async grouping(labels: number[]): Promise<GroupingResponse> {
    const request: GroupingRequest = {
      labels,
    };

    const response = await this.http.post<GroupingResponse>(ENDPOINTS.grouping, request);
    return response;
  }

  /**
   * Cancel grouping
   */
  async groupingCancelation(groupLabel: number): Promise<GroupingCancelationResponse> {
    const request: GroupingCancelationRequest = {
      groupLabel,
    };

    const response = await this.http.post<GroupingCancelationResponse>(ENDPOINTS.groupingCancelation, request);
    return response;
  }

  /**
   * Request courier pickup
   */
  async requestCourier(request: RequestCourierRequest): Promise<RequestCourierResponse> {
    const response = await this.http.post<RequestCourierResponse>(ENDPOINTS.requestCourier, request);
    return response;
  }

  /**
   * Get shipment statuses (tracking)
   */
  async getShipmentStatuses(shipmentNumbers: string[]): Promise<GetShipmentStatusesResponse> {
    const request: GetShipmentStatusesRequest = {
      shipmentNumbers,
    };

    const response = await this.http.post<GetShipmentStatusesResponse>(ENDPOINTS.getShipmentStatuses, request);
    return response;
  }

  /**
   * Get courier request status
   */
  async getRequestCourierStatus(requestCourierIds: string[]): Promise<GetRequestCourierStatusResponse> {
    const request: GetRequestCourierStatusRequest = {
      requestCourierIds,
    };

    const response = await this.http.post<GetRequestCourierStatusResponse>(ENDPOINTS.getRequestCourierStatus, request);
    return response;
  }

  /**
   * Get AWB (Air Waybill) information
   */
  async getMyAWB(request: GetMyAWBRequest): Promise<GetMyAWBResponse> {
    const response = await this.http.post<GetMyAWBResponse>(ENDPOINTS.getMyAWB, request);
    return response;
  }

  /**
   * Set ITU Code for shipment
   */
  async setITUCode(awbBarcode: string, truckRegNum: string, ITU_code: string): Promise<SetITUCodeResponse> {
    const request: SetITUCodeRequest = {
      awbBarcode,
      truckRegNum,
      ITU_code,
    };

    const response = await this.http.post<SetITUCodeResponse>(ENDPOINTS.setTUCode, request);
    return response;
  }
}
