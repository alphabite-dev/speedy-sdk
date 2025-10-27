import { Address } from "./common";
import { ClientProfile, CDPayOptions } from "./profile";

/**
 * Shipment types
 */

export enum ShipmentType {
  DOCUMENT = "document",
  PACK = "pack",
  PALLET = "pallet",
  CARGO = "cargo",
  DOCUMENT_PALLET = "documentpallet",
  BIG_LETTER = "big_letter",
  SMALL_LETTER = "small_letter",
  MONEY_TRANSFER = "money_transfer",
  PP = "pp",
}

export enum InstructionType {
  TAKE = "take",
  GIVE = "give",
  RETURN = "return",
  SERVICES = "services",
}

export enum RequestCourierStatusType {
  UNPROCESS = "unprocess",
  PROCESS = "process",
  TAKEN = "taken",
  REJECT = "reject",
  REJECT_CLIENT = "reject_client",
}

export interface HostedFile {
  url: string;
  filename?: string;
  contentType?: string;
}

export interface ReturnInstructionParams {
  returnParcelDestination?: string;
  returnParcelIsDocument?: boolean;
  returnParcelIsEmptyPallet?: boolean;
  emptyPalletEuro: number;
  emptyPallet80: number;
  emptyPallet100: number;
  emptyPallet120: number;
  daysUntilReturn?: number;
  returnParcelPaymentSide?: string;
  returnParcelReceiverClient?: ClientProfile;
  returnParcelReceiverAgent?: ClientProfile;
  returnParcelReceiverOfficeCode?: string;
  returnParcelReceiverAddress?: Address;
  printReturnParcel?: boolean;
  rejectAction?: string;
  rejectInstruction?: string;
  rejectContact?: string;
  rejectReturnClient?: ClientProfile;
  rejectReturnAgent?: ClientProfile;
  rejectReturnOfficeCode?: string;
  rejectReturnAddress?: Address;
  rejectOriginalParcelPaySide?: string;
  rejectReturnParcelPaySide?: string;
  signatureDocuments: boolean;
  signaturePenColor: string;
  signatureCount: number;
  signaturePageNumbers: string;
  signatureOtherInstructions: string;
  executeIfRejectedWithoutReview?: boolean;
  useReturnAddressForInstruction?: boolean;
  executeIfNotTaken: number;
}

export interface Instruction {
  id?: number;
  type?: InstructionType;
  title?: string;
  description?: string;
  attachments?: HostedFile[];
  voiceDescription?: HostedFile;
  returnInstructionParams?: ReturnInstructionParams;
  name?: string;
  applyToAllParcels?: boolean;
  applyToReceivers?: string[];
}

export interface PackElement {
  width: number;
  height: number;
  length: number;
  weight: number;
}

export interface PackingListElement {
  inventoryNum?: string;
  description?: string;
  weight?: number;
  count?: number;
  price?: number;
  file?: HostedFile;
  alternativeDepartment?: string;
}

export interface CustomsListElement {
  cn: string;
  description: string;
  sum: number;
  currency: string;
}

export interface CargoVehicleOptions {
  senderAddressTruckAccess?: boolean;
  receiverAddressTruckAccess?: boolean;
  senderAddressLiftingVehicleRequired?: boolean;
  receiverAddressLiftingVehicleRequired?: boolean;
  senderAddressTailLiftTruckRequired?: boolean;
  receiverAddressTailLiftTruckRequired?: boolean;
}

export interface ShippingLabelServices {
  priorityTimeFrom?: string;
  priorityTimeTo?: string;
  deliveryReceipt?: boolean;
  digitalReceipt?: boolean;
  goodsReceipt?: boolean;
  twoWayShipment?: boolean;
  deliveryToFloor?: boolean;
  pack5?: number;
  pack6?: number;
  pack8?: number;
  pack9?: number;
  pack10?: number;
  pack12?: number;
  refrigeratedPack?: number;
  declaredValueAmount?: number;
  declaredValueCurrency?: string;
  moneyTransferAmount?: number;
  expressMoneyTransfer?: boolean;
  cdAmount?: number;
  cdType?: string;
  cdCurrency?: string;
  cdPayOptionsTemplate?: string;
  cdPayOptions?: CDPayOptions;
  invoiceBeforePayCD?: boolean;
  smsNotification?: boolean;
  invoiceNum?: string;
}

