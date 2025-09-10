import { z } from 'zod';

// Base device schema
export const BaseDeviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  class: z.string().optional(),
  purpose: z.string().optional(),
  status: z.string().optional(),
  last_seen: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Device collection schemas for different types
export const WTPDeviceSchema = BaseDeviceSchema.extend({
  signal_strength: z.number().optional(),
  battery_level: z.number().optional(),
  firmware_version: z.string().optional(),
});

export const TECHDeviceSchema = BaseDeviceSchema.extend({
  connection_type: z.string().optional(),
  ip_address: z.string().optional(),
  mac_address: z.string().optional(),
});

export const VirtualDeviceSchema = BaseDeviceSchema.extend({
  virtual_type: z.string().optional(),
  parent_device_id: z.number().optional(),
});

export const SBusDeviceSchema = BaseDeviceSchema.extend({
  bus_address: z.number().optional(),
  bus_type: z.string().optional(),
});

export const SLinkDeviceSchema = BaseDeviceSchema.extend({
  link_id: z.string().optional(),
  link_type: z.string().optional(),
});

export const LoRADeviceSchema = BaseDeviceSchema.extend({
  frequency: z.number().optional(),
  spreading_factor: z.number().optional(),
  bandwidth: z.number().optional(),
});

export const ModbusDeviceSchema = BaseDeviceSchema.extend({
  slave_id: z.number().optional(),
  register_address: z.number().optional(),
});

export const SystemModuleSchema = BaseDeviceSchema.extend({
  module_type: z.string().optional(),
  system_version: z.string().optional(),
});

export const AlarmSystemSchema = BaseDeviceSchema.extend({
  alarm_type: z.string().optional(),
  zone_id: z.number().optional(),
});

export const VideoDeviceSchema = BaseDeviceSchema.extend({
  resolution: z.string().optional(),
  stream_url: z.string().optional(),
});

export const CustomDeviceModuleSchema = BaseDeviceSchema.extend({
  custom_type: z.string().optional(),
  module_config: z.record(z.any()).optional(),
});

// Collection schemas
export const DeviceCollectionSchema = z.object({
  wtp: z.array(WTPDeviceSchema).optional().default([]),
  tech: z.array(TECHDeviceSchema).optional().default([]),
  virtual: z.array(VirtualDeviceSchema).optional().default([]),
  system_module: z.array(SystemModuleSchema).optional().default([]),
  sbus: z.array(SBusDeviceSchema).optional().default([]),
  slink: z.array(SLinkDeviceSchema).optional().default([]),
  lora: z.array(LoRADeviceSchema).optional().default([]),
  modbus: z.array(ModbusDeviceSchema).optional().default([]),
  alarm_system: z.array(AlarmSystemSchema).optional().default([]),
  video: z.array(VideoDeviceSchema).optional().default([]),
  custom_device_module: z.array(CustomDeviceModuleSchema).optional().default([]),
});

// API response schema
export const DevicesResponseSchema = z.object({
  data: DeviceCollectionSchema,
});

// Type exports
export type BaseDevice = z.infer<typeof BaseDeviceSchema>;
export type WTPDevice = z.infer<typeof WTPDeviceSchema>;
export type TECHDevice = z.infer<typeof TECHDeviceSchema>;
export type VirtualDevice = z.infer<typeof VirtualDeviceSchema>;
export type SBusDevice = z.infer<typeof SBusDeviceSchema>;
export type SLinkDevice = z.infer<typeof SLinkDeviceSchema>;
export type LoRADevice = z.infer<typeof LoRADeviceSchema>;
export type ModbusDevice = z.infer<typeof ModbusDeviceSchema>;
export type SystemModule = z.infer<typeof SystemModuleSchema>;
export type AlarmSystem = z.infer<typeof AlarmSystemSchema>;
export type VideoDevice = z.infer<typeof VideoDeviceSchema>;
export type CustomDeviceModule = z.infer<typeof CustomDeviceModuleSchema>;
export type DeviceCollection = z.infer<typeof DeviceCollectionSchema>;
export type DevicesResponse = z.infer<typeof DevicesResponseSchema>;

// Union type for all device types
export type Device = 
  | WTPDevice 
  | TECHDevice 
  | VirtualDevice 
  | SBusDevice 
  | SLinkDevice 
  | LoRADevice 
  | ModbusDevice 
  | SystemModule 
  | AlarmSystem 
  | VideoDevice 
  | CustomDeviceModule;
