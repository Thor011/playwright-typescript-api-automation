export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  apiKey?: string;
}

export const config: TestConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
  timeout: parseInt(process.env.TIMEOUT || '60000'),
  retries: parseInt(process.env.RETRIES || '2'),
  apiKey: process.env.API_KEY,
};
