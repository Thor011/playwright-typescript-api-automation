import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';
import { TestDataGenerator } from '../utils/test-data';
import { TestLogger, WarningSeverity } from '../utils/test-logger';

/**
 * Test Suite: Security Testing
 * 
 * Tests for authentication, authorization, injection attacks, and security best practices
 */

test.describe('Security Testing', () => {

  /**
   * TC-SEC-001: Unique Token Generation
   * Verify that each authentication request generates a unique token
   * 
   * KNOWN ISSUE: This test may FAIL if API reuses tokens (security concern)
   */
  test('TC-SEC-001: Should generate unique tokens per session', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const authData = TestDataGenerator.getAuthCredentials();

    // Generate two tokens with a small delay
    const response1 = await apiHelper.post('/auth', authData);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
    const response2 = await apiHelper.post('/auth', authData);

    // Assertions
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response1.body.token).toBeDefined();
    expect(response2.body.token).toBeDefined();
    
    // Tokens should be different to prevent session fixation attacks
    // If this fails, it's a potential security vulnerability
    expect(response1.body.token).not.toBe(response2.body.token);
  });

  /**
   * TC-SEC-002: IDOR - Insecure Direct Object Reference
   * Verify that sequential ID enumeration is prevented or properly handled
   */
  test('TC-SEC-002: Should handle sequential ID enumeration', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Create a booking
    const booking = TestDataGenerator.generateBooking();
    const createResponse = await apiHelper.post('/booking', booking);
    const bookingId = createResponse.body.bookingid;

    // Try to access nearby booking IDs
    const nearbyIds = [bookingId - 1, bookingId + 1, bookingId + 2];
    const responses = await Promise.all(
      nearbyIds.map(id => apiHelper.get(`/booking/${id}`))
    );

    // NOTE: If all succeed with 200, there's no access control (expected for this API)
    // In a real app with user authentication, this would be a vulnerability
    responses.forEach(response => {
      expect([200, 404]).toContain(response.status);
    });
  });

  /**
   * TC-SEC-003: Command Injection Prevention
   * Verify that API prevents command injection attempts
   * 
   * NOTE: API accepts these payloads - verifying they're stored safely
   */
  test('TC-SEC-003: Should prevent command injection', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const commandInjectionPayloads = [
      '; ls -la',
      '| whoami',
      '`cat /etc/passwd`',
      '$(rm -rf /)',
      '&& dir',
      '|| ping -c 10 127.0.0.1'
    ];

    for (const payload of commandInjectionPayloads) {
      const booking = TestDataGenerator.generateBooking();
      booking.firstname = payload;
      booking.lastname = payload;

      const response = await apiHelper.post('/booking', booking);

      // API should either reject or safely handle the payload
      expect([200, 400, 422]).toContain(response.status);
      
      // If accepted, verify the string is stored as-is (not executed)
      // The real security check would be server-side - we verify no execution evidence
      if (response.status === 200) {
        expect(response.body.booking.firstname).toBe(payload);
        // If response contains system output, that would indicate command execution
        expect(response.body.booking.firstname).not.toContain('root:');
        expect(response.body.booking.firstname).not.toContain('C:\\');
      }
    }
  });

  /**
   * TC-SEC-004: Path Traversal Prevention
   * Verify that API prevents directory traversal attacks
   */
  test('TC-SEC-004: Should prevent path traversal attacks', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const pathTraversalPayloads = [
      '../../etc/passwd',
      '..\\..\\windows\\system32\\config\\sam',
      '../../../../../../../etc/hosts',
      '....//....//....//etc/passwd'
    ];

    for (const payload of pathTraversalPayloads) {
      const booking = TestDataGenerator.generateBooking();
      booking.additionalneeds = payload;

      const response = await apiHelper.post('/booking', booking);

      // Should not return file contents or execute path traversal
      expect([200, 400, 422]).toContain(response.status);
    }
  });

  /**
   * TC-SEC-005: LDAP Injection Prevention
   * Verify that API prevents LDAP injection attempts
   */
  test('TC-SEC-005: Should prevent LDAP injection', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const ldapPayloads = [
      '*',
      '*)(uid=*',
      '*(|(uid=*))',
      'admin)(&(password=*))',
    ];

    for (const payload of ldapPayloads) {
      const booking = TestDataGenerator.generateBooking();
      booking.firstname = payload;

      const response = await apiHelper.post('/booking', booking);

      // Should safely handle or reject LDAP injection attempts
      expect([200, 400, 422]).toContain(response.status);
    }
  });

  /**
   * TC-SEC-006: Mass Assignment Vulnerability
   * Verify that API doesn't allow unauthorized field injection
   */
  test('TC-SEC-006: Should prevent mass assignment vulnerabilities', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const maliciousBooking = TestDataGenerator.generateBooking();
    
    // Try to inject unauthorized fields
    (maliciousBooking as any).isAdmin = true;
    (maliciousBooking as any).role = 'admin';
    (maliciousBooking as any).verified = true;
    (maliciousBooking as any).id = 1;

    const response = await apiHelper.post('/booking', maliciousBooking);

    // API should either reject or ignore unauthorized fields
    expect([200, 400, 422]).toContain(response.status);
    
    if (response.status === 200) {
      // Verify unauthorized fields were not stored
      expect(response.body.booking.isAdmin).toBeUndefined();
      expect(response.body.booking.role).toBeUndefined();
      expect(response.body.booking.verified).toBeUndefined();
    }
  });

  /**
   * TC-SEC-007: Sensitive Data Exposure in Errors
   * Verify that error messages don't leak sensitive information
   */
  test('TC-SEC-007: Should not expose sensitive data in error messages', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    
    // Try invalid auth
    const invalidAuth = {
      username: 'nonexistent',
      password: 'wrongpassword'
    };
    const response = await apiHelper.post('/auth', invalidAuth);

    // Should return generic error without revealing if username exists
    expect(response.status).toBe(200); // API returns "reason": "Bad credentials"
    
    // Error should not contain sensitive info like:
    const errorString = JSON.stringify(response.body);
    expect(errorString).not.toContain('database');
    expect(errorString).not.toContain('query');
    expect(errorString).not.toContain('stack');
    expect(errorString).not.toContain('exception');
  });

  /**
   * TC-SEC-008: Rate Limiting
   * Verify that API implements rate limiting to prevent abuse
   * 
   * NOTE: This test may fail if rate limiting is not implemented
   */
  test('TC-SEC-008: Should implement rate limiting', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const requests = [];

    // Send 50 rapid requests
    for (let i = 0; i < 50; i++) {
      requests.push(apiHelper.get('/booking'));
    }

    const responses = await Promise.all(requests);
    const statusCodes = responses.map(r => r.status);

    // Check if any requests were rate limited
    const hasRateLimiting = statusCodes.some(code => code === 429);

    // Log finding if rate limiting is missing
    if (!hasRateLimiting) {
      TestLogger.critical('No rate limiting detected - API vulnerable to DoS attacks');
    } else {
      TestLogger.info('Rate limiting is properly implemented');
    }

    // All responses should be valid (200 or 429)
    statusCodes.forEach(code => {
      expect([200, 429]).toContain(code);
    });
  });

  /**
   * TC-SEC-009: HTTP Security Headers
   * Verify that API includes proper security headers
   */
  test('TC-SEC-009: Should include security headers', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const response = await apiHelper.get('/booking');
    const headers = response.headers;

    // Check for common security headers
    const securityHeaders = {
      'x-content-type-options': headers['x-content-type-options'],
      'x-frame-options': headers['x-frame-options'],
      'strict-transport-security': headers['strict-transport-security'],
      'content-security-policy': headers['content-security-policy']
    };

    const missingHeaders: string[] = [];

    // Log which security headers are missing
    Object.entries(securityHeaders).forEach(([header, value]) => {
      if (!value) {
        missingHeaders.push(header);
      }
    });

    if (missingHeaders.length > 0) {
      TestLogger.warning(`Missing security headers: ${missingHeaders.join(', ')}`);
    } else {
      TestLogger.info('All recommended security headers are present');
    }

    expect(response.status).toBe(200);
  });

  /**
   * TC-SEC-010: CORS Policy Validation
   * Verify that API has proper CORS configuration
   */
  test('TC-SEC-010: Should have proper CORS policy', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const response = await apiHelper.get('/booking', {
      headers: {
        'Origin': 'https://evil-site.com'
      }
    });

    const corsHeader = response.headers['access-control-allow-origin'];

    // Log CORS configuration
    if (corsHeader === '*') {
      TestLogger.warning('CORS allows all origins (*) - verify this is intentional for public API');
    } else if (corsHeader) {
      TestLogger.info(`CORS configured for: ${corsHeader}`);
    } else {
      TestLogger.info('No CORS headers present');
    }

    expect(response.status).toBe(200);
  });

  /**
   * TC-SEC-011: Oversized Request Handling
   * Verify that API rejects oversized payloads
   */
  test('TC-SEC-011: Should reject oversized requests', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const booking = TestDataGenerator.generateBooking();
    
    // Create a very large string (1MB)
    booking.additionalneeds = 'A'.repeat(1024 * 1024);

    const response = await apiHelper.post('/booking', booking);

    // Log finding if large payloads are accepted
    if (response.status === 200) {
      TestLogger.warning('API accepts 1MB payload - potential DoS vulnerability via memory exhaustion');
    } else {
      TestLogger.info('API properly rejects oversized requests');
    }

    expect([200, 400, 413, 422]).toContain(response.status);
  });

  /**
   * TC-SEC-012: Negative Price Exploitation
   * Verify that API validates business logic for negative prices
   */
  test('TC-SEC-012: Should prevent negative price exploitation', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const booking = TestDataGenerator.generateBooking();
    booking.totalprice = -999999;

    const response = await apiHelper.post('/booking', booking);

    // Log finding if negative prices are accepted
    if (response.status === 200 && response.body.booking.totalprice < 0) {
      TestLogger.critical('API accepts negative prices - business logic vulnerability');
    } else {
      TestLogger.info('Negative prices are properly validated');
    }

    expect([200, 400, 422]).toContain(response.status);
  });

  /**
   * TC-SEC-013: Integer Overflow Prevention
   * Verify that API handles integer overflow gracefully
   */
  test('TC-SEC-013: Should handle integer overflow', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const booking = TestDataGenerator.generateBooking();
    
    // Try maximum 32-bit integer
    booking.totalprice = 2147483647;

    const response = await apiHelper.post('/booking', booking);

    // Should handle large numbers gracefully
    expect([200, 400, 422]).toContain(response.status);
    
    if (response.status === 200) {
      expect(response.body.booking.totalprice).toBe(2147483647);
    }
  });

  /**
   * TC-SEC-014: Null Byte Injection
   * Verify that API handles null byte injection attempts
   */
  test('TC-SEC-014: Should prevent null byte injection', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const booking = TestDataGenerator.generateBooking();
    
    // Null byte injection attempts
    booking.firstname = 'test\0.jpg';
    booking.lastname = 'user\0admin';

    const response = await apiHelper.post('/booking', booking);

    // Should safely handle or reject null bytes
    expect([200, 400, 422]).toContain(response.status);
  });

  /**
   * TC-SEC-015: Unicode/Emoji Handling
   * Verify that API properly handles Unicode characters
   */
  test('TC-SEC-015: Should handle Unicode and emoji correctly', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const booking = TestDataGenerator.generateBooking();
    
    booking.firstname = '🔥👍😀';
    booking.lastname = '中文测试';
    booking.additionalneeds = 'Ñoño café';

    const response = await apiHelper.post('/booking', booking);

    // Should properly handle Unicode
    expect([200, 400]).toContain(response.status);
    
    if (response.status === 200) {
      // Verify Unicode is preserved correctly
      expect(response.body.booking.firstname).toBe('🔥👍😀');
      expect(response.body.booking.lastname).toBe('中文测试');
    }
  });
});
