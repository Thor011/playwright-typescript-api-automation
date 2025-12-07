import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';
import { TestDataGenerator } from '../utils/test-data';

/**
 * Test Suite: Booking CRUD Operations for restful-booker API
 * 
 * This suite covers basic Create, Read, Update, and Delete operations for booking management
 */

test.describe('Booking API - CRUD Operations', () => {
  let createdBookingId: number;
  let bookingData: any;
  let authToken: string;

  /**
   * TC-001: Health Check
   * Verify that the API is up and running
   */
  test('TC-001: Should verify API health check', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const response = await apiHelper.get('/ping');

    // Assertions
    expect(response.status).toBe(201);
  });

  /**
   * TC-002: Create Booking - Valid Data
   * Verify that a new booking can be created successfully with valid data
   */
  test('TC-002: Should create a new booking successfully', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    bookingData = TestDataGenerator.generateBooking();

    const response = await apiHelper.post('/booking', bookingData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bookingid');
    expect(response.body.booking.firstname).toBe(bookingData.firstname);
    expect(response.body.booking.lastname).toBe(bookingData.lastname);
    expect(response.body.booking.totalprice).toBe(bookingData.totalprice);

    // Store booking ID for subsequent tests
    createdBookingId = response.body.bookingid;
  });

  /**
   * TC-003: Get Booking by ID - Valid ID
   * Verify that booking details can be retrieved using a valid booking ID
   */
  test('TC-003: Should retrieve booking by ID', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // First create a booking
    const newBooking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', newBooking);
    const bookingId = createResponse.body.bookingid;

    // Then retrieve it
    const response = await apiHelper.get(`/booking/${bookingId}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe(newBooking.firstname);
    expect(response.body.lastname).toBe(newBooking.lastname);
    expect(response.body.totalprice).toBe(newBooking.totalprice);
  });

  /**
   * TC-004: Get All Bookings
   * Verify that the API returns a list of all bookings
   */
  test('TC-004: Should retrieve all booking IDs', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const response = await apiHelper.get('/booking');

    // Assertions
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('bookingid');
  });

  /**
   * TC-005: Filter Bookings by Name
   * Verify that bookings can be filtered by firstname and lastname
   */
  test('TC-005: Should filter bookings by name', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create a booking with specific name
    const booking = TestDataGenerator.generateBooking();
    booking.firstname = 'TestFirstName';
    booking.lastname = 'TestLastName';
    await apiHelper.post('/booking', booking);

    // Filter by name
    const response = await apiHelper.get('/booking?firstname=TestFirstName&lastname=TestLastName');

    // Assertions
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  /**
   * TC-006: Update Booking - Valid Data
   * Verify that booking information can be updated successfully
   */
  test('TC-006: Should update booking successfully', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create auth token
    const authData = TestDataGenerator.getAuthCredentials();
    const authResponse = await apiHelper.post('/auth', authData);
    authToken = authResponse.body.token;

    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Update the booking
    const updatedData = TestDataGenerator.generateBooking();
    updatedData.firstname = 'UpdatedFirst';
    updatedData.lastname = 'UpdatedLast';

    const response = await apiHelper.put(`/booking/${bookingId}`, updatedData, {
      headers: {
        Cookie: `token=${authToken}`
      }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe(updatedData.firstname);
    expect(response.body.lastname).toBe(updatedData.lastname);
  });

  /**
   * TC-007: Partial Update Booking - PATCH
   * Verify that booking can be partially updated using PATCH
   */
  test('TC-007: Should partially update booking using PATCH', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Get auth token
    const authData = TestDataGenerator.getAuthCredentials();
    const authResponse = await apiHelper.post('/auth', authData);
    const token = authResponse.body.token;

    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Partial update
    const partialUpdate = {
      firstname: 'PatchedName',
      lastname: 'PatchedLastName'
    };

    const response = await apiHelper.patch(`/booking/${bookingId}`, partialUpdate, {
      headers: {
        Cookie: `token=${token}`
      }
    });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe(partialUpdate.firstname);
    expect(response.body.lastname).toBe(partialUpdate.lastname);
  });

  /**
   * TC-008: Delete Booking
   * Verify that a booking can be deleted successfully
   */
  test('TC-008: Should delete booking successfully', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Get auth token
    const authData = TestDataGenerator.getAuthCredentials();
    const authResponse = await apiHelper.post('/auth', authData);
    const token = authResponse.body.token;

    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Delete the booking
    const response = await apiHelper.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });

    // Assertions
    expect(response.status).toBe(201);

    // Verify booking is deleted
    const getResponse = await apiHelper.get(`/booking/${bookingId}`);
    expect(getResponse.status).toBe(404);
  });

  /**
   * TC-009: Get Non-Existent Booking
   * Verify proper error handling for non-existent booking ID
   */
  test('TC-009: Should return 404 for non-existent booking', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const nonExistentId = 999999999;
    const response = await apiHelper.get(`/booking/${nonExistentId}`);

    // Assertions
    expect(response.status).toBe(404);
  });

  /**
   * TC-010: Update Without Authentication
   * Verify that update fails without auth token
   */
  test('TC-010: Should reject update without authentication', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Try to update without auth
    const updatedData = TestDataGenerator.generateBooking();
    const response = await apiHelper.put(`/booking/${bookingId}`, updatedData);

    // Assertions - should fail without auth
    expect(response.status).toBe(403);
  });
});
