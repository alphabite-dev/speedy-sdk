/**
 * Error types for Speedy API
 */

export interface SpeedyApiError {
  code: string;
  message: string;
  details?: string;
}
