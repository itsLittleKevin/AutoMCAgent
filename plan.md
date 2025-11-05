# AutoMCAgent - Autonomous Minecraft Bot

## Project Overview
Build a fully autonomous Minecraft agent that can survive, gather resources, and complete complex goals like defeating the Ender Dragon. The system uses a hierarchical intelligence architecture with modular, testable components.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────┐
│                    Commander                        │
│         (Goal Manager + Priority Queue)             │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                     Planner                         │
│        (Goal Decomposition + Task Queue)            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                    Executor                         │
│  (Skill Library + Mineflayer Interface Bridge)      │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                     Memory                          │
│     (State + History + World Knowledge DB)          │
└─────────────────────────────────────────────────────┘
```

### Intelligence Tiers

**Tier 0 - Reflexes (~1ms response)**
- Rule-based immediate responses
- No planning, pure reactive
- Examples: Flee from creepers, eat when hungry, avoid lava
- Cannot be disabled (always active for survival)

**Tier 1 - Skills (~100ms response)**
- Pre-programmed capabilities
- Pathfinding, mining, crafting, combat, building
- Deterministic and testable
- Uses mineflayer plugins (pathfinder, collectblock, etc.)

**Tier 2 - Tactics (Optional, ~1s response)**
- Short-term decision making
- "Should I mine iron or find food first?"
- Could use lightweight RL model or heuristics
- Phase 5+ feature

**Tier 3 - Strategy (~5-10s response)**
- High-level goal planning
- Uses local LLM (Ollama + Llama 3.1) for complex reasoning
- Runs infrequently (every 50-100 actions)
- Phase 5+ feature

## Technology Stack

### Core
- **Python 3.11+**: Main orchestrator, AI logic, Commander/Planner/Memory
- **TypeScript + Node.js + Mineflayer**: Game interface and low-level bot control
- **WebSocket/JSON-RPC**: Bridge between Python and TypeScript processes
- **SQLite**: Persistent memory storage

### Future/Optional
- **Ollama + Llama 3.1 8B**: Local LLM for high-level strategy (Phase 5)
- **Reinforcement Learning**: Tactical decision-making (Phase 5+)

## Development Phases

### Phase 0: Foundation ✓ Target: Week 1
**Goal**: Establish basic connectivity and perception

**Components**:
- [ ] Set up Python project structure
- [ ] Set up Node.js mineflayer project
- [ ] Implement WebSocket bridge (Python ↔ Node.js)
- [ ] Connect to Minecraft server
- [ ] Read basic bot state (health, hunger, position, inventory)
- [ ] Read environment (nearby blocks, entities)

**Success Criteria**:
- Bot connects to server and stands idle
- Python can query and receive bot state every tick
- No crashes for 5 minutes of idle time

---

### Phase 1: Reflexes ✓ Target: Week 2
**Goal**: Immediate survival responses

**Components**:
- [ ] Health monitoring (flee when damaged)
- [ ] Hunger system (eat when hunger < 14)
- [ ] Danger detection (hostile mobs, lava, cliffs)
- [ ] Basic combat (attack if cornered)
- [ ] Emergency actions (swim up when drowning, extinguish fire)

**Success Criteria**:
- Bot survives 30 minutes in peaceful mode
- Bot survives 10 minutes in easy mode with reflexes active
- Bot successfully eats food when hungry
- Bot flees from hostile mobs

---

### Phase 2: Skills ✓ Target: Week 3-4
**Goal**: Build programmed skill library

**Skills to Implement**:
- [ ] `move_to(x, y, z)` - Pathfinding to location
- [ ] `mine_block(block_type, count)` - Mine specific blocks
- [ ] `collect_item(item_type, count)` - Pick up items
- [ ] `craft_item(item, count)` - Use crafting table
- [ ] `equip_item(item)` - Manage inventory/armor
- [ ] `attack_entity(entity_type)` - Combat
- [ ] `place_block(block_type, position)` - Building
- [ ] `smelt_item(item, count)` - Use furnace
- [ ] `chest_deposit(items)` / `chest_withdraw(items)` - Storage

**Success Criteria**:
- Each skill works in isolation (unit testable)
- Bot can execute skill sequences manually triggered
- Skills handle failures gracefully (can't find block, no tool, etc.)

---

### Phase 3: Goal System ✓ Target: Week 5-6
**Goal**: Autonomous goal-driven behavior

**Components**:
- [ ] Commander: Goal priority queue
- [ ] Planner: Goal decomposition engine
- [ ] Simple goal library (collect wood, make tools, build shelter)
- [ ] Goal templates with prerequisites

**Example Goals**:
- "Collect 10 wood" → [find tree, mine wood blocks, collect drops]
- "Make wooden pickaxe" → [have 3 planks, have 2 sticks, craft at table]
- "Mine 5 iron ore" → [have pickaxe, find iron, mine iron]

**Success Criteria**:
- Given goal "collect 64 oak logs", bot completes autonomously
- Given goal "craft stone pickaxe", bot gathers materials and crafts
- Bot handles goal failures (tree not found → search new area)

---

### Phase 4: Memory & Learning ✓ Target: Week 7-8
**Goal**: Persistent knowledge and failure recovery

**Memory Systems**:
- [ ] **Short-term**: Last 100 actions/observations (in-memory)
- [ ] **Long-term**: SQLite database
  - Death locations and causes
  - Resource locations (ore veins, trees, water)
  - Chest contents and locations
  - Dangerous areas (marked after deaths)
- [ ] **World knowledge**: Block types, crafting recipes, mob behavior

**Learning Features**:
- [ ] Track death causes, avoid repeating fatal mistakes
- [ ] Remember resource-rich areas
- [ ] Build mental map of explored territory
- [ ] Performance metrics (goals completed, deaths, resources gathered)

**Success Criteria**:
- Bot avoids areas where it previously died
- Bot returns to known resource locations
- Bot survives 2+ hours autonomously
- Memory persists across bot restarts

---

### Phase 5: Advanced Intelligence (Optional) ✓ Target: Week 9+
**Goal**: LLM-powered strategic planning

**Components**:
- [ ] Integrate Ollama (local LLM)
- [ ] LLM prompt templates for goal generation
- [ ] Context building (summarize world state for LLM)
- [ ] Goal validation and safety checks
- [ ] Complex multi-step goals (defeat Ender Dragon)

**LLM Use Cases**:
- Generate next high-level goal based on current state
- Recover from unexpected situations
- Optimize resource gathering strategies
- Plan complex construction projects

**Success Criteria**:
- Bot can generate own goals without human input
- Bot adapts strategy based on deaths/failures
- Bot progresses through Minecraft tech tree autonomously
- (Stretch) Bot defeats Ender Dragon with minimal human intervention

---

### Phase 6: Polish & Optimization (Future)
- Multi-agent coordination
- Advanced combat AI (PvP capable)
- Reinforcement learning for tactical decisions
- GUI dashboard for monitoring
- Configurable personality/playstyle

## Project Structure

```
AutoMCAgent/
├── plan.md                    # This file
├── README.md                  # User documentation
├── .gitignore
│
├── python/                    # Python orchestrator
│   ├── main.py               # Entry point
│   ├── requirements.txt
│   ├── commander/            # Goal management
│   │   ├── goal_manager.py
│   │   └── goals/           # Goal definitions
│   ├── planner/             # Task decomposition
│   │   └── planner.py
│   ├── executor/            # Skill execution
│   │   ├── executor.py
│   │   └── skills/          # Skill implementations
│   ├── memory/              # State & history
│   │   ├── memory.py
│   │   └── database.py
│   ├── reflexes/            # Tier 0 responses
│   │   └── reflexes.py
│   ├── bridge/              # Python ↔ Node.js
│   │   └── websocket_client.py
│   └── utils/
│
├── node/                     # TypeScript Mineflayer bot
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts         # Bot entry point
│   │   ├── bridge.ts        # WebSocket server
│   │   ├── types.ts         # Shared type definitions
│   │   └── plugins/         # Custom mineflayer plugins
│   └── dist/                # Compiled JavaScript (gitignored)
│
├── tests/                    # Unit & integration tests
│   ├── test_skills.py
│   ├── test_goals.py
│   └── test_bridge.py
│
└── docs/                     # Additional documentation
    ├── skills.md            # Skill API reference
    ├── goals.md             # Goal system guide
    └── architecture.md      # Deep dive into design
