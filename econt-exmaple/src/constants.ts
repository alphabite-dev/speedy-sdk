/**
 * Econt API base URLs
 */
export const API_BASE_URLS = {
  production: "https://ee.econt.com/services",
  demo: "https://demo.econt.com/ee/services",
} as const;

/**
 * API endpoints
 */
export const ENDPOINTS = {
  // Nomenclatures
  offices: "/Nomenclatures/NomenclaturesService.getOffices.json",
  cities: "/Nomenclatures/NomenclaturesService.getCities.json",
  countries: "/Nomenclatures/NomenclaturesService.getCountries.json",
  streets: "/Nomenclatures/NomenclaturesService.getStreets.json",
  quarters: "/Nomenclatures/NomenclaturesService.getQuarters.json",

  // AddressService
  validateAddress: "/Nomenclatures/AddressService.validateAddress.json",
  addressServiceTimes: "/Nomenclatures/AddressService.addressServiceTimes.json",
  getNearestOffices: "/Nomenclatures/AddressService.getNearestOffices.json",

  // LabelService
  createLabel: "/Shipments/LabelService.createLabel.json",
  createLabels: "/Shipments/LabelService.createLabels.json",
  deleteLabels: "/Shipments/LabelService.deleteLabels.json",
  updateLabel: "/Shipments/LabelService.updateLabel.json",
  updateLabels: "/Shipments/LabelService.updateLabels.json",
  checkPossibleShipmentEditions: "/Shipments/LabelService.checkPossibleShipmentEditions.json",
  grouping: "/Shipments/LabelService.grouping.json",
  groupingCancelation: "/Shipments/LabelService.groupingCancelation.json",

  // ShipmentService
  requestCourier: "/Shipments/ShipmentService.requestCourier.json",
  getShipmentStatuses: "/Shipments/ShipmentService.getShipmentStatuses.json",
  getRequestCourierStatus: "/Shipments/ShipmentService.getRequestCourierStatus.json",
  getMyAWB: "/Shipments/ShipmentService.getMyAWB.json",
  setTUCode: "/Shipments/ShipmentService.setTUCode.json",
  calculateShipping: "/Shipments/ShipmentService.calculateShipping.json",

  // ProfileService
  getClientProfiles: "/Profile/ProfileService.getClientProfiles.json",
  createCDAgreement: "/Profile/ProfileService.createCDAgreement.json",

  // ThreeWayLogisticsService
  threeWayLogistics: "/ThreeWayLogistics/ThreeWayLogisticsService.threeWayLogistics.json",

  // PaymentReportService
  paymentReport: "/PaymentReport/PaymentReportService.PaymentReport.json",
} as const;

/**
 * Default request timeout in milliseconds
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * Maximum retry attempts for failed requests
 */
export const MAX_RETRIES = 3;

/**
 * SDK version
 */
export const SDK_VERSION = "1.0.0";
