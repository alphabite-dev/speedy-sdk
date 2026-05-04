import { describe, it, expect, beforeAll } from 'vitest';
import { SpeedyClient } from '../../src/client';
import dotenv from 'dotenv';

dotenv.config();

describe('Location Services Integration Tests', () => {
	let client: SpeedyClient;

	beforeAll(() => {
		client = new SpeedyClient({
			username: process.env.SPEEDY_USERNAME!,
			password: process.env.SPEEDY_PASSWORD!,
			environment: 'production',
		});
	});

	describe('Find Sites (Cities)', () => {
		it('should find sites by partial name', async () => {
			const result = await client.address.findSites({
				countryId: 100,
				name: 'DOBR',
			});

			expect(result).toBeDefined();
			expect(result.cities).toBeDefined();
			expect(Array.isArray(result.cities)).toBe(true);
		});

		it('should find Sofia by exact name', async () => {
			const result = await client.address.findSites({
				countryId: 100,
				name: 'SOFIA',
			});

			expect(result).toBeDefined();
			expect(result.cities).toBeDefined();
			expect(result.cities!.length).toBeGreaterThan(0);
			// API returns Bulgarian name "СОФИЯ" not "SOFIA"
			const sofia = result.cities!.find(
				(c) => c.nameEn === 'SOFIA' || c.name === 'СОФИЯ',
			);
			expect(sofia).toBeDefined();
			expect(sofia?.id).toBe(68134);
		});

		it('should find site by postcode', async () => {
			const result = await client.address.findSites({
				countryId: 100,
				postCode: '1475',
			});

			expect(result).toBeDefined();
			expect(result.cities).toBeDefined();
		});
	});

	describe('Find Offices', () => {
		it('should find offices in Bulgaria', async () => {
			const result = await client.offices.find({
				countryId: 100,
			});

			expect(result).toBeDefined();
			expect(result.offices).toBeDefined();
			expect(Array.isArray(result.offices)).toBe(true);
			expect(result.offices.length).toBeGreaterThan(0);
		});

		it('should find offices in Sofia', async () => {
			const result = await client.offices.find({
				siteId: 68134,
			});

			expect(result).toBeDefined();
			expect(result.offices).toBeDefined();
			expect(result.offices.length).toBeGreaterThan(0);
		});

		it('should find office by name', async () => {
			const result = await client.offices.find({
				countryId: 100,
				name: 'SOM',
			});

			expect(result).toBeDefined();
			expect(result.offices).toBeDefined();
		});
	});

	describe('Find Streets', () => {
		it('should find streets by partial name', async () => {
			const result = await client.address.findStreets(68134, 'USTA');

			expect(result).toBeDefined();
			expect(result.streets).toBeDefined();
			expect(Array.isArray(result.streets)).toBe(true);
		});

		it('should find streets by full name', async () => {
			const result = await client.address.findStreets(68134, 'VASIL LEVSKI');

			expect(result).toBeDefined();
			expect(result.streets).toBeDefined();
			expect(result.streets.length).toBeGreaterThan(0);
		});
	});

	describe('Find Complexes', () => {
		it('should find complexes by partial name', async () => {
			const result = await client.address.findComplexes(68134, 'KRASN');

			expect(result).toBeDefined();
			expect(result.quarters).toBeDefined();
			expect(Array.isArray(result.quarters)).toBe(true);
		});
	});

	describe('Location CSV exports', () => {
		it('getCountriesCsv returns parsed countries with Bulgaria (id=100)', async () => {
			const rows = await client.location.getCountriesCsv();
			expect(Array.isArray(rows)).toBe(true);
			expect(rows.length).toBeGreaterThan(0);
			const bg = rows.find((r) => r.id === 100);
			expect(bg).toBeDefined();
			expect(typeof bg!.id).toBe('number');
			expect(bg!.isoAlpha2).toBe('BG');
		});

		it('getSitesCsv(100) returns parsed sites including Sofia (68134)', async () => {
			const rows = await client.location.getSitesCsv(100);
			expect(Array.isArray(rows)).toBe(true);
			expect(rows.length).toBeGreaterThan(0);
			const sofia = rows.find((r) => r.id === 68134);
			expect(sofia).toBeDefined();
			expect(typeof sofia!.id).toBe('number');
			expect(typeof sofia!.countryId).toBe('number');
			expect(sofia!.countryId).toBe(100);
		});

		it('getPostcodesCsv(100) returns rows with numeric siteId', async () => {
			const rows = await client.location.getPostcodesCsv(100);
			expect(Array.isArray(rows)).toBe(true);
			expect(rows.length).toBeGreaterThan(0);
			const sample = rows[0];
			console.log('Sample postcode row:', sample);
			expect(typeof sample.postCode).toBe('string');
			expect(typeof sample.siteId).toBe('number');
		});

		it('getStatesCsv(100) returns array (Bulgaria has no states)', async () => {
			const rows = await client.location.getStatesCsv(100);
			expect(Array.isArray(rows)).toBe(true);
		});
	});

	describe('Location.findOffices', () => {
		it('finds offices via /location/office in Sofia', async () => {
			const result = await client.location.findOffices({
				siteId: 68134,
				limit: 5,
			});
			expect(result).toBeDefined();
			expect(Array.isArray(result.offices)).toBe(true);
			expect(result.offices.length).toBeGreaterThan(0);
		});
	});
});
