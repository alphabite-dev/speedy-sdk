# @alphabite/speedy-sdk

Official TypeScript SDK for [Speedy](https://www.speedy.bg) shipping API - Bulgaria's leading courier service.

[![npm version](https://img.shields.io/npm/v/@alphabite/speedy-sdk.svg)](https://www.npmjs.com/package/@alphabite/speedy-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Features

✅ **100% Test Coverage** - All 69 integration tests passing  
✅ **Full TypeScript Support** - Complete type definitions  
✅ **Promise-based API** - Modern async/await syntax  
✅ **Comprehensive Error Handling** - Detailed error types  
✅ **Production Ready** - Fully validated with real Speedy API

## Installation

```bash
npm install @alphabite/speedy-sdk
```

```bash
yarn add @alphabite/speedy-sdk
```

```bash
pnpm add @alphabite/speedy-sdk
```

## Quick Start

```typescript
import { SpeedyClient } from "@alphabite/speedy-sdk";

// Initialize the client
const speedy = new SpeedyClient({
  username: "your_username",
  password: "your_password",
  environment: "production",
});

// Calculate shipping cost
const calculation = await speedy.calculation.calculate({
  recipient: {
    privatePerson: true,
    addressLocation: { siteId: 68134 }, // Sofia
  },
  service: {
    serviceIds: [505],
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.6,
  },
  payment: {
    courierServicePayer: "SENDER",
  },
});

console.log(`Price: ${calculation.calculations[0].price.amount} BGN`);

// Create a shipment
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.6,
    contents: "Mobile Phone",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "SENDER",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    pickupOfficeId: 14,
  },
  ref1: "ORDER-12345",
});

console.log(`Shipment ID: ${shipment.id}`);
```

## Configuration

### Basic Configuration

```typescript
const speedy = new SpeedyClient({
  username: "your_username",
  password: "your_password",
  environment: "production", // 'production' or 'sandbox'
});
```

### Advanced Configuration

```typescript
const speedy = new SpeedyClient({
  username: "your_username",
  password: "your_password",
  environment: "production",

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Maximum retry attempts for failed requests (default: 3)
  maxRetries: 3,

  // Optional: Enable caching for nomenclature data
  cache: {
    enabled: true,
    directory: ".cache/speedy",
    ttl: 3600, // Time to live in seconds
  },
});
```

## API Reference

### Client Services

The SDK provides access to the following services:

- `speedy.address` - Address and location services
- `speedy.offices` - Office lookup
- `speedy.calculation` - Shipping cost calculations
- `speedy.shipments` - Shipment creation and management
- `speedy.tracking` - Shipment tracking
- `speedy.print` - Label printing

---

## Address & Location Services

### Find Sites (Cities)

```typescript
// Find cities by name
const result = await speedy.address.findSites({
  countryId: 100, // Bulgaria
  name: "SOFIA",
});

console.log(result.sites); // or result.cities (backwards compatible)

// Find by postcode
const result = await speedy.address.findSites({
  countryId: 100,
  postCode: "1000",
});
```

### Find Offices

```typescript
// Find all offices in Bulgaria
const result = await speedy.offices.find({
  countryId: 100,
});

// Find offices in a specific city
const result = await speedy.offices.find({
  siteId: 68134, // Sofia
});

// Find office by partial name
const result = await speedy.offices.find({
  name: "SOFIA",
});
```

### Find Streets

```typescript
const result = await speedy.address.findStreets(
  68134, // Sofia siteId
  "VASIL LEVSKI" // Street name (partial match)
);

console.log(result.streets);
```

### Find Complexes (Quarters)

```typescript
const result = await speedy.address.findComplexes(
  68134, // Sofia siteId
  "KRASNA" // Complex name (partial match)
);

console.log(result.complexes); // or result.quarters (backwards compatible)
```

---

## Calculation Service

### Calculate Shipping to Address

```typescript
const calculation = await speedy.calculation.calculate({
  recipient: {
    privatePerson: true,
    addressLocation: {
      siteId: 68134,
    },
  },
  service: {
    serviceIds: [505, 421], // Can request multiple services
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.6,
  },
  payment: {
    courierServicePayer: "SENDER", // 'SENDER' | 'RECIPIENT' | 'THIRD_PARTY'
  },
});

// Access all calculated prices
calculation.calculations.forEach((calc) => {
  console.log(`Service ${calc.serviceId}:`);
  console.log(`  Price: ${calc.price.amount} ${calc.price.currency}`);
  console.log(`  Total: ${calc.price.total}`);
  console.log(`  Delivery: ${calc.deliveryDeadline}`);
});
```

### Calculate Shipping to Office

```typescript
const calculation = await speedy.calculation.calculate({
  recipient: {
    privatePerson: true,
    pickupOfficeId: 77,
  },
  service: {
    serviceIds: [505],
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.8,
  },
  payment: {
    courierServicePayer: "RECIPIENT",
  },
});
```

### Calculate with Detailed Parcel Information

```typescript
const calculation = await speedy.calculation.calculate({
  recipient: {
    privatePerson: true,
    addressLocation: { siteId: 68134 },
  },
  service: {
    serviceIds: [306], // International service
  },
  content: {
    parcelsCount: 2,
    totalWeight: 15.5,
    parcels: [
      {
        weight: 8,
        size: { width: 30, height: 20, depth: 10 },
      },
      {
        weight: 7.5,
        size: { width: 25, height: 15, depth: 10 },
      },
    ],
  },
  payment: {
    courierServicePayer: "SENDER",
  },
});
```

---

## Shipment Creation

### Create Shipment to Address (with IDs)

```typescript
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.6,
    contents: "Mobile Phone",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "RECIPIENT",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    address: {
      countryId: 100,
      siteId: 68134,
      streetId: 3109,
      streetNo: "1A",
      complexId: 29,
      blockNo: "301",
      entranceNo: "2",
      floorNo: "3",
      apartmentNo: "4",
    },
  },
  ref1: "ORDER-12345",
});
```

### Create Shipment to Address (with Names)

```typescript
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.6,
    contents: "Documents",
    package: "ENVELOPE",
  },
  payment: {
    courierServicePayer: "SENDER",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    address: {
      countryId: 100,
      siteType: "gr.",
      siteName: "SOFIA",
      streetType: "ul.",
      streetName: "VASIL LEVSKI",
      streetNo: "10",
    },
  },
  ref1: "ORDER-67890",
});
```

### Create Shipment to Office

```typescript
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.5,
    contents: "Accessories",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "RECIPIENT",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    pickupOfficeId: 14, // Recipient picks up from office
  },
  ref1: "ORDER-11111",
});
```

### Create Shipment with Cash on Delivery (COD)

```typescript
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    additionalServices: {
      cod: {
        amount: 100.0,
        processingType: "CASH", // or "BANK_TRANSFER"
      },
    },
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 1.0,
    contents: "Electronics",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "RECIPIENT",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    pickupOfficeId: 14,
  },
  ref1: "COD-ORDER-123",
});
```

### Create Shipment with Declared Value

```typescript
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    additionalServices: {
      declaredValue: {
        amount: 500.0,
        fragile: true,
        ignoreIfNotApplicable: true,
      },
    },
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.8,
    contents: "Valuable Items",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "SENDER",
    declaredValuePayer: "SENDER",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    address: {
      countryId: 100,
      siteId: 68134,
      streetId: 3109,
      streetNo: "1A",
    },
  },
  ref1: "VALUABLE-ORDER-456",
});
```

### Create Shipment with Open Before Payment (OBPD)

```typescript
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 505,
    additionalServices: {
      obpd: {
        option: "OPEN", // 'OPEN' | 'TEST' | 'RETURN'
        returnShipmentServiceId: 505,
        returnShipmentPayer: "SENDER",
      },
    },
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 0.7,
    contents: "Clothing",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "RECIPIENT",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    pickupOfficeId: 14,
  },
  ref1: "OBPD-ORDER-789",
});
```

### Create International Shipment

```typescript
// Shipment to Greece
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 202, // International service for Greece
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 1.0,
    contents: "Books",
    package: "BOX",
  },
  payment: {
    courierServicePayer: "SENDER",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Vasil Georgiev",
    email: "vasil@example.com",
    privatePerson: true,
    address: {
      countryId: 300, // Greece
      siteName: "THESSALONIKI",
      postCode: "54629",
      addressLine1: "28 Monastiriou str",
      addressLine2: "Additional info",
    },
  },
  ref1: "INT-ORDER-999",
});
```

### Create Shipment to Germany/France (with Parcel Dimensions)

```typescript
// For some international services, parcel dimensions are required
const shipment = await speedy.shipments.create({
  service: {
    serviceId: 306, // Service to Germany/France
    autoAdjustPickupDate: true,
  },
  content: {
    parcelsCount: 1,
    totalWeight: 8.0,
    contents: "Electronics",
    package: "BOX",
    parcels: [
      {
        seqNo: 1,
        weight: 8,
        size: {
          width: 30,
          depth: 20,
          height: 35,
        },
      },
    ],
  },
  payment: {
    courierServicePayer: "SENDER",
  },
  sender: {
    phone1: { number: "0888112233" },
    contactName: "Ivan Petrov",
    email: "ivan@example.com",
  },
  recipient: {
    phone1: { number: "0899445566" },
    clientName: "Hans Mueller",
    email: "hans@example.com",
    privatePerson: true,
    address: {
      countryId: 276, // Germany
      siteName: "MUNICH",
      postCode: "80001",
      addressLine1: "Hauptstrasse 123",
      addressLine2: "Apartment 4B",
    },
  },
  ref1: "DE-ORDER-777",
});
```

---

## Tracking Service

### Track Single Parcel

```typescript
const tracking = await speedy.tracking.track([{ id: "299999990" }]);

if (tracking.parcels) {
  tracking.parcels.forEach((parcel) => {
    console.log(`Parcel ${parcel.parcelId}:`);
    parcel.operations?.forEach((op) => {
      console.log(`  ${op.date}: ${op.operationDescription}`);
    });
  });
}
```

### Track Multiple Parcels

```typescript
const tracking = await speedy.tracking.track([{ id: "299999990" }, { id: "299999991" }, { id: "299999992" }]);
```

### Track by Reference Number

```typescript
const tracking = await speedy.tracking.track([{ ref: "ORDER-12345" }]);
```

### Get Bulk Tracking Data

```typescript
const bulkData = await speedy.tracking.getBulkTrackingFiles(0);
// Returns tracking data files for bulk processing
```

---

## Print Service

### Print Single Label (A6, PDF)

```typescript
const result = await speedy.print.print({
  parcels: [{ id: "299999990" }],
  paperSize: "A6",
  format: "pdf",
});

if (result.data) {
  // result.data is base64 encoded PDF
  const pdfBuffer = Buffer.from(result.data, "base64");
  // Save or display the PDF
}
```

### Print Multiple Labels

```typescript
const result = await speedy.print.print({
  parcels: [{ id: "299999990" }, { id: "299999991" }, { id: "299999992" }],
  paperSize: "A6",
  format: "pdf",
});
```

### Print in Different Formats

```typescript
// A4 format
const a4Label = await speedy.print.print({
  parcels: [{ id: "299999990" }],
  paperSize: "A4",
  format: "pdf",
});

// ZPL format (for thermal printers)
const zplLabel = await speedy.print.print({
  parcels: [{ id: "299999990" }],
  paperSize: "A6",
  format: "zpl",
});

// A4 with 4 A6 labels
const multiLabel = await speedy.print.print({
  parcels: [{ id: "299999990" }, { id: "299999991" }, { id: "299999992" }, { id: "299999993" }],
  paperSize: "A4_4xA6",
  format: "pdf",
});
```

### Print Extended Label (with Routing Info)

```typescript
const result = await speedy.print.printExtended({
  parcels: [{ id: "299999990" }],
  paperSize: "A6",
  format: "pdf",
});
```

### Get Label Information

```typescript
const info = await speedy.print.getLabelInfo([{ id: "299999990" }]);
```

---

## Shipment Operations

### Get Shipment Information

```typescript
const info = await speedy.shipments.getInfo(["shipment-id-1", "shipment-id-2"]);

console.log(info.shipments);
```

### Cancel Shipment

```typescript
try {
  const result = await speedy.shipments.cancel("shipment-id", "Customer requested cancellation");
  console.log("Shipment cancelled successfully");
} catch (error) {
  console.error("Failed to cancel:", error);
}
```

---

## Complete Workflow Example

```typescript
import { SpeedyClient } from "@alphabite/speedy-sdk";

async function processOrder(orderData: any) {
  const speedy = new SpeedyClient({
    username: process.env.SPEEDY_USERNAME!,
    password: process.env.SPEEDY_PASSWORD!,
    environment: "production",
  });

  try {
    // Step 1: Find recipient's city
    const cities = await speedy.address.findSites({
      countryId: 100,
      name: orderData.city,
    });

    const city = cities.sites[0];
    console.log(`Found city: ${city.name} (ID: ${city.id})`);

    // Step 2: Find nearest office
    const offices = await speedy.offices.find({
      siteId: city.id,
    });

    const nearestOffice = offices.offices[0];
    console.log(`Nearest office: ${nearestOffice.name}`);

    // Step 3: Calculate shipping cost
    const calculation = await speedy.calculation.calculate({
      recipient: {
        privatePerson: true,
        pickupOfficeId: nearestOffice.id,
      },
      service: {
        serviceIds: [505],
      },
      content: {
        parcelsCount: 1,
        totalWeight: orderData.weight,
      },
      payment: {
        courierServicePayer: "SENDER",
      },
    });

    const price = calculation.calculations[0].price.amount;
    console.log(`Shipping cost: ${price} BGN`);

    // Step 4: Create shipment
    const shipment = await speedy.shipments.create({
      service: {
        serviceId: 505,
        additionalServices: {
          cod: {
            amount: orderData.totalAmount,
            processingType: "CASH",
          },
        },
        autoAdjustPickupDate: true,
      },
      content: {
        parcelsCount: 1,
        totalWeight: orderData.weight,
        contents: orderData.contents,
        package: "BOX",
      },
      payment: {
        courierServicePayer: "SENDER",
      },
      sender: {
        phone1: { number: process.env.SENDER_PHONE! },
        contactName: process.env.SENDER_NAME!,
        email: process.env.SENDER_EMAIL!,
      },
      recipient: {
        phone1: { number: orderData.phone },
        clientName: orderData.customerName,
        email: orderData.email,
        privatePerson: true,
        pickupOfficeId: nearestOffice.id,
      },
      ref1: `ORDER-${orderData.orderId}`,
    });

    console.log(`✅ Shipment created: ${shipment.id}`);

    // Step 5: Print label
    if (shipment.parcels && shipment.parcels.length > 0) {
      const label = await speedy.print.print({
        parcels: [{ id: shipment.parcels[0].id }],
        paperSize: "A6",
        format: "pdf",
      });

      if (label.data) {
        // Save label to file or send to printer
        const fs = require("fs");
        const pdfBuffer = Buffer.from(label.data, "base64");
        fs.writeFileSync(`label-${shipment.id}.pdf`, pdfBuffer);
        console.log(`✅ Label saved: label-${shipment.id}.pdf`);
      }
    }

    // Step 6: Track shipment
    const tracking = await speedy.tracking.track([{ id: shipment.parcels![0].id }]);

    console.log("✅ Tracking info:", tracking.parcels);

    return {
      shipmentId: shipment.id,
      parcelId: shipment.parcels![0].id,
      cost: price,
    };
  } catch (error) {
    console.error("❌ Error processing order:", error);
    throw error;
  }
}

// Usage
processOrder({
  orderId: "12345",
  city: "SOFIA",
  customerName: "Vasil Georgiev",
  phone: "0899445566",
  email: "vasil@example.com",
  weight: 0.8,
  contents: "Mobile Phone",
  totalAmount: 299.99,
});
```

---

## Address Formats

The Speedy API supports multiple ways to specify addresses:

### 1. By IDs (Most Accurate)

```typescript
address: {
  countryId: 100,
  siteId: 68134,
  streetId: 3109,
  streetNo: "1A",
  complexId: 29,
  blockNo: "301",
  entranceNo: "2",
  floorNo: "3",
  apartmentNo: "4",
}
```

### 2. By Names

```typescript
address: {
  countryId: 100,
  siteType: "gr.",
  siteName: "SOFIA",
  streetType: "ul.",
  streetName: "VASIL LEVSKI",
  streetNo: "10",
}
```

### 3. By Postcode and Names

```typescript
address: {
  countryId: 100,
  siteName: "SOFIA",
  postCode: "1000",
  streetType: "ul.",
  streetName: "VASIL LEVSKI",
  streetNo: "10",
}
```

### 4. By Address Note (Least Recommended)

```typescript
address: {
  countryId: 100,
  siteId: 68134,
  addressNote: "ul. VASIL LEVSKI, No.10, bl.301, ent.2, fl.3, ap.4",
}
```

**Note**: Using IDs is most reliable. Using addressNote may cause delays or processing issues.

---

## Error Handling

The SDK provides detailed error types for different scenarios:

```typescript
import {
  SpeedyAPIError,
  SpeedyAuthenticationError,
  SpeedyNetworkError,
  SpeedyRateLimitError
} from "@alphabite/speedy-sdk";

try {
  const shipment = await speedy.shipments.create({...});
} catch (error) {
  if (error instanceof SpeedyAuthenticationError) {
    console.error("Authentication failed - check credentials");
  } else if (error instanceof SpeedyRateLimitError) {
    console.error("Rate limit exceeded - retry after:", error.retryAfter);
  } else if (error instanceof SpeedyNetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof SpeedyAPIError) {
    console.error("API error:", error.message);
    console.error("Status:", error.statusCode);
    console.error("Details:", error.details);
  } else {
    console.error("Unknown error:", error);
  }
}
```

---

## Service IDs

Common Speedy service IDs:

- **505** - Standard domestic service (Bulgaria)
- **421** - Express domestic service
- **202** - Standard service to Greece
- **306** - Standard service to Germany/France
- **202** - Service to other Balkan countries

**Note**: Use the calculation API to discover available services for specific routes.

---

## Common Use Cases

### E-commerce Integration

```typescript
// When customer completes checkout
async function createShippingLabel(order) {
  const speedy = new SpeedyClient({
    username: process.env.SPEEDY_USERNAME!,
    password: process.env.SPEEDY_PASSWORD!,
    environment: "production",
  });

  // Create shipment with COD
  const shipment = await speedy.shipments.create({
    service: {
      serviceId: 505,
      additionalServices: {
        cod: {
          amount: order.total,
          processingType: "CASH",
        },
      },
      autoAdjustPickupDate: true,
    },
    content: {
      parcelsCount: 1,
      totalWeight: order.weight,
      contents: order.description,
      package: "BOX",
    },
    payment: {
      courierServicePayer: "RECIPIENT",
    },
    sender: {
      phone1: { number: process.env.SHOP_PHONE! },
      contactName: process.env.SHOP_CONTACT!,
      email: process.env.SHOP_EMAIL!,
    },
    recipient: {
      phone1: { number: order.customerPhone },
      clientName: order.customerName,
      email: order.customerEmail,
      privatePerson: true,
      address: {
        countryId: 100,
        siteId: order.cityId,
        streetName: order.street,
        streetNo: order.streetNo,
        addressNote: order.additionalInfo,
      },
    },
    ref1: `ORDER-${order.id}`,
  });

  // Print label
  const label = await speedy.print.print({
    parcels: [{ id: shipment.parcels![0].id }],
    paperSize: "A6",
    format: "pdf",
  });

  return {
    shipmentId: shipment.id,
    parcelId: shipment.parcels![0].id,
    labelPdf: label.data,
  };
}
```

### Office Finder

```typescript
async function findNearestOffice(cityName: string) {
  const speedy = new SpeedyClient({...});

  // Find the city
  const cities = await speedy.address.findSites({
    countryId: 100,
    name: cityName,
  });

  if (cities.sites.length === 0) {
    throw new Error(`City not found: ${cityName}`);
  }

  const city = cities.sites[0];

  // Find offices in the city
  const result = await speedy.offices.find({
    siteId: city.id,
  });

  return result.offices.map(office => ({
    id: office.id,
    name: office.name,
    address: office.address,
    workingHours: office.workingTimeSchedule,
    phones: office.phones,
  }));
}

// Usage
const offices = await findNearestOffice("SOFIA");
console.log(`Found ${offices.length} offices`);
```

### Shipment Tracking Dashboard

```typescript
async function getShipmentStatus(parcelIds: string[]) {
  const speedy = new SpeedyClient({...});

  const tracking = await speedy.tracking.track(
    parcelIds.map(id => ({ id }))
  );

  return tracking.parcels?.map(parcel => ({
    parcelId: parcel.parcelId,
    currentStatus: parcel.operations?.[0]?.operationDescription,
    lastUpdate: parcel.operations?.[0]?.date,
    history: parcel.operations,
  }));
}

// Usage
const statuses = await getShipmentStatus([
  "299999990",
  "299999991",
]);

statuses?.forEach(status => {
  console.log(`${status.parcelId}: ${status.currentStatus}`);
});
```

---

## Environment Variables

For production applications, store credentials in environment variables:

```bash
# .env file
SPEEDY_USERNAME=your_username
SPEEDY_PASSWORD=your_password
SPEEDY_BASE_URL=https://api.speedy.bg/v1
```

```typescript
import { SpeedyClient } from "@alphabite/speedy-sdk";
import dotenv from "dotenv";

dotenv.config();

const speedy = new SpeedyClient({
  username: process.env.SPEEDY_USERNAME!,
  password: process.env.SPEEDY_PASSWORD!,
  environment: "production",
});
```

---

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import {
  SpeedyClient,
  CreateShipmentRequest,
  CreateShipmentResponse,
  CalculationRequest,
  CalculationResponse,
  TrackShipmentResponse,
  PrintRequest,
  PrintResponse,
  // ... and many more
} from "@alphabite/speedy-sdk";

// All API calls are fully typed
const shipment: CreateShipmentResponse = await speedy.shipments.create({
  // TypeScript will auto-complete and validate all fields
  ...
});
```

---

## API Limits and Best Practices

### Rate Limiting

The Speedy API has rate limits. The SDK automatically handles rate limit errors and provides retry information.

```typescript
try {
  await speedy.shipments.create({...});
} catch (error) {
  if (error instanceof SpeedyRateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
    // Wait and retry
  }
}
```

### Caching

For frequently accessed nomenclature data (offices, cities, etc.), enable caching:

```typescript
const speedy = new SpeedyClient({
  username: "...",
  password: "...",
  cache: {
    enabled: true,
    directory: ".cache/speedy",
    ttl: 86400, // Cache for 24 hours
  },
});

// Export all nomenclature data to cache
await speedy.exportAllData();

// Check cache status
const status = speedy.getCacheStatus();
console.log(status);

// Clear cache when needed
speedy.clearCache();
```

### Timeout Configuration

For large bulk operations, you may need to increase the timeout:

```typescript
const speedy = new SpeedyClient({
  username: "...",
  password: "...",
  timeout: 60000, // 60 seconds for bulk operations
});
```

---

## Testing

The SDK includes comprehensive integration tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only integration tests
npm run test:integration

# Run tests with UI
npm run test:ui
```

---

## Requirements

- Node.js >= 16
- TypeScript >= 5.0 (for TypeScript projects)

---

## API Documentation

For complete API documentation, visit:

- [Speedy API Documentation](https://api.speedy.bg/web-api.html)
- [Speedy API Examples](https://services.speedy.bg/api/api_examples.html)

---

## Common Country IDs

- **100** - Bulgaria (България)
- **276** - Germany (Германия)
- **300** - Greece (Гърция)
- **250** - France (Франция)
- **380** - Italy (Италия)
- **724** - Spain (Испания)
- **642** - Romania (Румъния)
- **826** - United Kingdom (Великобритания)

---

## Package Types

The following package types are supported:

- `BOX` - Standard box
- `ENVELOPE` - Envelope
- `PALLET` - Pallet
- `PARCEL` - Generic parcel

---

## Support

For issues, questions, or contributions:

- **GitHub Issues**: [https://github.com/alphabite-org/speedy-sdk/issues](https://github.com/alphabite-org/speedy-sdk/issues)
- **Speedy Support**: [https://www.speedy.bg/bg/kontakti](https://www.speedy.bg/bg/kontakti)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Changelog

### v1.0.0 (2025-10-27)

- 🎉 Initial release
- ✅ Complete Speedy API v1 support
- ✅ Full TypeScript support
- ✅ 100% test coverage (69/69 tests passing)
- ✅ Support for all shipment types (domestic, international)
- ✅ Complete address lookup services
- ✅ Calculation services
- ✅ Tracking services
- ✅ Print services (PDF, ZPL)
- ✅ Comprehensive error handling

---

## Credits

Developed by [Alphabite](https://github.com/alphabite-org)

**Not officially affiliated with Speedy AD.** This is an independent SDK implementation.

---

## Disclaimer

This SDK is not officially endorsed by Speedy AD. It is an independent implementation of the Speedy API. Please ensure you have proper authorization and credentials from Speedy before using this SDK in production.