```

## Modularity & Testing

### Configuration System
- YAML config file for toggling components
- Enable/disable specific tiers, skills, goals
- Adjust parameters (reflex thresholds, goal priorities)

### Testing Levels
1. **Unit tests**: Individual skills in isolation
2. **Integration tests**: Skill sequences, goal completion
3. **Survival tests**: Time-based survival metrics
4. **Regression tests**: Ensure fixes don't break features

### Debug Modes
- `--phase=0` : Connection only
- `--phase=1` : Reflexes only
- `--phase=2` : Reflexes + Skills (manual trigger)
- `--phase=3` : Full autonomous (no LLM)
- `--phase=5` : Full autonomous with LLM

## Metrics & Monitoring

### Key Performance Indicators
- **Survival time**: How long before death
- **Deaths per hour**: Measure safety improvements
- **Goals completed**: Success rate
- **Resource efficiency**: Resources gathered per hour
- **Decision latency**: Time from perception to action

### Logging
- All actions logged with timestamps
- Decision reasoning tracked
- Errors and exceptions recorded
- Replay capability for debugging deaths

## Success Criteria (Overall)

**Minimum Viable Bot (Phase 3)**:
- Survives indefinitely in normal difficulty
- Autonomously gathers basic resources
- Crafts tools and maintains equipment
- Completes simple goals without human input

**Advanced Bot (Phase 5)**:
- Progresses through full Minecraft tech tree
- Defeats Ender Dragon with <10 deaths
- Adapts strategy based on environment
- Generates own goals aligned with long-term objectives

## Future Considerations

- **Multi-bot coordination**: Swarm behavior, task delegation
- **PvP capabilities**: Detect and respond to hostile players
- **Creativity**: Building aesthetically pleasing structures
- **Communication**: Understand player chat commands
- **Mod support**: Extend beyond vanilla Minecraft

## References & Inspiration

- **Voyager** (MineDojo/NVIDIA): LLM-powered Minecraft agent with skill library
- **MineDojo**: Minecraft simulation platform for agents
- **Mineflayer**: Mature Node.js Minecraft bot framework
- **Baritone**: Advanced pathfinding and automation mod
- **OpenAI Contractor**: Early work on Minecraft agents

---

**Last Updated**: November 4, 2025
**Status**: Planning phase complete, ready for Phase 0 implementation
