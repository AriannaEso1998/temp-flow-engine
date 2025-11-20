# Flow Engine

TypeScript-based conversational flow management system using XState for Finite State Machines (FSM).

## Project Status

**Current Phase**: Core Implementation (MVP)

### Completed
- ✅ TypeScript project setup with strict type checking
- ✅ OpenAPI 3.1.0 schema definition with conditional validation (if/then/else)
- ✅ Type generation from OpenAPI schema using openapi-typescript
- ✅ Complete type system with type guards and validators
- ✅ FSMCompiler skeleton for XState machine compilation
- ✅ ConversationalFlowRunner with public actor exposure
- ✅ Arrest framework configured for OpenAPI 3.1.0 support

### In Progress
- 🔨 FSM compilation logic (transitions, guards, actions)
- 🔨 API endpoint implementations

### Planned
- 📋 Redis integration for memory management
- 📋 MongoDB integration for flow storage
- 📋 Complete API implementation
- 📋 Testing suite

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Complete system architecture and technical details
- [FLOW-ENGINE.md](docs/FLOW-ENGINE.md) - OpenAPI schema specifications and business logic
- [CLAUDE.md](CLAUDE.md) - Development guide for Claude Code instances

## Project Structure

```
temp-flow-engine/
├── src/
│   ├── models/                   # Data models and types
│   │   ├── types.ts                       # Generated types from OpenAPI
│   │   ├── flow/                          # Flow-related models
│   │   │   ├── conversational-flow.ts
│   │   │   ├── conversational-flow-version.ts
│   │   │   ├── conversational-flow-task.ts
│   │   │   ├── transition.ts
│   │   │   ├── variable.ts
│   │   │   └── index.ts
│   │   ├── memory/                        # Memory-related models
│   │   │   ├── memory-variable.ts
│   │   │   ├── previous-contact.ts
│   │   │   └── index.ts
│   │   └── index.ts                       # Central export
│   │
│   ├── fsm/                      # FSM logic (ex-core)
│   │   ├── compiler.ts                    # Compiles ConversationalFlowVersion → XState
│   │   │                                  # (includes guards and actions)
│   │   ├── runner.ts                      # ConversationalFlowRunner - FSM runtime
│   │   ├── types.ts                       # FSMContext, FSMEvent types
│   │   └── index.ts
│   │
│   ├── services/                 # Business logic services
│   │   ├── memory-manager.ts              # Redis memory management
│   │   ├── flow-service.ts                # Flow CRUD operations
│   │   ├── prompt-renderer.ts             # Prompt rendering (Tournament)
│   │   ├── variable-extractor.ts          # Auto variable extraction
│   │   └── checkpoint-evaluator.ts        # Checkpoint evaluation
│   │
│   ├── api/                      # REST API endpoints (Arrest)
│   │   ├── fsm/                           # Flow management API (UI)
│   │   │   ├── index.ts                  # Router
│   │   │   ├── routes.ts                 # Route definitions
│   │   │   ├── handlers.ts               # Request handlers
│   │   │   └── validators.ts             # Input validation
│   │   ├── agents/                        # Agent-facing API
│   │   │   ├── index.ts                  # Router
│   │   │   ├── routes.ts                 # /handle-new-contact, /change-task
│   │   │   ├── handlers.ts
│   │   │   └── validators.ts
│   │   ├── memory/                        # Memory API
│   │   │   ├── index.ts                  # Router
│   │   │   ├── routes.ts                 # GET/PUT /memory/:conversation_id
│   │   │   ├── handlers.ts
│   │   │   └── validators.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── error-handler.ts
│   │   ├── schemas/
│   │   │   └── openapi.json              # OpenAPI 3.1.0 specification
│   │   └── index.ts                       # Main API setup
│   │
│   ├── workers/                  # Background workers
│   │   ├── variable-extraction-worker.ts
│   │   └── conversation-cleanup-worker.ts
│   │
│   ├── utils/                    # Utilities
│   │   ├── redis-client.ts
│   │   ├── mongodb-client.ts
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   └── date-helpers.ts
│   │
│   ├── config/                   # Configuration
│   │   ├── environment.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   │
│   ├── schemas/                  # Generated types
│   │   └── generated/
│   │       └── index.ts          # Auto-generated from openapi-typescript
│   │
│   └── index.ts                  # Entry point
│
├── tests/                        # Test suite
│   ├── unit/
│   │   ├── fsm/
│   │   ├── services/
│   │   └── models/
│   ├── integration/
│   │   └── api/
│   └── fixtures/
│       ├── conversational-flows/
│       └── memory/
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── FLOW-ENGINE.md
│   └── CLAUDE.md
│
├── system-prompts/               # Versioned system prompts
│   ├── v1/
│   │   ├── it-IT/
│   │   ├── en-US/
│   │   └── es-ES/
│   └── default/
│
├── scripts/                      # Utility scripts
│   ├── generate-types.ts
│   ├── seed-db.ts
│   └── migrate.ts
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Technology Stack

### Core Libraries
- **XState v5** - Finite State Machine implementation
- **Arrest** - REST API framework with OpenAPI 3.1.0 support (modified)
- **openapi-typescript** - Type generation from OpenAPI schema
- **TypeScript 5.x** - Language and type system

### Infrastructure (Planned)
- **Redis** - In-memory state and variable storage
- **MongoDB** - Persistent flow configurations
- **Tournament (n8n)** - Template rendering engine

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
npm install
```

