import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SinumApiService } from '../services/sinum-api.js';
import { SceneCollection } from '../types/api.js';

export const sceneListTool: Tool = {
  name: 'scene_list',
  description: 'Retrieves a list of all scenes in the Sinum smarthome system',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export async function executeSceneList(
  apiService: SinumApiService
): Promise<SceneCollection> {
  try {
    const response = await apiService.getScenes();
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error retrieving scene list: ${errorMessage}`);
  }
}
