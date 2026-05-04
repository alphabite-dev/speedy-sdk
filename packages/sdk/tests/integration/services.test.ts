import { describe, it, expect, beforeAll } from 'vitest';
import { SpeedyClient } from '../../src/client';
import dotenv from 'dotenv';

dotenv.config();

describe('Services Resource Integration Tests', () => {
	let client: SpeedyClient;

	beforeAll(() => {
		client = new SpeedyClient({
			username: process.env.SPEEDY_USERNAME!,
			password: process.env.SPEEDY_PASSWORD!,
			environment: 'production',
		});
	});

	it('should fetch available services for the profile', async () => {
		const response = await client.services.getServices({});
		expect(response).toHaveProperty('services');
		expect(Array.isArray(response.services)).toBe(true);
		// Optionally, check for at least one service
		// expect(response.services.length).toBeGreaterThan(0);
	});
});
