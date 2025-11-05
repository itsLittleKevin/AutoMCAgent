# AutoMCAgent

An autonomous Minecraft bot built with Python (orchestrator) and TypeScript/Mineflayer (game interface). The bot uses hierarchical intelligence to survive, gather resources, and complete complex goals.

## Project Status

**Current Phase**: Phase 0 - Foundation (In Development)

See [plan.md](plan.md) for the complete development roadmap.

## Architecture

- **Python**: Main orchestrator, decision-making, memory, goal management
- **TypeScript + Mineflayer**: Game interface, low-level bot control
- **WebSocket Bridge**: Real-time communication between Python and TypeScript

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Minecraft Java Edition server (local or remote)

### Setup

1. **Install Python dependencies**:
```bash
cd python
pip install -r requirements.txt
```

2. **Install Node.js dependencies**:
```bash
cd node
npm install
```

3. **Configure the bot**:
```bash
cp config.yaml config.local.yaml
# Edit config.local.yaml with your server details
```

4. **Build TypeScript**:
```bash
cd node
npm run build
```

### Running the Bot

**Phase 0** (Connection test):

1. Start the TypeScript bot (in terminal 1):
```bash
cd node
npm start
```

2. Start the Python orchestrator (in terminal 2):
```bash
cd python
python main.py
```

The bot should connect to your Minecraft server and establish the Python ↔ TypeScript bridge.

## Development

- **TypeScript development mode** (auto-rebuild):
  ```bash
  cd node
  npm run watch
  ```

- **Run tests**:
  ```bash
  cd python
  pytest ../tests/
  ```

## Project Structure

```
AutoMCAgent/
├── python/          # Python orchestrator
│   ├── main.py
│   ├── bridge/      # WebSocket client
│   ├── commander/   # Goal management
│   ├── planner/     # Task decomposition
│   ├── executor/    # Skill execution
│   ├── memory/      # State & history
│   └── reflexes/    # Immediate responses
├── node/            # TypeScript bot
│   ├── src/
│   │   ├── index.ts    # Entry point
│   │   ├── bridge.ts   # WebSocket server
│   │   └── types.ts    # Shared types
│   └── dist/           # Compiled JS
├── tests/           # Unit & integration tests
├── docs/            # Documentation
├── config.yaml      # Configuration template
└── plan.md          # Development roadmap
```

## Phase Roadmap

- [x] **Phase 0**: Foundation - Connection & perception
- [ ] **Phase 1**: Reflexes - Survival responses
- [ ] **Phase 2**: Skills - Action library
- [ ] **Phase 3**: Goals - Autonomous behavior
- [ ] **Phase 4**: Memory - Learning & persistence
- [ ] **Phase 5**: Advanced - LLM integration

## Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## License

MIT

## Acknowledgments

- [Mineflayer](https://github.com/PrismarineJS/mineflayer) - Minecraft bot framework
- [Voyager](https://github.com/MineDojo/Voyager) - Inspiration for architecture
- [MineDojo](https://github.com/MineDojo/MineDojo) - Research platform
