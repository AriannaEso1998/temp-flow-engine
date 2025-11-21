# Flow Engine

TypeScript-based conversational flow management system using XState for Finite State Machines (FSM).

## Project Status

**Current Phase**: Core Implementation (MVP)

### Completed
- ✅ TypeScript project setup with strict type checking
- ✅ OpenAPI 3.1.0 schema definition with conditional validation (if/then/else)
- ✅ Type generation from OpenAPI schema using openapi-typescript
- ✅ Complete type system with type guards and validators
- ✅ FSMCompiler with full XState machine compilation (transitions, guards, actions)
- ✅ ConversationalFlowRunner with public actor exposure
- ✅ Arrest framework configured for OpenAPI 3.1.0 support
- ✅ Comprehensive test suite for FSMCompiler (12 test cases, 100% passing)

### In Progress
- 🔨 API endpoint implementations

### Planned
- 📋 Redis integration for memory management
- 📋 MongoDB integration for flow storage
- 📋 Complete API implementation
- 📋 Additional test coverage for services and API endpoints

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Complete system architecture and technical details
- [FLOW-ENGINE.md](docs/FLOW-ENGINE.md) - OpenAPI schema specifications and business logic
- [CLAUDE.md](CLAUDE.md) - Development guide for Claude Code instances

## Project Structure

> **Note**: The project uses **Nested Versioning** strategy where versioning is organized by domain (api, services, fsm, models) rather than at the top level. This allows for granular evolution where different modules can be updated independently in v2 while sharing unchanged code from v1.

```
temp-flow-engine/
├── src/
│   ├── api/                      # REST API endpoints (Arrest)
│   │   ├── fsm/v1/                        # Flow management API (UI)
│   │   │   ├── index.ts
│   │   │   ├── routes.ts
│   │   │   ├── handlers.ts
│   │   │   └── validators.ts
│   │   ├── agents/v1/                     # Agent-facing API
│   │   │   ├── index.ts
│   │   │   ├── routes.ts                 # /handle-new-contact, /change-task
│   │   │   ├── handlers.ts
│   │   │   └── validators.ts
│   │   ├── memory/v1/                     # Memory API
│   │   │   ├── index.ts
│   │   │   ├── routes.ts                 # GET/PUT /memory/:conversation_id
│   │   │   ├── handlers.ts
│   │   │   └── validators.ts
│   │   ├── flows/v1/                      # Flow CRUD API
│   │   │   ├── index.ts
│   │   │   ├── routes.ts
│   │   │   └── handlers.ts
│   │   ├── middleware/                    # Shared middleware (version-agnostic)
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   ├── error-handler.ts
│   │   │   └── logger.ts
│   │   ├── index.ts
│   │   └── server.ts
│   │
│   ├── services/v1/              # Business logic services
│   │   ├── memory-manager.ts              # Redis memory management
│   │   ├── flow-service.ts                # Flow CRUD operations
│   │   ├── prompt-renderer.ts             # Prompt rendering
│   │   ├── variable-extractor.ts          # Auto variable extraction
│   │   ├── checkpoint-evaluator.ts        # Checkpoint evaluation
│   │   ├── mongodb/                       # MongoDB repositories
│   │   │   ├── connection.ts
│   │   │   ├── flow-repository.ts
│   │   │   └── version-repository.ts
│   │   ├── redis/                         # Redis services
│   │   │   ├── connection.ts
│   │   │   └── memory-manager.ts
│   │   └── index.ts
│   │
│   ├── fsm/v1/                   # FSM logic
│   │   ├── compiler.ts                    # Compiles ConversationalFlowVersion → XState
│   │   ├── runner.ts                      # ConversationalFlowRunner - FSM runtime
│   │   ├── types.ts                       # FSMContext, FSMEvent types
│   │   └── index.ts
│   │
│   ├── models/v1/                # Data models and types
│   │   ├── types.ts                       # Generated types from OpenAPI
│   │   ├── conversational-flow/
│   │   │   ├── conversational-flow-version.ts
│   │   │   └── conversational-flow-task.ts
│   │   ├── memory/
│   │   │   └── memory-variable.ts
│   │   ├── transition.ts
│   │   ├── variable.ts
│   │   └── index.ts
│   │
│   ├── schemas/v1/               # OpenAPI schemas and generated types
│   │   ├── openapi.json                   # OpenAPI 3.1.0 specification
│   │   ├── generated/
│   │   │   └── index.ts                  # Auto-generated from openapi-typescript
│   │   └── raw/
│   │       └── flow.schema.json
│   │
│   ├── shared/                   # Version-agnostic utilities
│   │   ├── config/
│   │   │   ├── environment.ts
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── prompt-loader.ts
│   │   │   └── index.ts
│   │   └── workers/
│   │       ├── variable-extraction-worker.ts
│   │       ├── contact-summary-worker.ts
│   │       └── index.ts
│   │
│   └── index.ts                  # Main entry point
│
├── tests/                        # Test suite
│   ├── fsm/
│   │   └── compiler.test.ts             # FSMCompiler tests (12 test cases)
│   ├── services/                        # Service tests (planned)
│   ├── models/                          # Model tests (planned)
│   ├── integration/                     # Integration tests (planned)
│   │   └── api/
│   ├── fixtures/                        # Test fixtures (planned)
│   │   ├── conversational-flows/
│   │   └── memory/
│   ├── README.md
│   └── vitest.config.ts
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
├── scripts/
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

# Run tests
npm test                    # Run all tests once
npm run test:watch          # Run tests in watch mode
npm run test:ui             # Run tests with UI
npm run test:coverage       # Run tests with coverage report

# Build (not yet implemented)
npm run build

# Start server (not yet implemented)
npm start
```

