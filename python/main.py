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
    
    try:
        await bridge.connect()
        logger.info("Connected to Mineflayer bridge")
        
        # Phase 0: Just maintain connection and log state
        while True:
            # TODO Phase 0: Request and log bot state
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
