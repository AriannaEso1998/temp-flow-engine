# Claude Code Development Guide

Guida completa per Claude Code che lavora sul progetto **Flow Engine**.

## Panoramica Progetto

Flow Engine è un sistema TypeScript per gestire conversational flow basati su **Finite State Machines (FSM)** implementate con XState v5. Il sistema supporta interazioni multi-canale (telefono, WhatsApp, SMS, email, chat) con integrazione AI.

### Documenti di Riferimento

Prima di iniziare, leggi:
1. **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Architettura completa del sistema
2. **[FLOW-ENGINE.md](docs/FLOW-ENGINE.md)** - Specifica OpenAPI 3.1.0 e business logic
3. **[README.md](README.md)** - Quick start e setup

## Principi Fondamentali

### 1. Single Source of Truth: OpenAPI Schema

**TUTTO** parte dallo schema OpenAPI 3.1.0 in `src/api/schemas/openapi.json`:

```
OpenAPI Schema (openapi.json)
    ↓ npm run generate:types
Generated Types (src/schemas/generated/index.ts)
    ↓ import & wrap
Models (src/models/*.ts)
    ↓ use in
Core Logic & API
```

**Regola**: Se modifichi un tipo, modifica **prima** lo schema OpenAPI, poi rigenera i types.

### 2. Type System

#### Gerarchia dei Types

```typescript
// ❌ MAI importare direttamente da generated/
import { ConversationalFlowVersion } from '../schemas/generated';

// ✅ SEMPRE importare da models/
import { ConversationalFlowVersion, isTaskHUM, validateTask } from '../models';
```

#### Type Guards obbligatori

Per discriminare union types, usa sempre type guards:

```typescript
// ✅ Corretto
if (isTaskHUM(task)) {
  // TypeScript sa che task.routingParameters esiste
  console.log(task.routingParameters.timeout);
}

// ❌ Errato - Type error
console.log(task.routingParameters); // Property doesn't exist on union
```

Type guards disponibili:
- `isTaskAIO(task)`, `isTaskAIS(task)`, `isTaskHUM(task)`
- `requiresRouting(task)` - true per AIS e HUM
- `isDraft(version)`, `isComplete(version)`
- `isEnumVariable(variable)`, `isCustomVariable(variable)`

### 3. Composizione over Inheritance

`ConversationalFlowRunner` **NON** estende `Actor` di XState. Espone `actor` pubblicamente:

```typescript
// ✅ Corretto - accesso diretto a XState
runner.actor.start();
runner.actor.send({ type: 'TASK_NAME' });
runner.actor.subscribe(state => console.log(state));

// ❌ Errato - non wrappare metodi XState
class ConversationalFlowRunner {
  start() { this.actor.start(); } // NO!
  send(event) { this.actor.send(event); } // NO!
}
```

**Razionale**: Permette accesso completo alle API XState senza dover wrappare ogni metodo.

## Workflow di Sviluppo

### Modifica dello Schema

1. **Modifica lo schema OpenAPI**:
   ```bash
   vim src/api/schemas/openapi.json
   ```

2. **Rigenera i types**:
   ```bash
   npm run generate:types
   ```

3. **Verifica la compilazione**:
   ```bash
   npm run type-check
   ```

4. **Aggiorna i models se necessario**:
   - Se aggiungi campi obbligatori, aggiorna validators
   - Se aggiungi union types, crea type guards

### Test del Codice

Prima di committare:
```bash
# Type check
npm run type-check

# Unit tests (quando implementati)
npm test

# Build (quando implementato)
npm run build
```

## Convenzioni di Codice

### Naming

- **Interfaces**: PascalCase (`FlowContext`, `AgentData`)
- **Types**: PascalCase (`ConversationalFlowVersion`, `TaskAIO`)
- **Functions**: camelCase (`compileFsm`, `changeTask`)
- **Type guards**: `is` prefix (`isTaskHUM`, `isDraft`)
- **Validators**: `validate` prefix (`validateTask`, `validateVariable`)

### File Organization

```typescript
// File: src/models/variable.ts

// 1. Imports
import type { Variable as GeneratedVariable, VariableType } from "./types.js";

// 2. Type re-exports
export type Variable = GeneratedVariable;
export type { VariableType };

// 3. Type guards
export function isEnumVariable(variable: Variable): variable is Variable & { type: "enum" } {
  return variable.type === "enum";
}

// 4. Validators
export function validateVariable(variable: Variable): { valid: boolean; errors: string[] } {
  // Implementation
}

// 5. Helper functions
export function getVariableIds(variables: Variable[]): string[] {
  return variables.map(v => v._id);
}
```

### Error Handling

```typescript
// ✅ Corretto - errori descrittivi
if (version.draft === true) {
  throw new Error("Cannot compile FSM from draft ConversationalFlowVersion");
}

// ❌ Errato - errori generici
throw new Error("Invalid");
```