## Core Concepts

### Type System

All types are generated from the OpenAPI 3.1.0 schema defined in [src/schemas/v1/openapi.json](src/schemas/v1/openapi.json):

1. **openapi-typescript** generates raw types in [src/schemas/v1/generated/index.ts](src/schemas/v1/generated/index.ts)
2. **models/v1/** wraps generated types with type guards, validators, and helper functions

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

## Testing

The project uses **Vitest** as the test framework, configured for ESM module support.

### Test Suite

#### FSMCompiler Tests ([tests/fsm/compiler.test.ts](tests/fsm/compiler.test.ts))

Comprehensive test suite with **12 test cases** covering:

1. **Constructor Validation**
   - Rejects draft versions
   - Accepts published versions

2. **FSM Compilation**
   - Validates firstTask existence
   - Compiles single-task flows
   - Compiles multi-task flows with transitions
   - Generates correct state metadata (taskId, type, prompt, mcpToolSelection)
   - Handles type-specific metadata (hideTranscriptionToHuman for AIO, routingParameters for HUM/AIS)

3. **Guard Validation**
   - Allows transitions when all required `transitionParameters` are present in `memoryParameters`
   - Blocks transitions when required parameters are missing
   - Allows transitions when optional parameters are missing

4. **Context Updates**
   - Updates `currentTask` on state transitions
   - Preserves initial context during machine initialization

5. **Error Handling**
   - Throws errors for missing tasks referenced in `connectedTasks`

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

All tests currently passing: **12/12 ✅**

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
vim src/schemas/v1/openapi.json

# 2. Regenerate TypeScript types
npm run generate:types

# 3. Type check
npm run type-check
```

Types in `src/models/v1/` automatically use the regenerated schema types.

## Versioning Strategy

The project uses **Nested Versioning** for future-proof evolution:

### Structure
- Version folders (`v1/`, `v2/`) are nested within domain directories (`api/`, `services/`, `fsm/`, `models/`)
- Shared utilities and configuration live in `src/shared/` (version-agnostic)
- Each version can re-export unchanged code from previous versions

### Benefits
1. **Granular Evolution**: Update only the modules that change (e.g., `fsm/v2/` while keeping `services/v1/`)
2. **Zero Duplication**: Files that don't change can use simple re-exports: `export * from '../v1/file.js'`
3. **Clear Diffs**: Easy to see what changed between versions by comparing version folders
4. **Type Safety**: TypeScript ensures correct imports between versioned modules

### Example v2 Migration
When creating v2:
```typescript
// fsm/v2/compiler.ts - New implementation
export class FSMCompiler {
  // Breaking changes here
}

// services/v2/flow-service.ts - No changes
export * from '../v1/flow-service.js';  // Re-export v1

// api/fsm/v2/handlers.ts - Adapted for new compiler
import { FSMCompiler } from '../../../fsm/v2/compiler.js';
```

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
