/**
 * Speedy API base URLs
 */
export const API_BASE_URLS = {
  production: "https://api.speedy.bg/v1",
  sandbox: "https://api.speedy.bg/v1", // Speedy doesn't have a separate sandbox
} as const;

/**
 * Default timeout for HTTP requests (in milliseconds)
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * SDK version
 */
export const SDK_VERSION = "1.0.0";

/**
 * API endpoints
 */
export const ENDPOINTS = {
  // Shipment endpoints
  createShipment: "/shipment",
  cancelShipment: "/shipment/cancel",
  deleteShipment: "/shipment",
  addParcel: "/shipment/add_parcel",
  finalizeShipment: "/shipment/finalize",
  shipmentInfo: "/shipment/info",
  secondaryShipments: "/shipment/:id/secondary",
  updateShipment: "/shipment/update",
  updateShipmentProperties: "/shipment/update/properties",
  findParcelsByRef: "/shipment/search",
  handoverToCourier: "/shipment/handover",
  handoverToMidwayCarrier: "/shipment/handover-to-midway-carrier",
  barcodeInformation: "/shipment/barcode-information",

  // Print endpoints
  print: "/print",
  printExtended: "/print/extended",
  labelInfo: "/print/labelInfo",
  printVoucher: "/print/voucher",

  // Tracking endpoints
  track: "/track",
  bulkTrackingDataFiles: "/track/bulk",

  // Pickup endpoints
  pickup: "/pickup",
  pickupTerms: "/pickup/terms",

  // Location endpoints - Country
  getCountry: "/location/country/:id",
  findCountry: "/location/country",
  getAllCountries: "/location/country/csv",

  // Location endpoints - State
  getState: "/location/state/:id",
  findState: "/location/state",
  getAllStates: "/location/state/csv/:countryId",

  // Location endpoints - Site
  getSite: "/location/site/:id",
  findSite: "/location/site",
  getAllSites: "/location/site/csv/:countryId",

  // Location endpoints - Street
  getStreet: "/location/street/:id",
  findStreet: "/location/street",
  getAllStreets: "/location/street/csv/:countryId",

  // Location endpoints - Complex
  getComplex: "/location/complex/:id",
  findComplex: "/location/complex",
  getAllComplexes: "/location/complex/csv/:countryId",

  // Location endpoints - Block
  findBlock: "/location/block",
  getAllBlocks: "/location/block/csv/:countryId",

  // Location endpoints - POI
  getPOI: "/location/poi/:id",
  findPOI: "/location/poi",
  getAllPOI: "/location/poi/csv/:countryId",

  // Location endpoints - Postcode
  getAllPostcodes: "/location/postcode/csv/:countryId",

  // Location endpoints - Office
  getOffice: "/location/office/:id",
  findOffice: "/location/office",
  findNearestOffices: "/location/office/nearest-offices",

  // Calculation endpoints
  calculate: "/calculate",

  // Client endpoints
  getClient: "/client/:id",
  getContractClients: "/client/contract",
  createContact: "/client/contact",
  getContactByExternalId: "/client/contact/external/:id",
  getOwnClientId: "/client",
  contractInfo: "/client/contract/info",

  // Validation endpoints
  validateAddress: "/validation/address",
  validatePostcode: "/validation/postcode",
  validatePhone: "/validation/phone",
  validateShipment: "/validation/shipment",

  // Services endpoints
  getServices: "/services",
  getDestinationServices: "/services/destination",

  // Payment endpoints
  getPayout: "/payments",
} as const;
