import { AxiosError } from "axios";
import { EcontApiError } from "../types/error";

/**
 * Base error class for all Econt SDK errors
 */
export class EcontError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EcontError";
    Object.setPrototypeOf(this, EcontError.prototype);
  }
}

/**
 * Error thrown when API request fails
 */
export class EcontAPIError extends EcontError {
  public readonly statusCode?: number;
  public readonly response?: EcontApiError;
  public readonly requestId?: string;

  constructor(message: string, statusCode?: number, response?: EcontApiError, requestId?: string) {
    super(message);
    this.name = "EcontAPIError";
    this.statusCode = statusCode;
    this.response = response;
    this.requestId = requestId;
    Object.setPrototypeOf(this, EcontAPIError.prototype);
  }

  static fromAxiosError(error: AxiosError): EcontAPIError {
    const statusCode = error.response?.status;
    const responseData = error.response?.data as EcontApiError | undefined;
    const requestId = error.response?.headers?.["x-request-id"];

    let message = error.message;
    if (responseData?.message) {
      message = responseData.message;
    }

    return new EcontAPIError(message, statusCode, responseData, requestId);
  }
}

/**
 * Error thrown when validation fails
 */
export class EcontValidationError extends EcontError {
  public readonly field?: string;
  public readonly value?: string | number | boolean;

  constructor(message: string, field?: string, value?: string | number | boolean) {
    super(message);
    this.name = "EcontValidationError";
    this.field = field;
    this.value = value;
    Object.setPrototypeOf(this, EcontValidationError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class EcontAuthenticationError extends EcontError {
  constructor(message: string = "Authentication failed. Please check your API key.") {
    super(message);
    this.name = "EcontAuthenticationError";
    Object.setPrototypeOf(this, EcontAuthenticationError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class EcontRateLimitError extends EcontError {
  public readonly retryAfter?: number;

  constructor(message: string = "Rate limit exceeded", retryAfter?: number) {
    super(message);
    this.name = "EcontRateLimitError";
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, EcontRateLimitError.prototype);
  }
}

/**
 * Error thrown when network request fails
 */
export class EcontNetworkError extends EcontError {
  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "EcontNetworkError";
    Object.setPrototypeOf(this, EcontNetworkError.prototype);
  }
}