### Nullability

Usa TypeScript strict mode rules:

```typescript
// ✅ Corretto - null check esplicito
if (!this.config) {
  throw new Error("Config not loaded");
}
const machine = compiler.compile();

// ✅ Corretto - non-null assertion quando garantito
states[task._id] = {
  initial: this.version.firstTask!, // Non-draft garantisce firstTask exists
};

// ❌ Errato - accesso senza check
const machine = new FSMCompiler(this.config).compile();
```

## XState v5 Specifics

### Differenze rispetto a v4

```typescript
// v4 (deprecated)
import { Machine } from 'xstate';
const machine = Machine({ /* ... */ });

// v5 (corrente)
import { createMachine, createActor } from 'xstate';
const machine = createMachine({ /* ... */ });
const actor = createActor(machine);
actor.start();
```

### Context Initialization

```typescript
// ✅ Corretto - funzione con input
context: ({ input }: any) => ({
  conversationId: input?.conversationId || "",
  contactId: input?.contactId || "",
}),

// ❌ Errato - oggetto statico
context: {
  conversationId: "", // Non può leggere input
}
```

### Actor Types

```typescript
// Per flessibilità (corrente)
public actor!: AnyActorRef;

// Per type safety (futuro)
public actor!: Actor<
  { value: string; context: FlowContext },
  { type: string }
>;
```

## Arrest & OpenAPI 3.1.0

### Modifica Obbligatoria

Arrest v14.0.1 di default genera OpenAPI 3.0.2. Per supportare 3.1.0:

**File**: `node_modules/arrest/dist/defaults.js`
```javascript
// Cambia da:
openapi: '3.0.2',

// A:
openapi: '3.1.0',
```

**Nota**: Questa modifica va persa con `npm install`. Considera di documentarla nel setup.

### Operation Definition

```typescript
// ✅ Corretto - opts nel 5° parametro
class MyOperation extends Operation {
  constructor(resource) {
    super(resource, '/path', 'post', 'operationId', {
      summary: 'Operation summary',
      requestBody: { /* ... */ },
      responses: { /* ... */ }
    });
  }

  // Override per passare opts a Arrest
  getCustomInfo(opts) {
    return opts || {};
  }
}
```

## Pattern Comuni

### 1. Caricamento e Compilazione Flow

```typescript
async function initializeFlow(flowVersionId: string) {
  // 1. Fetch from database
  const version = await fetchFlowVersion(flowVersionId);

  // 2. Validate
  const { valid, errors } = validateConversationalFlowVersion(version);
  if (!valid) {
    throw new Error(`Invalid flow: ${errors.join(', ')}`);
  }

  // 3. Create runner
  const runner = new ConversationalFlowRunner(
    contactId,
    conversationId,
    flowVersionId
  );

  // 4. Set config (private)
  runner['config'] = version; // O metodo pubblico se creato

  // 5. Compile FSM
  runner.compileFsm();

  // 6. Start actor
  runner.actor.start();

  return runner;
}
```

### 2. Task Transition

```typescript
function transitionToTask(runner: ConversationalFlowRunner, taskName: string) {
  // 1. Validate task exists
  const task = runner.fsm.tasks!.find(t => t._id === taskName);
  if (!task) {
    throw new Error(`Task ${taskName} not found`);
  }

  // 2. Check if transition is allowed
  const currentSnapshot = runner.actor.getSnapshot();
  const currentTask = currentSnapshot.context.currentTask;
  const currentTaskObj = runner.fsm.tasks!.find(t => t._id === currentTask);

  if (!currentTaskObj?.connectedTasks?.includes(taskName)) {
    throw new Error(`Transition from ${currentTask} to ${taskName} not allowed`);
  }

  // 3. Send event
  runner.actor.send({
    type: taskName,
    memoryParameters: runner.memoryParameters
  });

  // 4. Verify transition succeeded
  const newSnapshot = runner.actor.getSnapshot();
  return newSnapshot.context.currentTask === taskName;
}
```

### 3. Type Guard Usage

```typescript
function getTaskConfig(task: ConversationalFlowTask): TaskConfig {
  // Discriminare tipo di task
  if (isTaskHUM(task)) {
    return {
      requiresAgent: true,
      timeout: task.routingParameters.timeout,
      skills: task.routingParameters.agentSkills || []
    };
  }

  if (isTaskAIS(task)) {
    return {
      requiresAgent: true,
      aiAssisted: true,
      timeout: task.routingParameters.timeout
    };
  }

  // TaskAIO
  return {
    requiresAgent: false,
    fullyAutomated: true
  };
}
```

## Debugging

### Type Errors

```bash
# Controlla errori di tipo
npm run type-check

# Per vedere errori più dettagliati
npx tsc --noEmit --pretty false
```

