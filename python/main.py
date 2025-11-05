"""
AutoMCAgent - Main Entry Point
Phase 0: Foundation - Connection and basic bridge communication
"""

import asyncio
import yaml
import logging
from pathlib import Path

from bridge.websocket_client import BridgeClient
from utils.logger import setup_logger


def load_config() -> dict:
    """Load configuration from config.yaml or config.local.yaml"""
    config_paths = [
        Path('config.local.yaml'),
        Path('config.yaml'),
        Path('../config.local.yaml'),
        Path('../config.yaml')
    ]
    
    for config_path in config_paths:
        if config_path.exists():
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
    
    raise FileNotFoundError("No config.yaml found. Please create one from config.yaml template.")


async def main():
    """Main orchestrator loop"""
    # Load configuration
    config = load_config()
    
    # Setup logging
    logger = setup_logger(config.get('logging', {}))
    logger.info("Starting AutoMCAgent...")
    logger.info(f"Phase {config['phases']['enabled']} enabled")
    
    # Connect to TypeScript bridge
    bridge = BridgeClient(
        host=config['bridge']['host'],
        port=config['bridge']['port']
    )
    
    # Track last state for comparison
    last_state = {}
    
    # Register state handler
    async def handle_state(state):
        nonlocal last_state
        # Log significant state changes
        if not last_state or state.get('health') != last_state.get('health'):
            logger.info(f"Health: {state.get('health')}/20")
        if not last_state or state.get('food') != last_state.get('food'):
            logger.info(f"Hunger: {state.get('food')}/20")
        if not last_state or abs(state.get('position', {}).get('y', 0) - last_state.get('position', {}).get('y', 0)) > 5:
            pos = state.get('position', {})
            logger.info(f"Position: ({pos.get('x', 0):.1f}, {pos.get('y', 0):.1f}, {pos.get('z', 0):.1f})")
        last_state = state
    
    bridge.register_handler('state', handle_state)
    
    try:
        await bridge.connect()
        logger.info("Connected to Mineflayer bridge")
        
        # Phase 0: Monitor bot state
        while True:
            # State updates come automatically every 100ms from TypeScript
            # TODO Phase 1: Add reflex system
            # TODO Phase 2: Add skill executor
            # TODO Phase 3: Add goal system
            
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
    finally:
        await bridge.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
