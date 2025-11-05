/**
 * AutoMCAgent - Mineflayer Bot Entry Point
 * Phase 0: Basic connection and bridge setup
 */

import mineflayer, { Bot } from 'mineflayer';
import { pathfinder } from 'mineflayer-pathfinder';
import { Bridge } from './bridge';

// Configuration - TODO: Load from config file
const BOT_CONFIG = {
  host: 'localhost',
  port: 25565,
  username: 'AutoMCAgent',
  version: '1.20.1', // Adjust to your server version
  bridgePort: 8765
};

function createBot(): Bot {
  console.log('[Bot] Creating Mineflayer bot...');
  
  const bot = mineflayer.createBot({
    host: BOT_CONFIG.host,
    port: BOT_CONFIG.port,
    username: BOT_CONFIG.username,
    version: BOT_CONFIG.version
  });

  // Load pathfinder plugin
  bot.loadPlugin(pathfinder);

  return bot;
}

function setupBotEvents(bot: Bot, bridge: Bridge) {
  bot.on('spawn', () => {
    console.log('[Bot] Spawned in game');
    bridge.sendEvent('bot_spawned', {
      position: bot.entity.position,
      gameMode: bot.game.gameMode
    });
  });

  bot.on('health', () => {
    // Send health updates to Python
    bridge.sendEvent('health_update', {
      health: bot.health,
      food: bot.food
    });
  });

  bot.on('death', () => {
    console.log('[Bot] Died!');
    bridge.sendEvent('bot_died', {
      position: bot.entity.position
    });
  });

  bot.on('kicked', (reason) => {
    console.log('[Bot] Kicked:', reason);
    bridge.sendEvent('bot_kicked', { reason });
  });

  bot.on('error', (err) => {
    console.error('[Bot] Error:', err);
    bridge.sendEvent('bot_error', { error: err.message });
  });

  bot.on('end', () => {
    console.log('[Bot] Disconnected');
    bridge.close();
    process.exit(0);
  });

  // Chat logging
  bot.on('chat', (username, message) => {
    console.log(`[Chat] <${username}> ${message}`);
    bridge.sendEvent('chat_message', { username, message });
  });
}

function main() {
  console.log('[Main] Starting AutoMCAgent bot...');
  
  const bot = createBot();
  const bridge = new Bridge(bot, BOT_CONFIG.bridgePort);
  
  setupBotEvents(bot, bridge);

  // Periodic state updates (every 100ms)
  setInterval(() => {
    if (bot.entity) {
      bridge.sendState();
    }
  }, 100);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('[Main] Shutting down...');
    bot.quit();
    bridge.close();
    process.exit(0);
  });
}

// Start the bot
main();
