#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { SinumApiService } from './services/sinum-api.js';
import { ApiConfig } from './types/api.js';
import { deviceListTool, executeDeviceList } from './tools/device-list.js';
import { sceneListTool, executeSceneList } from './tools/scene-list.js';
import { sceneActivateTool, executeSceneActivate } from './tools/scene-activate.js';
import { toggleLightTool, executeToggleLight } from './tools/toggle-light.js';

class SinumMCPServer {
  private server: Server;
  private apiService: SinumApiService;

  constructor() {
    // Initialize MCP server
    this.server = new Server({
      name: 'sinum-mcp',
      version: '1.0.0',
      capabilities: {
        tools: {},
      },
    });

    // Initialize API service
    const apiConfig = this.loadApiConfig();
    this.apiService = new SinumApiService(apiConfig);

    this.setupHandlers();
  }

  private loadApiConfig(): ApiConfig {
    const apiUrl = process.env.SINUM_API_URL || 'http://sinum.local/api/v1';
    const apiKey = process.env.SINUM_API_KEY;

    if (!apiKey) {
      console.error('❌ Configuration error: Missing API key');
      console.error('📝 Create .env file based on env.example and set SINUM_API_KEY');
      console.error('💡 Example:');
      console.error('   cp env.example .env');
      console.error('   # Then edit .env and set your API key');
      throw new Error('SINUM_API_KEY environment variable is required. Check .env file');
    }

    console.error(`🔧 API Configuration: ${apiUrl}`);
    console.error(`🔑 API Key: ${apiKey.substring(0, 8)}...`);

    return {
      baseUrl: apiUrl,
      apiKey: apiKey,
      timeout: 10000,
    };
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [deviceListTool, sceneListTool, sceneActivateTool, toggleLightTool],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'device_list':
            const result = await executeDeviceList(this.apiService, args || {});
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };

          case 'scene_list':
            const sceneResult = await executeSceneList(this.apiService);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(sceneResult, null, 2),
                },
              ],
            };

          case 'scene_activate':
            const activateResult = await executeSceneActivate(this.apiService, args || {});
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(activateResult, null, 2),
                },
              ],
            };

          case 'toggle_light':
            const toggleResult = await executeToggleLight(this.apiService, args || {});
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(toggleResult, null, 2),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Sinum MCP Server started successfully');
    console.error(`API URL: ${this.apiService.getConfig().baseUrl}`);
    
    // Test connection to Sinum API
    try {
      const isConnected = await this.apiService.testConnection();
      if (isConnected) {
        console.error('✅ Sinum API connection: OK');
      } else {
        console.error('❌ Sinum API connection: ERROR');
      }
    } catch (error) {
      console.error('❌ Error testing Sinum API connection:', error);
    }
  }
}

// Start server
async function main() {
  try {
    const server = new SinumMCPServer();
    await server.run();
  } catch (error) {
    console.error('Failed to start Sinum MCP Server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down Sinum MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Shutting down Sinum MCP Server...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
