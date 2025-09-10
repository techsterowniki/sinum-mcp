# Sinum MCP Server

Model Context Protocol server for Sinum smarthome system.

## Description

This MCP server enables interaction with the Sinum system through Model Context Protocol. It allows retrieving device information and managing the smarthome system.

## Features

- **feature_list**: Retrieving list of all devices in the Sinum system
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

### feature_list

Retrieves a list of all devices in the Sinum system.

**Parameters:**
- `modified_since` (optional): Timestamp - returns only devices modified after this date

**Returns:**
- Collection of devices grouped by types (WTP, TECH, Virtual, SBus, SLink, LoRa, Modbus, System Module, Alarm System, Video, Custom Device Module)

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
│       └── feature-list.ts  # Tool for retrieving device list
├── dist/                    # Compiled files
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
