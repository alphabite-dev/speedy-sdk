import { BaseResource } from "./base";
import { ENDPOINTS } from "../constants";
import { ThreeWayLogisticsRequest, ThreeWayLogisticsResponse } from "../types/threewaylogistics";

/**
 * ThreeWayLogistics resource - handles 3PL operations
 */
export class ThreeWayLogisticsService extends BaseResource {
  /**
   * ThreeWayLogistics operation
   */
  async threeWayLogistics(request: ThreeWayLogisticsRequest): Promise<ThreeWayLogisticsResponse> {
    const response = await this.http.post<ThreeWayLogisticsResponse>(ENDPOINTS.threeWayLogistics, request);
    return response;
  }
}
