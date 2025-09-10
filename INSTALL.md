# Sinum MCP Server Installation Guide

## Requirements

- Node.js 18.0.0 or newer
- npm or yarn
- Access to Sinum system with API key

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp env.example .env
```

3. **Edit the `.env` file and set:**
```bash
SINUM_API_URL=http://sinum.local/api/v1
SINUM_API_KEY=your_actual_api_key_here
SINUM_HOSTNAME=sinum.local
```

**Important:** Replace `your_actual_api_key_here` with your actual API key from the Sinum system.

4. **Compile the project:**
```bash
npm run build
```

## Testing

1. **Test API connection:**
```bash
npm run dev
```

2. **Check logs** - you should see:
```
✅ Sinum API connection: OK
```

## MCP Client Configuration

Add the server to your MCP configuration (e.g., in Cursor):

```json
{
  "mcpServers": {
    "sinum": {
      "command": "node",
      "args": ["/Users/damiantokarczyk/Development/techsterowniki/sinum-mcp/dist/index.js"],
      "env": {
        "SINUM_API_URL": "http://sinum.local/api/v1",
        "SINUM_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Troubleshooting

### Error: "SINUM_API_KEY environment variable is required"
- Check if the `.env` file exists and contains a valid API key

### Error: "Network Error: No response from server"
- Check if the API URL is correct
- Check if the Sinum system is accessible on the network
- Check if the API key is valid

### Error: "API Error 401: Unauthorized"
- Check if the API key is correct
- Check if the API key has appropriate permissions

## Project Structure

```
sinum-mcp/
├── src/
│   ├── index.ts              # Main MCP server file
│   ├── types/
│   │   ├── device.ts         # Sinum device types
│   │   └── api.ts           # API types
│   ├── services/
│   │   └── sinum-api.ts     # API communication service
│   └── tools/
│       └── feature-list.ts  # Tool for retrieving devices
├── dist/                    # Compiled files
├── package.json
├── tsconfig.json
└── README.md
```

## Available Tools

- **feature_list**: Retrieves a list of all devices in the Sinum system
  - Optional parameter: `modified_since` (timestamp)
  - Returns: Formatted list of devices grouped by types
