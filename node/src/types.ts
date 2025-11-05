/**
 * Shared type definitions for Python ↔ TypeScript bridge
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BotState {
  health: number;
  food: number;
  foodSaturation: number;
  position: Vec3;
  velocity: Vec3;
  yaw: number;
  pitch: number;
  onGround: boolean;
  isInWater: boolean;
  isInLava: boolean;
  isCollidedHorizontally: boolean;
  isCollidedVertically: boolean;
  biome: string | null;
  lightLevel: number;
  experience: {
    level: number;
    points: number;
    progress: number;
  };
}

export interface Entity {
  id: number;
  type: string;
  name: string | null;
  position: Vec3;
  velocity: Vec3;
  yaw: number;
  pitch: number;
  health?: number;
  isHostile?: boolean;
  distance: number;
}

export interface Block {
  position: Vec3;
  type: number;
  name: string;
  hardness: number;
  diggable: boolean;
}

export interface InventoryItem {
  slot: number;
  type: number;
  name: string;
  count: number;
  metadata: number;
  nbt: any;
}

export interface Command {
  id: string;
  action: string;
  params: any;
}

export interface CommandResult {
  id: string;
  success: boolean;
  data?: any;
  error?: string;
}

export interface BridgeMessage {
  type: 'command' | 'state' | 'event' | 'result';
  payload: Command | BotState | CommandResult | any;
  timestamp: number;
}
