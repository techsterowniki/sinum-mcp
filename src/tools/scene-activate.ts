import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { SinumApiService } from '../services/sinum-api.js';
import { SceneActivateParams } from '../types/api.js';

export const sceneActivateTool: Tool = {
  name: 'scene_activate',
  description: 'Activates a scene with the given ID in the Sinum smarthome system',
  inputSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the scene to activate',
      },
    },
    required: ['id'],
  },
};

export async function executeSceneActivate(
  apiService: SinumApiService,
  args: SceneActivateParams
): Promise<{ success: boolean; message: string }> {
  try {
    await apiService.activateScene(args);
    return {
      success: true,
      message: `Scena o ID ${args.id} została pomyślnie aktywowana`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error activating scene: ${errorMessage}`);
  }
}
