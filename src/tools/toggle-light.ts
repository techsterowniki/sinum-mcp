import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SinumApiService } from '../services/sinum-api.js';
import { DeviceCollection } from '../types/device.js';

export const toggleLightTool: Tool = {
  name: 'toggle_light',
  description: 'Toggles the state of a light (on/off) for devices of type relay with purpose === light',
  inputSchema: {
    type: 'object',
    properties: {
      device_id: {
        type: 'number',
        description: 'ID of the device to toggle',
      },
    },
    required: ['device_id'],
  },
};

export async function executeToggleLight(
  apiService: SinumApiService,
  args: { device_id: number }
): Promise<{ success: boolean; message: string; device?: any }> {
  try {
    const devicesResponse = await apiService.getDevices();
    const devices = devicesResponse.data;

    let targetDevice: any = null;
    let deviceClass: string | null = null;

    const deviceClasses = [
      { name: 'wtp', devices: devices.wtp },
      { name: 'tech', devices: devices.tech },
      { name: 'virtual', devices: devices.virtual },
      { name: 'sbus', devices: devices.sbus },
      { name: 'slink', devices: devices.slink },
      { name: 'lora', devices: devices.lora },
      { name: 'modbus', devices: devices.modbus },
      { name: 'custom_device_module', devices: devices.custom_device_module },
    ];

    for (const deviceClassInfo of deviceClasses) {
      const foundDevice = deviceClassInfo.devices.find(device => device.id === args.device_id);
      if (foundDevice) {
        targetDevice = foundDevice;
        deviceClass = deviceClassInfo.name;
        break;
      }
    }

    if (!targetDevice) {
      return {
        success: false,
        message: `Device with ID ${args.device_id} not found`,
      };
    }

    if (targetDevice.type !== 'relay') {
      return {
        success: false,
        message: `Device with ID ${args.device_id} is not of type relay (type: ${targetDevice.type})`,
      };
    }

    if (targetDevice.purpose !== 'light') {
      return {
        success: false,
        message: `Device with ID ${args.device_id} does not have purpose === light (purpose: ${targetDevice.purpose})`,
      };
    }

    if (!deviceClass) {
      return {
        success: false,
        message: `Cannot determine device class for ID ${args.device_id}`,
      };
    }

    // Send toggle command
    const result = await apiService.sendCommand(deviceClass, args.device_id, 'toggle');

    return {
      success: true,
      message: `Successfully toggled light with ID ${args.device_id} (${targetDevice.name})`,
      device: result.data || targetDevice,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `Error while toggling light: ${errorMessage}`,
    };
  }
}
