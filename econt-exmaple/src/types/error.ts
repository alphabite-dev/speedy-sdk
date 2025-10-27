/**
 * API Error types from Econt documentation
 */

export interface EcontApiError {
  type?: string;
  message?: string;
  fields?: string[];
  innerErrors?: EcontApiError[];
}
