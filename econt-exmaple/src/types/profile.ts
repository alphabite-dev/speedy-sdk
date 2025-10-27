/**
 * Profile and client types
 */

export interface ClientProfile {
  name?: string;
  nameEn?: string;
  phones?: string[];
  email?: string;
  clientNumber?: string;
  personalIDNumber?: string;
  firmIDNumber?: string;
  address?: string;
}

export interface CDPayOptions {
  paymentMethod?: string;
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface GetClientProfilesResponse {
  profiles?: ClientProfile[];
}

export interface CreateCDAgreementRequest {
  clientProfile?: ClientProfile;
  agreementDetails?: string;
}

export interface CreateCDAgreementResponse {
  success?: boolean;
  agreementId?: string;
}
