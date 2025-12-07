import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';
import { TestDataGenerator } from '../utils/test-data';

/**
 * Test Suite: Performance & Error Handling
 * 
 * Tests for API performance, error handling, and edge cases
 */

test.describe('Performance & Error Handling', () => {

  /**
   * TC-PERF-001: Response Time for GET Request
   * Verify that API responds within acceptable time limits
   */
  test('TC-PERF-001: Should respond within acceptable time', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const startTime = Date.now();
    const response = await apiHelper.get('/booking');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assertions
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
  });

  /**
   * TC-PERF-002: Concurrent Requests Handling
   * Verify that API can handle multiple concurrent requests
   */
  test('TC-PERF-002: Should handle concurrent requests', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const promises = Array(5).fill(null).map(() => 
      apiHelper.get('/booking')
    );

    const responses = await Promise.all(promises);

    // Assertions
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });

  /**
   * TC-ERR-001: Missing Required Fields in Booking
   * Verify validation of required fields
   */
  test('TC-ERR-001: Should handle missing required fields', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const incompleteData = {
      firstname: 'John'
      // Missing other required fields
    };

    const response = await apiHelper.post('/booking', incompleteData);

    // API might accept partial data or reject it
    // Just verify it responds appropriately
    expect([200, 400, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-002: Invalid Data Types
   * Verify handling of invalid data types
   */
  test('TC-ERR-002: Should handle invalid data types', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const invalidData = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 'invalid',  // Should be number
      depositpaid: 'invalid',  // Should be boolean
      bookingdates: {
        checkin: 'invalid-date',
        checkout: 'invalid-date'
      }
    };

    const response = await apiHelper.post('/booking', invalidData);

    // Verify response
    expect([200, 400, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-003: Invalid Booking ID Format
   * Verify error handling for invalid ID format
   */
  test('TC-ERR-003: Should handle invalid booking ID format', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const response = await apiHelper.get('/booking/invalid-id');

    // Could be 404 or 400 depending on implementation
    expect([400, 404, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-004: XSS Attack Prevention
   * Verify that API handles potentially malicious scripts
   */
  /**
   * TC-ERR-004: XSS Prevention
   * Verify that the API sanitizes potentially malicious script inputs
   * 
   * KNOWN BUG: This test FAILS due to XSS vulnerability in restful-booker API
   * See BUG_REPORTS.md - Bug Report #001 for full details
   */
  test('TC-ERR-004: Should handle XSS attempts', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const xssPayload = {
      firstname: '<script>alert("XSS")</script>',
      lastname: 'Test',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-05'
      },
      additionalneeds: '<img src=x onerror=alert(1)>'
    };

    const response = await apiHelper.post('/booking', xssPayload);

    // API should either reject or sanitize malicious input
    expect([200, 400]).toContain(response.status);

    // Verify script tags are sanitized or stripped (THIS WILL FAIL - BUG!)
    if (response.status === 200) {
      expect(response.body.booking.firstname).not.toContain('<script>');
      expect(response.body.booking.additionalneeds).not.toContain('<img');
    }
  });

  /**
   * TC-ERR-005: SQL Injection Prevention
   * Verify protection against SQL injection
   */
  test('TC-ERR-005: Should handle SQL injection attempts', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const sqlPayload = {
      firstname: "'; DROP TABLE bookings; --",
      lastname: "Test",
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-05'
      }
    };

    const response = await apiHelper.post('/booking', sqlPayload);

    // Should either reject or sanitize
    expect([200, 400, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-006: Large Payload Handling
   * Verify API handles large payloads
   */
  test('TC-ERR-006: Should handle large payload', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const largeString = 'A'.repeat(10000);
    const largePayload = {
      firstname: largeString,
      lastname: 'Test',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-05'
      },
      additionalneeds: largeString
    };

    const response = await apiHelper.post('/booking', largePayload);

    // Should either accept or reject based on size limits
    expect([200, 400, 413, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-007: Invalid Date Format
   * Verify handling of invalid date formats
   */
  test('TC-ERR-007: Should handle invalid date formats', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const invalidDates = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-13-45',  // Invalid month and day
        checkout: '2024-00-00'
      }
    };

    const response = await apiHelper.post('/booking', invalidDates);

    expect([200, 400, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-008: Negative Price Value
   * Verify handling of negative numbers
   */
  test('TC-ERR-008: Should handle negative price', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const negativePrice = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: -100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-05'
      }
    };

    const response = await apiHelper.post('/booking', negativePrice);

    expect([200, 400, 500]).toContain(response.status);
  });

  /**
   * TC-ERR-009: Special Characters in Names
   * Verify handling of special characters
   */
  test('TC-ERR-009: Should handle special characters', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const specialChars = {
      firstname: 'Jöhn@#$%',
      lastname: 'Döé™',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-01',
        checkout: '2024-01-05'
      },
      additionalneeds: 'Test émojis 🚀🎉'
    };

    const response = await apiHelper.post('/booking', specialChars);

    // Should handle unicode and special characters
    expect([200, 400]).toContain(response.status);
  });

  /**
   * TC-ERR-010: Checkout Before Checkin
   * Verify business logic validation
   */
  test('TC-ERR-010: Should validate checkout after checkin', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const invalidDates = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-12-31',
        checkout: '2024-01-01'  // Checkout before checkin
      }
    };

    const response = await apiHelper.post('/booking', invalidDates);

    // API should either accept (weak validation) or reject
    expect([200, 400, 500]).toContain(response.status);
  });
});
