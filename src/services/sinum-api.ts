import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiConfig, ApiError, FeatureListParams } from '../types/api.js';
import { DevicesResponse, DevicesResponseSchema } from '../types/device.js';

export class SinumApiService {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': `${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response) {
          // Server responded with error status
          const apiError: ApiError = {
            error: 'API_ERROR',
            message: error.response.data?.message || error.message,
            code: error.response.status,
            details: error.response.data,
          };
          throw new Error(`API Error ${apiError.code}: ${apiError.message}`);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(`Network Error: No response from server`);
        } else {
          // Something else happened
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Retrieves a list of all devices from the Sinum system
   */
  async getDevices(params?: FeatureListParams): Promise<DevicesResponse> {
    try {
      const queryParams: Record<string, any> = {};
      
      if (params?.modified_since) {
        queryParams.modified_since = params.modified_since;
      }

      const response: AxiosResponse = await this.client.get('/devices', {
        params: queryParams,
      });

      // Validate response with Zod schema
      try {
        const validatedResponse = DevicesResponseSchema.parse(response.data);
        return validatedResponse;
      } catch (validationError) {
        console.error('Validation error:', validationError);
        // If validation fails, try to parse with safeParse and provide defaults
        const safeParseResult = DevicesResponseSchema.safeParse(response.data);
        if (safeParseResult.success) {
          return safeParseResult.data;
        } else {
          // If still failing, create a response with empty arrays for missing fields
          const rawData = response.data;
          const fallbackData = {
            data: {
              wtp: rawData.wtp || [],
              tech: rawData.tech || [],
              virtual: rawData.virtual || [],
              system_module: rawData.system_module || [],
              sbus: rawData.sbus || [],
              slink: rawData.slink || [],
              lora: rawData.lora || [],
              modbus: rawData.modbus || [],
              alarm_system: rawData.alarm_system || [],
              video: rawData.video || [],
              custom_device_module: rawData.custom_device_module || [],
            }
          };
          return DevicesResponseSchema.parse(fallbackData);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch devices: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching devices');
    }
  }

  /**
   * Testuje połączenie z API Sinum
   */
  async testConnection(): Promise<boolean> {
    try {
      console.error('🔍 Testing Sinum API connection...');
      await this.client.get('/devices', { 
        params: { modified_since: 0 },
        timeout: 5000 
      });
      return true;
    } catch (error) {
      console.error('❌ Error testing Sinum API connection:', error);
      return false;
    }
  }

  /**
   * Retrieves API configuration information
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }
}
