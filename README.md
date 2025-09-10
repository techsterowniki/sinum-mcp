# Sinum MCP Server

Model Context Protocol server for Sinum smarthome system.

## Description

This MCP server enables interaction with the Sinum system through Model Context Protocol. It allows retrieving device information and managing the smarthome system.

## Features

- **device_list**: Retrieving list of all devices in the Sinum system
- **scene_list**: Retrieving list of all scenes in the Sinum system
- **scene_activate**: Activating scenes by ID
- **toggle_light**: Toggling light devices (relay type with purpose === light)
- API key authorization
- Support for various device types (WTP, TECH, Virtual, SBus, SLink, LoRa, Modbus, etc.)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp env.example .env
```

3. Edit the `.env` file and set:
- `SINUM_API_URL`: Sinum API URL (default: http://sinum.local/api/v1)
- `SINUM_API_KEY`: Your API key for the Sinum system

**Important:** Replace `your_api_key_here` with your actual API key from the Sinum system.

## Running

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## MCP Configuration

Add the server to your MCP configuration:

```json
{
  "mcpServers": {
    "sinum": {
      "command": "node",
      "args": ["/path/to/sinum-mcp/dist/index.js"],
      "env": {
        "SINUM_API_URL": "http://sinum.local/api/v1",
        "SINUM_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## API

### device_list

Retrieves a list of all devices in the Sinum system.

**Parameters:**
- `modified_since` (optional): Timestamp - returns only devices modified after this date

**Returns:**
- Collection of devices grouped by types (WTP, TECH, Virtual, SBus, SLink, LoRa, Modbus, System Module, Alarm System, Video, Custom Device Module)

### scene_list

Retrieves a list of all scenes in the Sinum system.

**Parameters:**
- None

**Returns:**
- Collection of scenes with their details

### scene_activate

Activates a scene with the given ID in the Sinum system.

**Parameters:**
- `id` (required): ID of the scene to activate

**Returns:**
- Success status and message

### toggle_light

Toggles the state of a light device (on/off) for devices of type relay with purpose === light.

**Parameters:**
- `device_id` (required): ID of the device to toggle

**Returns:**
- Success status, message, and updated device information

## Project Structure

```
sinum-mcp/
├── src/
│   ├── index.ts              # Main server file
│   ├── types/
│   │   ├── device.ts         # Device types
│   │   └── api.ts           # API types
│   ├── services/
│   │   └── sinum-api.ts     # Service for communication with Sinum API
│   └── tools/
│       ├── device-list.ts   # Tool for retrieving device list
│       ├── scene-list.ts    # Tool for retrieving scene list
│       ├── scene-activate.ts # Tool for activating scenes
│       └── toggle-light.ts  # Tool for toggling light devices
├── dist/                    # Compiled files
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