export interface ShippingLabel {
  shipmentNumber?: string;
  previousShipmentNumber?: string;
  previousShipmentReceiverPhone?: string;
  senderClient?: ClientProfile;
  senderAgent?: ClientProfile;
  senderAddress?: Address;
  senderOfficeCode?: string;
  emailOnDelivery?: string;
  smsOnDelivery?: string;
  receiverClient?: ClientProfile;
  receiverAgent?: ClientProfile;
  receiverAddress?: Address;
  receiverOfficeCode?: string;
  receiverProviderID?: number;
  receiverBIC?: string;
  receiverIBAN?: string;
  envelopeNumbers?: string[];
  packCount?: number;
  packs?: PackElement[];
  shipmentType?: ShipmentType;
  weight?: number;
  sizeUnder60cm?: boolean;
  shipmentDimensionsL?: number;
  shipmentDimensionsW?: number;
  shipmentDimensionsH?: number;
  shipmentDescription?: string;
  orderNumber?: string;
  sendDate?: string;
  holidayDeliveryDay?: string;
  keepUpright?: boolean;
  services?: ShippingLabelServices;
  instructions?: Instruction[];
  payAfterAccept?: boolean;
  payAfterTest?: boolean;
  packingListType?: string;
  packingList?: PackingListElement[];
  partialDelivery?: boolean;
  paymentSenderMethod?: string;
  paymentReceiverMethod?: string;
  paymentReceiverAmount?: number;
  paymentReceiverAmountIsPercent?: boolean;
  paymentOtherClientNumber?: string;
  paymentOtherAmount?: number;
  paymentOtherAmountIsPercent?: boolean;
  mediator?: string;
  paymentToken?: string;
  customsList?: CustomsListElement[];
  customsInvoice?: string;
  cargoVehicleOptions?: CargoVehicleOptions;
}

export interface ShipmentStatusService {
  type?: string;
  description?: string;
  count?: number;
  paymentSide?: string;
  price?: number;
  currency?: string;
}

export interface ShipmentTrackingEvent {
  isReceipt?: boolean;
  destinationType?: string;
  destinationDetails?: string;
  destinationDetailsEn?: string;
  officeName?: string;
  officeNameEn?: string;
  cityName?: string;
  cityNameEn?: string;
  countryCode?: string;
  officeCode: string;
  time?: string;
}

export interface NextShipmentElement {
  shipmentNumber?: string;
  reason?: string;
  pdfURL?: string;
}

export interface PreviousShipment {
  shipmentNumber: number;
  reason: string;
  pdfURL: string;
}

export interface ShipmentEditionResponseElement {
  shipmentNum: number;
  editionNum: number;
  editionType: string;
  editionError: string;
  price: string;
  currency: string;
}

export interface ShipmentStatus {
  shipmentNumber?: string;
  storageOfficeName?: string;
  storagePersonName?: string;
  createdTime?: string;
  sendTime?: string;
  deliveryTime?: string;
  shipmentType?: ShipmentType;
  packCount?: number;
  shipmentDescription?: string;
  weight?: number;
  senderDeliveryType?: string;
  senderClient?: ClientProfile;
  senderAgent?: ClientProfile;
  senderOfficeCode?: string;
  senderAddress?: Address;
  receiverDeliveryType?: string;
  receiverClient?: ClientProfile;
  receiverAgent?: ClientProfile;
  receiverOfficeCode?: string;
  receiverAddress?: Address;
  hubCode?: string;
  hubName?: string;
  hubNameEN?: string;
  cdCollectedAmount?: number;
  cdCollectedCurrency?: string;
  cdCollectedTime?: string;
  cdPaidAmount?: number;
  cdPaidCurrency?: string;
  cdPaidTime?: string;
  totalPrice?: number;
  currency?: string;
  discountPercent?: number;
  discountAmount?: number;
  discountDescription?: string;
  senderDueAmount?: number;
  receiverDueAmount?: number;
  otherDueAmount?: number;
  deliveryAttemptCount?: number;
  previousShipmentNumber?: string;
  services?: ShipmentStatusService[];
  lastProcessedInstruction?: string;
  nextShipments?: NextShipmentElement[];
  trackingEvents?: ShipmentTrackingEvent[];
  pdfURL?: string;
  expectedDeliveryDate?: string;
  returnShipmentURL?: string;
  rejectOriginalParcelPaySide: string;
  rejectReturnParcelPaySide: string;
  shipmentEdition: ShipmentEditionResponseElement;
  previousShipment: PreviousShipment;
  warnings?: string;
  shortDeliveryStatus: string;
  shortDeliveryStatusEn: string;
  routingCode?: string;
}

export interface PaymentAdditionPrice {
  side: string;
  shareAmount: number;
  method: string;
  otherClientNumber: string;
}

export interface PaymentInstruction {
  method: string;
}

export interface CreateLabelResultElement {
  label?: ShipmentStatus;
  error?: ApiError;
  payAfterAcceptIgnored: string;
}

export interface DeleteLabelsResultElement {
  shipmentNum?: string;
  error?: ApiError;
}

