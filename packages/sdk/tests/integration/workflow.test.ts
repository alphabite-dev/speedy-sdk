import { describe, it, expect, beforeAll } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Complete Workflow Integration Tests", () => {
  let client: SpeedyClient;

  beforeAll(() => {
    client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });
  });

  describe("Complete Shipping Workflow", () => {
    it("should complete a full workflow: Calculate → Create → Track", async () => {
      // Step 1: Calculate shipping cost
      const calculation = await client.calculation.calculate({
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 68134,
          },
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

      expect(calculation).toBeDefined();
      expect(calculation.calculations).toBeDefined();
      expect(calculation.calculations.length).toBeGreaterThan(0);

      const selectedService = calculation.calculations[0];
      expect(selectedService.serviceId).toBe(505);
      expect(selectedService.price.amount).toBeGreaterThan(0);

      console.log(`Calculated price: ${selectedService.price.amount} ${selectedService.price.currency}`);

      // Step 2: Create shipment
      const shipment = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "WORKFLOW TEST ITEM",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "SENDER",
        },
        sender: {
          phone1: {
            number: "0888112233",
          },
          contactName: "IVAN PETROV",
          email: "ivan@petrov.bg",
        },
        recipient: {
          phone1: {
            number: "0899445566",
          },
          clientName: "VASIL GEORGIEV",
          email: "vasil@georgiev.bg",
          privatePerson: true,
          pickupOfficeId: 14,
        },
        ref1: "WORKFLOW TEST ORDER",
      });

      expect(shipment).toBeDefined();
      expect(shipment.id).toBeDefined();

      console.log(`Created shipment with ID: ${shipment.id}`);

      // Step 3: Get shipment info
      const shipmentInfo = await client.shipments.getInfo([shipment.id]);
      expect(shipmentInfo).toBeDefined();

      // Step 4: Track the shipment (if parcel IDs are available)
      if (shipment.parcels && shipment.parcels.length > 0) {
        const parcelId = shipment.parcels[0].id;
        const tracking = await client.tracking.track([{ id: parcelId }]);

        expect(tracking).toBeDefined();
        expect(tracking.parcels).toBeDefined();

        console.log(`Tracked parcel: ${parcelId}`);
      }
    });

    it("should complete workflow with COD and printing", async () => {
      // Calculate with COD
      const calculation = await client.calculation.calculate({
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

      expect(calculation).toBeDefined();
      expect(calculation.calculations.length).toBeGreaterThan(0);

      // Create shipment with COD
      const shipment = await client.shipments.create({
        service: {
          serviceId: 505,
          additionalServices: {
            cod: {
              amount: 50.0,
              processingType: "CASH",
            },
          },
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.8,
          contents: "COD TEST ITEM",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "RECIPIENT",
        },
        sender: {
          phone1: {
            number: "0888112233",
          },
          contactName: "IVAN PETROV",
          email: "ivan@petrov.bg",
        },
        recipient: {
          phone1: {
            number: "0899445566",
          },
          clientName: "VASIL GEORGIEV",
          email: "vasil@georgiev.bg",
          privatePerson: true,
          pickupOfficeId: 77,
        },
        ref1: "COD WORKFLOW TEST",
      });

      expect(shipment).toBeDefined();
      expect(shipment.id).toBeDefined();

      console.log(`Created COD shipment: ${shipment.id}`);

      // Print label if parcel IDs available
      if (shipment.parcels && shipment.parcels.length > 0) {
        const parcelId = shipment.parcels[0].id;

        const printResult = await client.print.print({
          parcels: [{ id: parcelId }],
          paperSize: "A6",
          format: "pdf",
        });

        expect(printResult).toBeDefined();

        if (printResult.data) {
          console.log(`Label printed successfully for parcel: ${parcelId}`);
        }
      }
    });
  });

  describe("Location Services Workflow", () => {
    it("should find complete address information", async () => {
      // Find city
      const cities = await client.address.findSites({
        countryId: 100,
        name: "SOFIA",
      });

      expect(cities).toBeDefined();
      expect(cities.cities).toBeDefined();
      expect(cities.cities!.length).toBeGreaterThan(0);

      const sofia = cities.cities!.find((c) => c.name === "СОФИЯ");
      expect(sofia).toBeDefined();

      console.log(`Found Sofia with ID: ${sofia?.id}`);

      // Find streets in Sofia
      const streets = await client.address.findStreets(68134, "VASIL");

      expect(streets).toBeDefined();
      expect(streets.streets).toBeDefined();

      console.log(`Found ${streets.streets?.length || 0} streets matching "VASIL"`);

      // Find complexes
      const complexes = await client.address.findComplexes(68134, "KRASN");

      expect(complexes).toBeDefined();
      expect(complexes.quarters).toBeDefined();

      console.log(`Found ${complexes.quarters?.length || 0} complexes matching "KRASN"`);

      // Find offices in Sofia
      const offices = await client.offices.find({
        siteId: 68134,
      });

      expect(offices).toBeDefined();
      expect(offices.offices).toBeDefined();
      expect(offices.offices.length).toBeGreaterThan(0);

      console.log(`Found ${offices.offices.length} offices in Sofia`);
    });
  });

  describe("International Shipping Workflow", () => {
    it("should handle international shipment to Greece", async () => {
      // Calculate international shipping
      const calculation = await client.calculation.calculate({
        recipient: {
          privatePerson: true,
          addressLocation: {
            siteId: 68134, // Using Sofia as destination for calculation test
          },
        },
        service: {
          serviceIds: [202, 505],
        },
        content: {
          parcelsCount: 1,
          totalWeight: 1.0,
        },
        payment: {
          courierServicePayer: "SENDER",
        },
      });

      expect(calculation).toBeDefined();
      expect(calculation.calculations).toBeDefined();

      // Create international shipment
      const shipment = await client.shipments.create({
        service: {
          serviceId: 202,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 1.0,
          contents: "INTERNATIONAL TEST",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "SENDER",
        },
        sender: {
          phone1: {
            number: "0888112233",
          },
          contactName: "IVAN PETROV",
          email: "ivan@petrov.bg",
        },
        recipient: {
          phone1: {
            number: "0899445566",
          },
          clientName: "VASIL GEORGIEV",
          email: "vasil@georgiev.bg",
          privatePerson: true,
          address: {
            countryId: 300,
            siteName: "THESSALONIKI",
            postCode: "54629",
            addressLine1: "28 Monastiriou str",
            addressLine2: "Test Address",
          },
        },
        ref1: "INTERNATIONAL WORKFLOW",
      });

      expect(shipment).toBeDefined();
      expect(shipment.id).toBeDefined();

      console.log(`Created international shipment: ${shipment.id}`);
    });
  });

  describe("Bulk Operations", () => {
    it("should handle multiple shipments and track them", async () => {
      const shipmentIds: string[] = [];

      // Create multiple shipments
      for (let i = 0; i < 3; i++) {
        const shipment = await client.shipments.create({
          service: {
            serviceId: 505,
            autoAdjustPickupDate: true,
          },
          content: {
            parcelsCount: 1,
            totalWeight: 0.5,
            contents: `BULK TEST ITEM ${i + 1}`,
            package: "BOX",
          },
          payment: {
            courierServicePayer: "SENDER",
          },
          sender: {
            phone1: {
              number: "0888112233",
            },
            contactName: "IVAN PETROV",
            email: "ivan@petrov.bg",
          },
          recipient: {
            phone1: {
              number: "0899445566",
            },
            clientName: "VASIL GEORGIEV",
            email: "vasil@georgiev.bg",
            privatePerson: true,
            pickupOfficeId: 14,
          },
          ref1: `BULK TEST ${i + 1}`,
        });

        expect(shipment.id).toBeDefined();
        shipmentIds.push(shipment.id);
      }

      console.log(`Created ${shipmentIds.length} shipments for bulk operations`);

      // Get info for all shipments
      const shipmentsInfo = await client.shipments.getInfo(shipmentIds);
      expect(shipmentsInfo).toBeDefined();

      console.log("Retrieved info for all bulk shipments");
    });
  });
});
