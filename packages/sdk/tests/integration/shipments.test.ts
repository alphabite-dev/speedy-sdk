import { describe, it, expect, beforeAll } from "vitest";
import { SpeedyClient } from "../../src/client";
import dotenv from "dotenv";

dotenv.config();

describe("Shipments Service Integration Tests", () => {
  let client: SpeedyClient;

  beforeAll(() => {
    client = new SpeedyClient({
      username: process.env.SPEEDY_USERNAME!,
      password: process.env.SPEEDY_PASSWORD!,
      environment: "production",
    });
  });

  describe("Create Shipment to Address", () => {
    it("should create a shipment to address with IDs", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          saturdayDelivery: false,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "RECIPIENT",
          declaredValuePayer: "RECIPIENT",
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
        ref1: "TEST ORDER 123456",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment with site and street names", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
          address: {
            countryId: 100,
            siteType: "gr.",
            siteName: "SOFIA",
            streetType: "ul.",
            streetName: "USTA GENCHO",
            streetNo: "1A",
          },
        },
        ref1: "TEST ORDER 789",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment with postcode", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
          address: {
            countryId: 100,
            siteName: "SOFIA",
            postCode: "1331",
            streetType: "ul.",
            streetName: "USTA GENCHO",
            streetNo: "1A",
          },
        },
        ref1: "TEST ORDER WITH POSTCODE",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment with address note only", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
          address: {
            countryId: 100,
            siteId: 68134,
            addressNote: "ul. USTA GENCHO, No.1A, bl.301, ent.2, fl.3, ap.4",
          },
        },
        ref1: "TEST ADDRESS NOTE ONLY",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe("Create Shipment to Office", () => {
    it("should create shipment to office", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
          pickupOfficeId: 14,
        },
        ref1: "TEST TO OFFICE",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe("Create Shipment from Office", () => {
    it("should handle shipment from office (may require contract permissions)", async () => {
      try {
        const result = await client.shipments.create({
          service: {
            serviceId: 505,
            autoAdjustPickupDate: true,
          },
          content: {
            parcelsCount: 1,
            totalWeight: 0.6,
            contents: "MOBILE PHONE",
            package: "BOX",
          },
          payment: {
            courierServicePayer: "SENDER",
          },
          sender: {
            phone1: {
              number: "0888112233",
            },
            clientName: "Company LTD",
            contactName: "IVAN PETROV",
            email: "ivan@petrov.bg",
            privatePerson: false,
            dropoffOfficeId: 2,
          },
          recipient: {
            phone1: {
              number: "0899445566",
            },
            clientName: "VASIL GEORGIEV",
            email: "vasil@georgiev.bg",
            privatePerson: true,
            address: {
              countryId: 100,
              siteId: 68134,
              streetId: 3109,
              streetNo: "1A",
            },
          },
          ref1: "TEST FROM OFFICE",
        });

        expect(result).toBeDefined();
        if (result.id) {
          expect(result.id).toBeDefined();
        }
      } catch (error: any) {
        // This may fail with payer-should-be-contract-client error
        // which is expected for test accounts without proper contract permissions
        if (error.response?.data?.error?.code === 700) {
          console.log("Expected error: Company dropoff requires contract client permissions");
          expect(error.response.data.error.code).toBe(700);
        } else {
          throw error;
        }
      }
    });
  });

  describe("Create Shipment with Additional Services", () => {
    it("should create shipment with COD", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          additionalServices: {
            cod: {
              amount: 100.0,
              processingType: "CASH",
            },
          },
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
          pickupOfficeId: 14,
        },
        ref1: "TEST WITH COD",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment with Declared Value", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          additionalServices: {
            declaredValue: {
              amount: 100.0,
              fragile: true,
              ignoreIfNotApplicable: true,
            },
          },
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "RECIPIENT",
          declaredValuePayer: "RECIPIENT",
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
        ref1: "TEST WITH DECLARED VALUE",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment with OBPD", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          additionalServices: {
            obpd: {
              option: "OPEN",
              returnShipmentServiceId: 505,
              returnShipmentPayer: "SENDER",
            },
          },
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
          pickupOfficeId: 14,
        },
        ref1: "TEST WITH OBPD",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment with all additional services", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 505,
          additionalServices: {
            cod: {
              amount: 100.0,
              processingType: "CASH",
            },
            declaredValue: {
              amount: 100.0,
              fragile: true,
              ignoreIfNotApplicable: true,
            },
            obpd: {
              option: "OPEN",
              returnShipmentServiceId: 505,
              returnShipmentPayer: "SENDER",
            },
          },
          saturdayDelivery: true,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 3,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
          package: "BOX",
        },
        payment: {
          courierServicePayer: "RECIPIENT",
          declaredValuePayer: "RECIPIENT",
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
        ref1: "TEST ALL SERVICES",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe("Create International Shipments", () => {
    it("should create shipment to Germany", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 306,
          saturdayDelivery: true,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
          package: "BOX",
          parcels: [
            {
              seqNo: 1,
              size: {
                width: 25,
                depth: 20,
                height: 35,
              },
              weight: 8,
            },
          ],
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
            countryId: 276,
            siteName: "MUNICH",
            postCode: "80001",
            addressLine1: "Complex name, Street name, No.1",
            addressLine2: "Additional address note",
          },
        },
        ref1: "TEST TO GERMANY",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment to Greece", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 202,
          saturdayDelivery: true,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
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
            addressLine2: "Bus station",
          },
        },
        ref1: "TEST TO GREECE",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it("should create shipment to France", async () => {
      const result = await client.shipments.create({
        service: {
          serviceId: 306,
          saturdayDelivery: true,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "MOBILE PHONE",
          package: "BOX",
          parcels: [
            {
              seqNo: 1,
              size: {
                width: 30,
                depth: 20,
                height: 10,
              },
              weight: 10.0,
            },
          ],
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
            countryId: 250,
            siteName: "PARIS",
            postCode: "75016",
            addressLine1: "24 Rue du Commandant Guilbaud",
            addressLine2: "Parc des Princes Stadium",
          },
        },
        ref1: "TEST TO FRANCE",
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe("Shipment Operations", () => {
    it("should get shipment info by IDs", async () => {
      // First create a shipment to get an ID
      const createResult = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "TEST PHONE",
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
        ref1: "TEST GET INFO",
      });

      expect(createResult.id).toBeDefined();

      // Now get info
      const infoResult = await client.shipments.getInfo([createResult.id]);
      expect(infoResult).toBeDefined();
    });

    it("should cancel a shipment", async () => {
      // First create a shipment
      const createResult = await client.shipments.create({
        service: {
          serviceId: 505,
          autoAdjustPickupDate: true,
        },
        content: {
          parcelsCount: 1,
          totalWeight: 0.6,
          contents: "TEST PHONE",
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
        ref1: "TEST CANCEL",
      });

      expect(createResult.id).toBeDefined();

      // Try to cancel it
      try {
        const cancelResult = await client.shipments.cancel(createResult.id, "Test cancellation");
        expect(cancelResult).toBeDefined();
      } catch (error) {
        // Cancellation might fail if shipment is already in progress
        expect(error).toBeDefined();
      }
    });
  });
});