export interface ShipmentStatusResultElement {
  status?: ShipmentStatus;
  error?: ApiError;
}

export interface RequestCourierStatus {
  id?: number;
  status?: RequestCourierStatusType;
  note?: string;
  reject_reason?: string;
}

export interface RequestCourierStatusResultElement {
  status?: RequestCourierStatus;
  error?: ApiError;
}

export interface GetMyAWBResultElement {
  shipmentNumber: string;
  senderName: string;
  status: string;
  createdDate: string;
  acceptedDate: string;
  cdAmount: number;
  courierServiceAmount: number;
  courierServiceMasterPayer: string;
  receiverPhone: string;
  cdCurrency: string;
  courierServiceCurrency: string;
}

export interface CheckPossibleShipmentEditionsResultElement {
  possibleShipmentEditions?: string[];
  shipmentNum: number;
}

export interface UpdateLabelRequest {
  label: ShippingLabel;
  requestCourierTimeFrom: string;
  requestCourierTimeTo: string;
  destroy: boolean;
  paymentAdditionPrice: PaymentAdditionPrice;
  paymentInstruction: PaymentInstruction;
}

export interface UpdateLabelsResultElement {
  error?: ApiError;
  labels: UpdateLabelResponse;
}

export interface UpdateLabelResponse {
  label?: ShipmentStatus;
}

interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// Request/Response types for API methods

export interface CreateLabelRequest {
  label?: ShippingLabel;
  requestCourierTimeFrom?: string;
  requestCourierTimeTo?: string;
  mode?: "calculate" | "validate" | "create" | "calculate_with_block";
}

export interface CreateLabelResponse {
  label?: ShipmentStatus;
  blockingPaymentURL?: string;
  courierRequestID?: number;
  payAfterAcceptIgnored: string;
}

export interface CreateLabelsRequest {
  labels?: ShippingLabel[];
  runAsyncAndEmailResultTo?: string;
  mode?: "validate" | "calculate" | "create";
}

export interface CreateLabelsResponse {
  results?: CreateLabelResultElement[];
}

export interface DeleteLabelsRequest {
  shipmentNumbers?: string[];
}

export interface DeleteLabelsResponse {
  results?: DeleteLabelsResultElement[];
}

export interface UpdateLabelRequestData {
  label: ShippingLabel;
  requestCourierTimeFrom: string;
  requestCourierTimeTo: string;
  destroy: boolean;
  paymentAdditionPrice: PaymentAdditionPrice;
  paymentInstruction: PaymentInstruction;
}

export interface UpdateLabelResponseData {
  label: ShipmentStatus;
}

export interface UpdateLabelsRequest {
  labels: UpdateLabelRequest[];
}

export interface UpdateLabelsResponse {
  results?: UpdateLabelsResultElement[];
}

export interface CheckPossibleShipmentEditionsRequest {
  shipmentNums: number[];
}

export interface CheckPossibleShipmentEditionsResponse {
  possibleShipmentEditions?: CheckPossibleShipmentEditionsResultElement[];
}

export interface GroupingRequest {
  labels: number[];
}

export interface GroupingResponse {
  label: ShipmentStatus;
}

export interface GroupingCancelationRequest {
  groupLabel: number;
}

export interface GroupingCancelationResponse {
  status: string;
}

export interface RequestCourierRequest {
  requestTimeFrom?: string;
  requestTimeTo?: string;
  shipmentType?: ShipmentType;
  shipmentPackCount?: number;
  shipmentWeight?: number;
  senderClient?: ClientProfile;
  senderAgent?: ClientProfile;
  senderAddress?: Address;
  attachShipments?: string[];
  pack12?: number;
  cargoVehicleOptions?: CargoVehicleOptions;
}

export interface RequestCourierResponse {
  courierRequestID?: string;
  warnings?: string;
}

export interface GetShipmentStatusesRequest {
  shipmentNumbers?: string[];
}

export interface GetShipmentStatusesResponse {
  shipmentStatuses?: ShipmentStatusResultElement[];
}

export interface GetRequestCourierStatusRequest {
  requestCourierIds?: string[];
}

export interface GetRequestCourierStatusResponse {
  requestCourierStatus?: RequestCourierStatusResultElement[];
}

export interface GetMyAWBRequest {
  dateFrom: string;
  dateTo: string;
  page?: number;
  side: string;
}

export interface GetMyAWBResponse {
  dateFrom: string;
  dateTo: string;
  page: number;
  totalPages: number;
  results?: GetMyAWBResultElement[];
}

export interface SetITUCodeRequest {
  awbBarcode: string;
  truckRegNum: string;
  ITU_code: string;
}

export interface SetITUCodeResponse {
  // Empty response according to docs
}
