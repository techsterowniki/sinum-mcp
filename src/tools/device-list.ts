import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SinumApiService } from '../services/sinum-api.js';
import { FeatureListParams } from '../types/api.js';
import { DeviceCollection } from '../types/device.js';

export const deviceListTool: Tool = {
  name: 'device_list',
  description: 'Retrieves a list of all devices in the Sinum smarthome system',
  inputSchema: {
    type: 'object',
    properties: {
      modified_since: {
        type: 'number',
        description: 'Timestamp - returns only devices modified after this date (optional)',
      },
    },
  },
};

export async function executeDeviceList(
  apiService: SinumApiService,
  args: FeatureListParams
): Promise<DeviceCollection> {
  try {
    const response = await apiService.getDevices(args);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error retrieving device list: ${errorMessage}`);
  }
}

