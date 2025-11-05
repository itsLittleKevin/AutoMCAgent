/**
 * WebSocket bridge server for Python ↔ Mineflayer communication
 * Receives commands from Python, executes via Mineflayer, returns results
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Bot } from 'mineflayer';
import { BridgeMessage, Command, CommandResult } from './types';

export class Bridge {
  private wss: WebSocketServer;
  private client: WebSocket | null = null;
  private bot: Bot;
  private port: number;

  constructor(bot: Bot, port: number = 8765) {
    this.bot = bot;
    this.port = port;
    this.wss = new WebSocketServer({ port: this.port });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[Bridge] Python client connected');
      this.client = ws;

      ws.on('message', (data: Buffer) => {
        try {
          const message: BridgeMessage = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('[Bridge] Failed to parse message:', error);
        }
      });

      ws.on('close', () => {
        console.log('[Bridge] Python client disconnected');
        this.client = null;
      });

      ws.on('error', (error) => {
        console.error('[Bridge] WebSocket error:', error);
      });

      // Send initial connection confirmation
      this.sendMessage({
        type: 'event',
        payload: { event: 'bridge_ready' },
        timestamp: Date.now()
      });
    });

    console.log(`[Bridge] WebSocket server listening on port ${this.port}`);
  }

  private handleMessage(message: BridgeMessage) {
    if (message.type === 'command') {
      const command = message.payload as Command;
      this.executeCommand(command);
    }
  }

  private async executeCommand(command: Command) {
    // TODO: Implement command execution in Phase 0
    // This will route commands to appropriate bot methods
    console.log('[Bridge] Received command:', command.action);
    
    const result: CommandResult = {
      id: command.id,
      success: false,
      error: 'Command execution not yet implemented'
    };

    this.sendResult(result);
  }

  public sendMessage(message: BridgeMessage) {
    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify(message));
    }
  }

  public sendResult(result: CommandResult) {
    this.sendMessage({
      type: 'result',
      payload: result,
      timestamp: Date.now()
    });
  }

  public sendState() {
    // Gather comprehensive bot state
    const state = {
      health: this.bot.health,
      food: this.bot.food,
      foodSaturation: this.bot.foodSaturation,
      position: {
        x: this.bot.entity.position.x,
        y: this.bot.entity.position.y,
        z: this.bot.entity.position.z
      },
      velocity: {
        x: this.bot.entity.velocity.x,
        y: this.bot.entity.velocity.y,
        z: this.bot.entity.velocity.z
      },
      yaw: this.bot.entity.yaw,
      pitch: this.bot.entity.pitch,
      onGround: this.bot.entity.onGround,
      isInWater: (this.bot.entity as any).isInWater || false,
      isInLava: (this.bot.entity as any).isInLava || false,
      isCollidedHorizontally: (this.bot.entity as any).isCollidedHorizontally || false,
      isCollidedVertically: (this.bot.entity as any).isCollidedVertically || false,
      biome: this.bot.blockAt(this.bot.entity.position)?.biome || null,
      lightLevel: this.bot.entity.position.y >= 0 ? 
        this.bot.blockAt(this.bot.entity.position)?.light || 0 : 0,
      experience: {
        level: this.bot.experience.level,
        points: this.bot.experience.points,
        progress: this.bot.experience.progress
      }
    };

    this.sendMessage({
      type: 'state',
      payload: state,
      timestamp: Date.now()
    });
  }

  public sendEvent(eventName: string, data: any) {
    this.sendMessage({
      type: 'event',
      payload: { event: eventName, data },
      timestamp: Date.now()
    });
  }

  public close() {
    this.wss.close();
  }
}
