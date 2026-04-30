/**
 * Speedy SDK - TypeScript SDK for Speedy shipping API
 */

// Main client
export { SpeedyClient } from "./client";

// Types (re-exported from @alphabite/speedy-types)
export * from "@alphabite/speedy-types";

// Errors
export {
  SpeedyError,
  SpeedyAPIError,
  SpeedyValidationError,
  SpeedyAuthenticationError,
  SpeedyRateLimitError,
  SpeedyNetworkError,
} from "./utils/errors";

// Resources (for advanced usage)
export {
  Shipments,
  Tracking,
  Offices,
  AddressService,
  PrintService,
  CalculationService,
} from "./resources";

// Constants
export { API_BASE_URLS, SDK_VERSION } from "./constants";
