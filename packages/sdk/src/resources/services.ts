import { BaseResource } from './base';
import { ENDPOINTS } from '../constants';
import {
	GetServicesRequest,
	GetServicesResponse,
} from '@alphabite/speedy-types';

/**
 * Services resource - handles service-related operations
 */
export class Services extends BaseResource {
	/**
	 * Get available services for a profile
	 */
	async getServices(request: GetServicesRequest): Promise<GetServicesResponse> {
		return this.http.post<GetServicesResponse>(ENDPOINTS.getServices, request);
	}
}
