# Speedy SDK Testing Plan

## Test Credentials

- Username: `1996270`
- Password: `6956989988`
- Base URL: `https://api.speedy.bg/v1`
- Note: No separate sandbox environment

## Testing Checklist

### Phase 1: Setup & Configuration ⚙️

- [ ] Create `.env.example` file with credential placeholders
- [ ] Create `.env` file with actual test credentials (gitignored)
- [ ] Update `.gitignore` to exclude `.env`
- [ ] Set up test environment configuration

### Phase 2: Basic Connectivity Tests 🔌

- [ ] Test authentication with valid credentials
- [ ] Test authentication with invalid credentials
- [ ] Test HTTP client initialization
- [ ] Test error handling for network issues

### Phase 3: Location/Nomenclature Tests 📍

Based on Postman examples:

#### Countries

- [ ] Find country by name ("ROMANIA")
- [ ] Find country by partial name ("GER")
- [ ] Find country by ISO code ("GR")

#### Sites (Cities)

- [ ] Find site by partial name ("DOBR")
- [ ] Find site by exact name ("SOFIA")
- [ ] Find site by postcode ("1475")
- [ ] Find site by name + postcode ("DOBRICH" + "9300")

#### Offices

- [ ] Find offices in Bulgaria (countryId: 100)
- [ ] Find offices in Sofia (siteId: 68134)
- [ ] Find office by name ("SOM")
- [ ] Get specific office by ID

#### Streets

- [ ] Find streets by partial name ("USTA")
- [ ] Find streets by full name ("VASIL LEVSKI")
- [ ] Find streets with type filter

#### Complexes

- [ ] Find complexes by partial name ("KRASN")

### Phase 4: Calculation Tests 💰

- [ ] Calculate shipping to address (siteId: 10135, serviceId: 505)
- [ ] Calculate shipping to office (officeId: 77, serviceId: 505)
- [ ] Calculate with COD
- [ ] Calculate with Declared Value
- [ ] Calculate with multiple service IDs

### Phase 5: Shipment Creation Tests 📦

Based on Postman examples:

#### Basic Shipments

- [ ] Create shipment to address (IDs: streetId, complexId)
- [ ] Create shipment to office (pickupOfficeId: 14)
- [ ] Create shipment with sender from office (dropoffOfficeId: 2)

#### With Additional Services

- [ ] Create shipment with COD (amount: 100 BGN)
- [ ] Create shipment with Declared Value (amount: 100, fragile: true)
- [ ] Create shipment with OBPD (Open Before Payment)

#### Different Address Formats

- [ ] Address via IDs (siteId, streetId, complexId)
- [ ] Address via names (siteName + streetName)
- [ ] Address via postcode + names
- [ ] Address via POI ID
- [ ] Address via addressNote only

#### International Shipments

- [ ] Germany (countryId: 276, serviceId: 306)
- [ ] Greece (countryId: 300, serviceId: 202)
- [ ] France (countryId: 250, serviceId: 306)

### Phase 6: Tracking Tests 🔍

- [ ] Track single parcel by ID ("299999990")
- [ ] Track multiple parcels
- [ ] Track with lastOperationOnly flag
- [ ] Track by reference number
- [ ] Get bulk tracking data files

### Phase 7: Print Tests 🖨️

- [ ] Print single label (A6, PDF)
- [ ] Print multiple labels (A6, PDF)
- [ ] Print labels in ZPL format
- [ ] Print A4 with 4xA6 labels
- [ ] Get label information
- [ ] Print extended with routing info

### Phase 8: Shipment Operations Tests ⚡

- [ ] Get shipment info by IDs
- [ ] Cancel shipment
- [ ] Update shipment properties
- [ ] Find parcels by reference

### Phase 9: Integration Tests 🔄

- [ ] Complete workflow: Calculate → Create → Print → Track
- [ ] Bulk operations test
- [ ] Error recovery test
- [ ] Cache functionality test
- [ ] Export all data test

### Phase 10: Type Safety & Edge Cases 🛡️

- [ ] Verify all responses match TypeScript types
- [ ] Test optional parameters
- [ ] Test required field validation
- [ ] Test invalid data handling
- [ ] Test timeout handling
- [ ] Test retry logic

## Test Data Reference (from Postman)

### Valid Test IDs

- **SiteId Sofia**: 68134
- **SiteId Dobrich**: (varies)
- **OfficeId**: 14, 77
- **StreetId**: 3109
- **ComplexId**: 29
- **ServiceId Domestic**: 505
- **ServiceId Greece**: 202
- **ServiceId Germany/France**: 306