### Commands

```bash
# Type check
npm run type-check

# Generate types from OpenAPI schema
npm run generate:types

# Build (not yet implemented)
npm run build

# Run tests (not yet implemented)
npm test

# Start server (not yet implemented)
npm start
```

## Core Concepts

### Type System

All types are generated from the OpenAPI 3.1.0 schema defined in [src/api/schemas/openapi.json](src/api/schemas/openapi.json):

1. **openapi-typescript** generates raw types in [src/schemas/generated/index.ts](src/schemas/generated/index.ts)
2. **models/** wraps generated types with type guards, validators, and helper functions

### Task Types

Three types of conversational tasks:

- **AIO** (AI-Only): Fully automated AI interaction
- **AIS** (AI-Supervised): AI with human monitoring capability
- **HUM** (Human): Direct human agent interaction

Tasks requiring routing (AIS/HUM) must include `routingParameters` (enforced via OpenAPI 3.1 if/then/else).

### Variables

- **Primitive**: string, number, boolean, enum
- **Complex Predefined**: date (ISO 8601), phone (E164 format)
- **Custom**: Arbitrary objects (not auto-extracted by AI)

All non-custom variables require a `prompt` field (enforced via schema).

### FSM Compilation

`ConversationalFlowVersion` → `FSMCompiler` → XState machine:

```typescript
const compiler = new FSMCompiler(conversationalFlowVersion);
const machine = compiler.compile();
const actor = createActor(machine);
```

### ConversationalFlowRunner

Main orchestrator with public XState actor access:

```typescript
const runner = new ConversationalFlowRunner(contactId, conversationId, flowVersionId);
runner.compileFsm();

// Access all XState methods directly
runner.actor.start();
runner.actor.send({ type: 'TASK_NAME' });
runner.actor.subscribe(state => console.log(state));

// Domain-specific helpers
runner.changeTask('newTaskName');
const agentData = runner.getAgentData();
```

## OpenAPI 3.1.0 Support

The project uses **OpenAPI 3.1.0** with conditional validation (`if/then/else`).

### Arrest Framework Modification

Arrest v14.0.1 defaults to OpenAPI 3.0.2. To enable 3.1.0 support:

1. Edit `node_modules/arrest/dist/defaults.js`
2. Change `openapi: '3.0.2'` to `openapi: '3.1.0'`

This enables JSON Schema draft-07 features like `if/then/else` for conditional validation.

## Type Generation Workflow

```bash
# 1. Edit OpenAPI schema
vim src/api/schemas/openapi.json

# 2. Regenerate TypeScript types
npm run generate:types

# 3. Type check
npm run type-check
```

Types in `src/models/` automatically use the regenerated schema types.

## API Endpoints (Planned)

### Agent API
- `POST /handle-new-contact` - Initialize new conversation
- `POST /change-task` - Transition to different task
- `POST /handle-end-contact` - End conversation
- `GET /prompt/:conversation_id` - Get rendered prompt

### Flow Management API
- `GET /flows` - List all flows
- `POST /flows` - Create new flow
- `GET /flows/:id/versions` - List flow versions
- `POST /flows/:id/versions` - Create new version

### Memory API
- `GET /memory/:conversation_id` - Get conversation memory
- `PUT /memory/:conversation_id` - Update variables

## Contributing

See [CLAUDE.md](CLAUDE.md) for development guidelines when using Claude Code.

## License

ISC
