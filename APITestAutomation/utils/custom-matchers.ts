import { expect as baseExpect } from '@playwright/test';

/**
 * Custom matchers for API testing
 */
export const expect = baseExpect.extend({
  /**
   * Check if status code is one of the provided values
   */
  toBeOneOf(received: number, expected: number[]) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected.join(', ')}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected.join(', ')}`,
        pass: false,
      };
    }
  },

  /**
   * Check if response has valid JSON structure
   */
  toBeValidJson(received: any) {
    const pass = typeof received === 'object' && received !== null;
    if (pass) {
      return {
        message: () => `expected response not to be valid JSON`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to be valid JSON, but got ${typeof received}`,
        pass: false,
      };
    }
  },

  /**
   * Check if response time is within acceptable range
   */
  toBeWithinResponseTime(received: number, maxTime: number) {
    const pass = received <= maxTime;
    if (pass) {
      return {
        message: () => `expected response time ${received}ms to be greater than ${maxTime}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response time ${received}ms to be within ${maxTime}ms, but it was too slow`,
        pass: false,
      };
    }
  },
});
