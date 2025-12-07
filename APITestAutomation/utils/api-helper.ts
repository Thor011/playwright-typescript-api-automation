import { APIRequestContext } from '@playwright/test';

export class ApiHelper {
  constructor(private request: APIRequestContext) {}

  /**
   * Perform GET request
   */
  async get(endpoint: string, options: any = {}) {
    const response = await this.request.get(endpoint, options);
    return {
      status: response.status(),
      body: await this.parseResponse(response),
      headers: response.headers(),
      response
    };
  }

  /**
   * Perform POST request
   */
  async post(endpoint: string, data: any, options: any = {}) {
    const response = await this.request.post(endpoint, {
      data,
      ...options
    });
    return {
      status: response.status(),
      body: await this.parseResponse(response),
      headers: response.headers(),
      response
    };
  }

  /**
   * Perform PUT request
   */
  async put(endpoint: string, data: any, options: any = {}) {
    const response = await this.request.put(endpoint, {
      data,
      ...options
    });
    return {
      status: response.status(),
      body: await this.parseResponse(response),
      headers: response.headers(),
      response
    };
  }

  /**
   * Perform PATCH request
   */
  async patch(endpoint: string, data: any, options: any = {}) {
    const response = await this.request.patch(endpoint, {
      data,
      ...options
    });
    return {
      status: response.status(),
      body: await this.parseResponse(response),
      headers: response.headers(),
      response
    };
  }

  /**
   * Perform DELETE request
   */
  async delete(endpoint: string, options: any = {}) {
    const response = await this.request.delete(endpoint, options);
    return {
      status: response.status(),
      body: await this.parseResponse(response),
      headers: response.headers(),
      response
    };
  }

  /**
   * Parse response body
   */
  private async parseResponse(response: any) {
    const contentType = response.headers()['content-type'];
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    }
    return await response.text();
  }

  /**
   * Validate response schema
   */
  validateSchema(data: any, expectedKeys: string[]): boolean {
    return expectedKeys.every(key => key in data);
  }

  /**
   * Generate random string
   */
  generateRandomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  /**
   * Generate random email
   */
  generateRandomEmail(): string {
    return `test_${this.generateRandomString(8)}@example.com`;
  }
}