### Schema Validation

```bash
# Verifica lo schema OpenAPI
npx @redocly/cli lint src/api/schemas/openapi.json

# Rigenera types da zero
rm -rf src/schemas/generated/
npm run generate:types
```

### XState Inspector

```typescript
import { inspect } from '@statelyai/inspect';

// In development
if (process.env.NODE_ENV === 'development') {
  inspect({
    iframe: false // Usa @statelyai/inspect browser extension
  });
}

const actor = createActor(machine, { inspect });
actor.start();
```

## Testing Guidelines

### Unit Tests

```typescript
// Test type guards
describe('isTaskHUM', () => {
  it('should return true for HUM tasks', () => {
    const task: ConversationalFlowTask = {
      _id: 'test',
      type: 'HUM',
      routingParameters: { timeout: 60 },
      // ... altri campi
    };
    expect(isTaskHUM(task)).toBe(true);
  });
});

// Test validators
describe('validateTask', () => {
  it('should validate HUM task requires routingParameters', () => {
    const task: any = {
      _id: 'test',
      type: 'HUM',
      // routingParameters mancanti
    };
    const { valid, errors } = validateTask(task);
    expect(valid).toBe(false);
    expect(errors).toContain('routingParameters required for HUM tasks');
  });
});
```

### Integration Tests

```typescript
describe('FSMCompiler', () => {
  it('should compile valid ConversationalFlowVersion', () => {
    const version: ConversationalFlowVersion = {
      // ... valid version
      draft: false
    };

    const compiler = new FSMCompiler(version);
    const machine = compiler.compile();

    expect(machine).toBeDefined();
    expect(machine.id).toBe('conversationalFlow');
  });

  it('should reject draft versions', () => {
    const version: ConversationalFlowVersion = {
      // ... version
      draft: true
    };

    expect(() => new FSMCompiler(version)).toThrow(
      'Cannot compile FSM from draft ConversationalFlowVersion'
    );
  });
});
```

## Checklist Pre-Commit

Prima di ogni commit:

- [ ] `npm run type-check` passa senza errori
- [ ] Tutti i TODO sono documentati con task ID o rimossi
- [ ] Le modifiche allo schema sono state propagate (`npm run generate:types`)
- [ ] I type guards sono stati creati per nuovi union types
- [ ] I validators sono stati aggiornati per nuovi campi obbligatori
- [ ] La documentazione è stata aggiornata (README, ARCHITECTURE, FLOW-ENGINE)
- [ ] Gli errori sono descrittivi e non generici
- [ ] Non ci sono import diretti da `schemas/generated/`

## Riferimenti Rapidi

### Commands

```bash
npm run type-check          # Verifica tipi TypeScript
npm run generate:types      # Rigenera da OpenAPI schema
npm run build              # Build (quando implementato)
npm test                   # Test suite (quando implementato)
```

### Directory Chiave

```
src/
├── api/schemas/openapi.json              # Schema OpenAPI 3.1.0 (source of truth)
├── schemas/generated/index.ts            # Types auto-generati
├── models/                               # Types + helpers + validators
│   ├── flow/                            # Flow-related models
│   └── memory/                          # Memory-related models
├── fsm/                                  # FSM logic (ex-core)
│   ├── compiler.ts                      # XState compiler (includes guards & actions)
│   ├── runner.ts                        # FSM lifecycle manager (ConversationalFlowRunner)
│   └── types.ts                         # FSMContext, FSMEvent types
├── services/                             # Business logic services
│   ├── memory-manager.ts                # Redis memory management
│   ├── flow-service.ts                  # Flow CRUD operations
│   └── prompt-renderer.ts               # Prompt rendering
├── api/                                  # REST API endpoints
│   ├── fsm/                             # Flow management API (UI)
│   ├── agents/                          # Agent-facing API
│   └── memory/                          # Memory API
```

### Imports Essenziali

```typescript
// Types e helpers
import {
  ConversationalFlowVersion,
  ConversationalFlowTask,
  TaskAIO, TaskAIS, TaskHUM,
  Variable,
  isTaskHUM, isTaskAIS, isTaskAIO,
  requiresRouting,
  validateTask,
  validateVariable,
  validateConversationalFlowVersion
} from '../models';

// XState
import { createMachine, createActor, type AnyActorRef } from 'xstate';

// FSM
import { FSMCompiler } from '../fsm/compiler';
import { ConversationalFlowRunner } from '../fsm/runner';
```

## Link Utili

- [XState v5 Documentation](https://stately.ai/docs)
- [OpenAPI 3.1.0 Specification](https://spec.openapis.org/oas/v3.1.0)
- [openapi-typescript](https://github.com/drwpow/openapi-typescript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Versione**: 1.0.0
**Ultima modifica**: 2025-01-20
**Autore**: Flow Engine Team
