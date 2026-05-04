/**
 * Types for Speedy API /services endpoint
 */

export interface GetServicesRequest {
	clientId?: number; // Optional: profile/client ID to get services for
}

export interface CourierService {
	id: number;
	name: string; // BG
	nameEn: string;
	additionalServices?: AdditionalCourierServices;
	cargoType?: 'PARCEL' | 'PALLET' | 'TYRE';
	requireParcelWeight?: boolean;
	requireParcelSize?: boolean;
}

export interface AdditionalCourierServices {
	cod?: AdditionalCourierService;
	obpd?: AdditionalCourierService; // open-before-pay-deliver = "test on delivery"
	declaredValue?: AdditionalCourierService;
	fixedTimeDelivery?: AdditionalCourierService;
	specialDelivery?: AdditionalCourierService;
	deliveryToFloor?: AdditionalCourierService;
	rod?: AdditionalCourierService; // return of documents
	returnReceipt?: AdditionalCourierService;
	swap?: AdditionalCourierService;
	rop?: AdditionalCourierService; // return of parcel
	returnVoucher?: AdditionalCourierService;
}

export interface AdditionalCourierService {
	allowance: 'FORBIDDEN' | 'ALLOWED' | 'REQUIRED';
}

export interface GetServicesResponse {
	services: CourierService[];
}
