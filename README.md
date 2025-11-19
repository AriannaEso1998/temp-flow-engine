# Flow Engine

TypeScript-based conversational flow management system using XState for Finite State Machines (FSM).

## Project Status

**Current Phase**: FSM Core Implementation (MVP)

Focus: Building foundational state machine logic without external dependencies (no API, database, or Redis integration yet).

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Complete system architecture and future scope
- [FLOW-ENGINE.md](docs/FLOW-ENGINE.md) - Detailed specifications and API schemas
- [CLAUDE.md](CLAUDE.md) - Development guide for Claude Code instances

## Project Structure

```
temp-flow-engine/
├── src/
│   ├── models/               # TypeScript type definitions
│   │   ├── types.ts
│   │   └── index.ts
│   ├── schemas/             # Example flow configurations
│   │   ├── generated/
│   │   │    └── index.ts
│   │   └── raw/
│   │       └── flow.schema.json
├── tests/
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
└── docs/                     # Documentation
```

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
# Build (not yet implemented)
npm run build

# Run tests (not yet implemented)
npm test

# Type check (not yet implemented)
npm run type-check
```

## Core Concepts

### Tasks as States

Three task types:
- **AIO**: AI-Only automated interaction
- **AIS**: AI-Supervised with human monitoring
- **HUM**: Human agent handles interaction

### Transitions

- Tasks connect via `connectedTasks` array
- Guards validate required parameters
- Failed validation blocks transition

### Variables

- **Primitive**: string, number, boolean, enum
- **Complex**: date, phone
- **Custom**: Objects (not auto-extracted)

## Examples

See `src/examples/` for:
- `simple-flow.ts`: Basic 3-task flow
- `complex-flow.ts`: Flow with human transfer

## License

ISC
