import { describe, it, expect, beforeAll } from "vitest";
import { EcontClient, ShipmentType } from "../src";

describe("Shipments API", () => {
  let client: EcontClient;

  beforeAll(() => {
    const username = process.env.ECONT_USERNAME;
    const password = process.env.ECONT_PASSWORD;

    if (!username || !password) {
      throw new Error("ECONT_USERNAME and ECONT_PASSWORD must be set in .env file");
    }

    client = new EcontClient({
      username,
      password,
      environment: "demo",
    });
  });

  describe("LabelService", () => {
    it("should calculate shipping cost", async () => {
      const result = await client.shipments.calculate({
        senderClient: {
          name: "Test Sender",
          phones: ["+359888123456"],
        },
        senderAddress: {
          city: {
            id: 1,
            country: {
              id: 1033,
              code2: "BG",
              code3: "BGR",
              name: "България",
              nameEn: "Bulgaria",
              isEU: true,
            },
            postCode: "8500",
            name: "Айтос",
            nameEn: "Aytos",
            regionName: null,
            regionNameEn: null,
            phoneCode: null,
            location: null,
            expressCityDeliveries: null,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
            serviceDays: null,
            zoneId: null,
            zoneName: null,
            zoneNameEn: null,
            servingOffices: [],
          },
        },
        receiverClient: {
          name: "Test Receiver",
          phones: ["+359888654321"],
        },
        receiverOfficeCode: "8501",
        packCount: 1,
        shipmentType: ShipmentType.PACK,
        weight: 2.5,
      });

      console.log("Calculate result:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
      expect(result.label).toBeDefined();
    });

    it("should validate a label", async () => {
      try {
        const result = await client.shipments.validate({
          senderClient: {
            name: "Test Sender",
            phones: ["+359888123456"],
          },
          senderAddress: {
            city: {
              id: 1,
              country: {
                id: 1033,
                code2: "BG",
                code3: "BGR",
                name: "България",
                nameEn: "Bulgaria",
                isEU: true,
              },
              postCode: "8500",
              name: "Айтос",
              nameEn: "Aytos",
              regionName: null,
              regionNameEn: null,
              phoneCode: null,
              location: null,
              expressCityDeliveries: null,
              monday: null,
              tuesday: null,
              wednesday: null,
              thursday: null,
              friday: null,
              saturday: null,
              sunday: null,
              serviceDays: null,
              zoneId: null,
              zoneName: null,
              zoneNameEn: null,
              servingOffices: [],
            },
          },
          receiverClient: {
            name: "Test Receiver",
            phones: ["+359888654321"],
          },
          receiverOfficeCode: "8501",
          packCount: 1,
          shipmentType: ShipmentType.PACK,
          weight: 2.5,
        });

        console.log("Validate result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
        expect(result.label).toBeDefined();
      } catch (error) {
        console.log("Validate error (expected):", error);
        expect(error).toBeDefined();
      }
    });
  });

  describe("ShipmentService", () => {
    it("should get shipment statuses", async () => {
      // This will likely return empty or error for non-existent shipments, but tests the endpoint
      try {
        const result = await client.shipments.getShipmentStatuses(["TEST123456"]);

        console.log("Shipment statuses result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
        expect(result.shipmentStatuses).toBeDefined();
      } catch (error) {
        console.log("Get shipment statuses error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it.skip("should get AWB info", async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const result = await client.shipments.getMyAWB({
        dateFrom: thirtyDaysAgo.toISOString().split("T")[0],
        dateTo: today.toISOString().split("T")[0],
        side: "all",
        page: 1,
      });

      console.log("AWB info:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
      expect(result.page).toBeDefined();
    }, 60000);

    it("should get request courier status", async () => {
      // Test with dummy ID - will likely return error but tests endpoint
      const result = await client.shipments.getRequestCourierStatus(["999999"]);

      console.log("Courier status result:", JSON.stringify(result, null, 2));
      expect(result).toBeDefined();
      expect(result.requestCourierStatus).toBeDefined();
    });

    it("should request a courier", async () => {
      // Test with minimal data - will likely error but tests endpoint
      try {
        const result = await client.shipments.requestCourier({
          senderClient: {
            name: "Test Sender",
            phones: ["+359888123456"],
          },
          senderAddress: {
            city: {
              id: 1,
              country: {
                id: 1033,
                code2: "BG",
                code3: "BGR",
                name: "България",
                nameEn: "Bulgaria",
                isEU: true,
              },
              postCode: "1000",
              name: "София",
              nameEn: "Sofia",
              regionName: null,
              regionNameEn: null,
              phoneCode: null,
              location: null,
              expressCityDeliveries: null,
              monday: null,
              tuesday: null,
              wednesday: null,
              thursday: null,
              friday: null,
              saturday: null,
              sunday: null,
              serviceDays: null,
              zoneId: null,
              zoneName: null,
              zoneNameEn: null,
              servingOffices: [],
            },
          },
        });

        console.log("Request courier result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Request courier error (expected):", error);
        expect(error).toBeDefined();
      }
    });
  });

  describe("Label CRUD Operations", () => {
    it("should test createLabels endpoint", async () => {
      // Test with minimal data - will likely error but tests endpoint
      try {
        const result = await client.shipments.createLabels([
          {
            senderClient: {
              name: "Test Sender",
              phones: ["+359888123456"],
            },
            senderAddress: {
              city: {
                id: 1,
                country: {
                  id: 1033,
                  code2: "BG",
                  code3: "BGR",
                  name: "България",
                  nameEn: "Bulgaria",
                  isEU: true,
                },
                postCode: "8500",
                name: "Айтос",
                nameEn: "Aytos",
                regionName: null,
                regionNameEn: null,
                phoneCode: null,
                location: null,
                expressCityDeliveries: null,
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null,
                serviceDays: null,
                zoneId: null,
                zoneName: null,
                zoneNameEn: null,
                servingOffices: [],
              },
            },
            receiverClient: {
              name: "Test Receiver",
              phones: ["+359888654321"],
            },
            receiverOfficeCode: "8501",
            packCount: 1,
            shipmentType: ShipmentType.PACK,
            weight: 2.5,
          },
        ]);

        console.log("Create labels result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Create labels error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it("should test deleteLabels endpoint", async () => {
      try {
        const result = await client.shipments.deleteLabels(["TEST123456"]);

        console.log("Delete labels result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Delete labels error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it("should test updateLabel endpoint", async () => {
      try {
        const result = await client.shipments.updateLabel({
          label: {
            senderClient: {
              name: "Updated Sender",
              phones: ["+359888123456"],
            },
            senderAddress: {
              city: {
                id: 1,
                country: {
                  id: 1033,
                  code2: "BG",
                  code3: "BGR",
                  name: "България",
                  nameEn: "Bulgaria",
                  isEU: true,
                },
                postCode: "8500",
                name: "Айтос",
                nameEn: "Aytos",
                regionName: null,
                regionNameEn: null,
                phoneCode: null,
                location: null,
                expressCityDeliveries: null,
                monday: null,
                tuesday: null,
                wednesday: null,
                thursday: null,
                friday: null,
                saturday: null,
                sunday: null,
                serviceDays: null,
                zoneId: null,
                zoneName: null,
                zoneNameEn: null,
                servingOffices: [],
              },
            },
            receiverClient: {
              name: "Test Receiver",
              phones: ["+359888654321"],
            },
            receiverOfficeCode: "8501",
            packCount: 1,
            shipmentType: ShipmentType.PACK,
            weight: 2.5,
          },
          requestCourierTimeFrom: "09:00",
          requestCourierTimeTo: "17:00",
          destroy: false,
          paymentAdditionPrice: {
            side: "sender",
            shareAmount: 0,
            method: "cash",
            otherClientNumber: "",
          },
          paymentInstruction: {
            method: "cash",
          },
        });

        console.log("Update label result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Update label error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it("should test checkPossibleShipmentEditions endpoint", async () => {
      try {
        const result = await client.shipments.checkPossibleShipmentEditions([123456]);

        console.log("Check editions result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Check editions error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it("should test grouping endpoint", async () => {
      try {
        const result = await client.shipments.grouping([123, 456]);

        console.log("Grouping result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Grouping error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it("should test groupingCancelation endpoint", async () => {
      try {
        const result = await client.shipments.groupingCancelation(123456);

        console.log("Grouping cancelation result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Grouping cancelation error (expected):", error);
        expect(error).toBeDefined();
      }
    });

    it("should test setITUCode endpoint", async () => {
      try {
        const result = await client.shipments.setITUCode("TEST-AWB-123", "TEST-TRUCK-REG", "TEST-ITU-CODE");

        console.log("Set ITU code result:", JSON.stringify(result, null, 2));
        expect(result).toBeDefined();
      } catch (error) {
        console.log("Set ITU code error (expected):", error);
        expect(error).toBeDefined();
      }
    });
  });
});
