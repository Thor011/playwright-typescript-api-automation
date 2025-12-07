import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';
import { TestDataGenerator } from '../utils/test-data';

/**
 * Test Suite: Authentication & Authorization
 * 
 * Tests related to authentication token management
 */

test.describe('Authentication & Authorization', () => {
  /**
   * TC-AUTH-001: Create Authentication Token
   * Verify that auth token can be created with valid credentials
   */
  test('TC-AUTH-001: Should create auth token with valid credentials', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const authData = TestDataGenerator.getAuthCredentials();

    const response = await apiHelper.post('/auth', authData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  /**
   * TC-AUTH-002: Create Token with Invalid Credentials
   * Verify that token creation fails with wrong credentials
   */
  test('TC-AUTH-002: Should reject invalid credentials', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const invalidAuth = {
      username: 'wronguser',
      password: 'wrongpass'
    };

    const response = await apiHelper.post('/auth', invalidAuth);

    // Assertions - bad credentials returns 200 but with reason
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reason');
  });

  /**
   * TC-AUTH-003: Use Token for Update Operation
   * Verify that valid token allows update operations
   */
  test('TC-AUTH-003: Should allow update with valid token', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Get auth token
    const authData = TestDataGenerator.getAuthCredentials();
    const authResponse = await apiHelper.post('/auth', authData);
    const token = authResponse.body.token;

    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Update with token
    const updatedData = TestDataGenerator.generateBooking();
    const response = await apiHelper.put(`/booking/${bookingId}`, updatedData, {
      headers: {
        Cookie: `token=${token}`
      }
    });

    // Assertions
    expect(response.status).toBe(200);
  });

  /**
   * TC-AUTH-004: Use Token for Delete Operation
   * Verify that valid token allows delete operations
   */
  test('TC-AUTH-004: Should allow delete with valid token', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Get auth token
    const authData = TestDataGenerator.getAuthCredentials();
    const authResponse = await apiHelper.post('/auth', authData);
    const token = authResponse.body.token;

    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Delete with token
    const response = await apiHelper.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });

    // Assertions
    expect(response.status).toBe(201);
  });

  /**
   * TC-AUTH-005: Update Without Token
   * Verify that update fails without authentication
   */
  test('TC-AUTH-005: Should reject update without token', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Try to update without token
    const updatedData = TestDataGenerator.generateBooking();
    const response = await apiHelper.put(`/booking/${bookingId}`, updatedData);

    // Assertions
    expect(response.status).toBe(403);
  });

  /**
   * TC-AUTH-006: Delete Without Token
   * Verify that delete fails without authentication
   */
  test('TC-AUTH-006: Should reject delete without token', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Try to delete without token
    const response = await apiHelper.delete(`/booking/${bookingId}`);

    // Assertions
    expect(response.status).toBe(403);
  });

  /**
   * TC-AUTH-007: Basic Auth for Update
   * Verify that Basic Auth header works as alternative to token
   */
  test('TC-AUTH-007: Should allow update with Basic Auth', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Update with Basic Auth
    const updatedData = TestDataGenerator.generateBooking();
    const basicAuth = Buffer.from('admin:password123').toString('base64');
    
    const response = await apiHelper.put(`/booking/${bookingId}`, updatedData, {
      headers: {
        Authorization: `Basic ${basicAuth}`
      }
    });

    // Assertions
    expect(response.status).toBe(200);
  });
});
