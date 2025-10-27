import { AxiosError } from "axios";
import { SpeedyApiError } from "../types/error";

/**
 * Base error class for all Speedy SDK errors
 */
export class SpeedyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpeedyError";
    Object.setPrototypeOf(this, SpeedyError.prototype);
  }
}

/**
 * Error thrown when API request fails
 */
export class SpeedyAPIError extends SpeedyError {
  public readonly statusCode?: number;
  public readonly response?: SpeedyApiError;
  public readonly requestId?: string;

  constructor(message: string, statusCode?: number, response?: SpeedyApiError, requestId?: string) {
    super(message);
    this.name = "SpeedyAPIError";
    this.statusCode = statusCode;
    this.response = response;
    this.requestId = requestId;
    Object.setPrototypeOf(this, SpeedyAPIError.prototype);
  }

  static fromAxiosError(error: AxiosError): SpeedyAPIError {
    const statusCode = error.response?.status;
    const responseData = error.response?.data as SpeedyApiError | undefined;
    const requestId = error.response?.headers?.["x-request-id"];

    let message = error.message;
    if (responseData?.message) {
      message = responseData.message;
    }

    return new SpeedyAPIError(message, statusCode, responseData, requestId);
  }
}

/**
 * Error thrown when validation fails
 */
export class SpeedyValidationError extends SpeedyError {
  public readonly field?: string;
  public readonly value?: string | number | boolean;

  constructor(message: string, field?: string, value?: string | number | boolean) {
    super(message);
    this.name = "SpeedyValidationError";
    this.field = field;
    this.value = value;
    Object.setPrototypeOf(this, SpeedyValidationError.prototype);
  }
}

/**
 * Error thrown when authentication fails
 */
export class SpeedyAuthenticationError extends SpeedyError {
  constructor(message: string = "Authentication failed. Please check your credentials.") {
    super(message);
    this.name = "SpeedyAuthenticationError";
    Object.setPrototypeOf(this, SpeedyAuthenticationError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class SpeedyRateLimitError extends SpeedyError {
  public readonly retryAfter?: number;

  constructor(message: string = "Rate limit exceeded", retryAfter?: number) {
    super(message);
    this.name = "SpeedyRateLimitError";
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, SpeedyRateLimitError.prototype);
  }
}

/**
 * Error thrown when network request fails
 */
export class SpeedyNetworkError extends SpeedyError {
  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "SpeedyNetworkError";
    Object.setPrototypeOf(this, SpeedyNetworkError.prototype);
  }
}
