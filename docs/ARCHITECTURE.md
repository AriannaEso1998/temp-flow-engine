# Architettura Flow Engine

## Panoramica del Progetto

Il **Flow Engine** è un sistema di gestione di conversational flow basato su **Macchine a Stati Finiti (FSM)** per gestire interazioni conversazionali multi-canale (telefono, WhatsApp, SMS, email, chat) con supporto AI.

Il progetto è sviluppato interamente in **TypeScript** e utilizza XState per l'implementazione della FSM, con API REST esposte tramite Arrest.

## Stack Tecnologico

### Linguaggio
- **TypeScript**: Linguaggio principale del progetto per garantire type safety e migliore manutenibilità

### Librerie Core

#### 1. XState
- **Scopo**: Gestione delle macchine a stati finiti (FSM)
- **Versione**: 5.x (latest)
- **Documentazione**: https://stately.ai/docs/quick-start
- **Utilizzo**:
  - Definizione dei task conversazionali come stati
  - Gestione delle transizioni tra task
  - Validazione dei parametri obbligatori per le transizioni
  - Persistenza e resume degli snapshot della FSM

#### 2. Arrest
- **Scopo**: Framework per esporre API REST
- **Utilizzo**:
  - Definizione degli endpoint REST basati su OpenAPI 3.1.0
  - Validazione automatica degli schemi JSON
  - Routing delle richieste
  - Middleware per autenticazione/autorizzazione

#### 3. Tournament (n8n)
- **Scopo**: Motore di template per rendering dinamico dei prompt
- **Repository**: https://github.com/n8n-io/tournament
- **Utilizzo**:
  - Rendering dei prompt con variabili dinamiche
  - Template delle descrizioni dei task
  - Supporto per espressioni tipo `{{ $vars.variableName }}`
  - Integrazione con CodeMirror per UI (futuro)

#### 4. Redis
- **Scopo**: Sistema di memoria in-memory per gestione stato conversazioni
- **Client**: ioredis o node-redis
- **Utilizzo**:
  - Memorizzazione variabili conversazionali
  - Gestione snapshot FSM
  - Cache dei dati tenant
  - Storage della history dei contatti precedenti (multi-contact)
  - TTL per pulizia automatica delle conversazioni

#### 5. MongoDB
- **Scopo**: Database persistente per configurazioni
- **Client**: mongodb driver nativo o Mongoose
- **Utilizzo**:
  - Storage dei Conversational Flow
  - Versioning dei flow
  - Configurazioni dei task
  - Preset audio/media
  - MCP Server definitions

## Architettura Generale

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend UI                          │
│                   (React + CodeMirror)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │ REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                 API Layer (Arrest)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Flow API    │  │ Memory API  │  │ Agents API  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │         
└───────────┬────────────────┬──────────────┬─────────────────┘
            │                │              │
┌───────────▼────────────────▼──────────────▼────────────────┐
│              Core Business Logic Layer                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │     ConversationalFlowRunner (XState Manager)      │    │
│  │  - FSM Compilation & Execution                     │    │
│  │  - Task Transitions                                │    │
│  │  - Prompt Rendering (Tournament)                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │          MemoryManager (Redis Client)              │    │
│  │  - Variables Storage (convMiner + tools)           │    │
│  │  - FSM Snapshot Persistence                        │    │
│  │  - Tenant Data Caching                             │    │
│  └────────────────────────────────────────────────────┘    │
└──────────┬────────────────────┬────────────────────────────┘
           │                    │
┌──────────▼────────┐   ┌───────▼──────────┐
│  MongoDB          │   │    Redis         │
│  - Flow Configs   │   │  - Runtime State │
│  - Versions       │   │  - Memory Data   │
│  - Tasks          │   │  - FSM Snapshots │
└───────────────────┘   └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Systems                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ AI Agents    │  │ MCP Servers  │  │  Core CTI    │       │
│  │ (Livekit)    │  │  (Tools)     │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Struttura delle Directory

```
temp-flow-engine/
├── src/
│   ├── api/                      # Endpoint REST (Arrest)
│   │   ├── agents/              # API per gli agent
│   │   │   ├── handle-new-contact.ts
│   │   │   ├── change-task.ts
│   │   │   ├── handle-end-contact.ts
│   │   │   └── get-prompt.ts
│   │   ├── flows/               # API per gestione flow
│   │   │   ├── create-flow.ts
│   │   │   ├── list-flows.ts
│   │   │   ├── update-flow.ts
│   │   │   └── versions/
│   │   │       ├── create-version.ts
│   │   │       ├── list-versions.ts
│   │   │       └── get-version.ts
│   │   ├── memory/              # API per gestione memoria
│   │   │   ├── get-memory.ts
│   │   │   └── update-memory.ts
│   │   └── schemas/             # Schema OpenAPI / Zod
│   │       └── openapi.json
│   │
│   ├── core/                     # Business Logic
│   │   ├── conversational-flow-runner.ts   # Classe principale FSM
│   │   ├── memory-manager.ts               # Gestione memoria Redis
│   │   ├── fsm-compiler.ts                 # Compilazione XState machine
│   │   └── prompt-renderer.ts              # Rendering prompt con Tournament
│   │
│   ├── models/                   # Type definitions e modelli
│   │   ├── conversational-flow.ts
│   │   ├── task.ts
│   │   ├── variable.ts
│   │   ├── memory.ts
│   │   └── agent-data.ts
│   │
│   ├── services/                 # Servizi esterni
│   │   ├── mongodb/
│   │   │   ├── connection.ts
│   │   │   ├── flow-repository.ts
│   │   │   └── version-repository.ts
│   │   ├── redis/
│   │   │   ├── connection.ts
│   │   │   └── client.ts
│   │   ├── llm/                 # Integrazione LLM providers
│   │   │   ├── openai.ts
│   │   │   ├── azure.ts
│   │   │   ├── google.ts
│   │   │   └── groq.ts
│   │   └── mcp/                 # MCP clients
│   │       └── mcp-client.ts
│   │
│   ├── workers/                  # Background jobs
│   │   ├── variable-extraction-worker.ts
│   │   └── contact-summary-worker.ts
│   │
│   ├── utils/                    # Utilities
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   └── date-helpers.ts
│   │
│   ├── config/                   # Configurazioni
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── environment.ts
│   │
│   └── index.ts                  # Entry point
│
├── tests/                        # Test suite
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                         # Documentazione
│   ├── FLOW-ENGINE.md
│   ├── ARCHITECTURE.md
│   └── api/
│
├── system-prompts/               # Prompt di sistema versionati
│   ├── v1/
│   │   ├── it-IT/
│   │   ├── en-US/
│   │   └── es-ES/
│   └── v2/
│
├── mcp-servers/                  # Definizione MCP server di default
│   └── v1/
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Componenti Principali

### 1. ConversationalFlowRunner

**File**: `src/core/conversational-flow-runner.ts`

**Responsabilità**:
- Gestione del ciclo di vita della FSM (XState)
- Compilazione della macchina a stati da configurazione MongoDB
- Gestione delle transizioni tra task
- Validazione parametri obbligatori
- Salvataggio e resume degli snapshot
- Rendering dei prompt per gli agent

**Metodi principali**:
```typescript
class ConversationalFlowRunner {
  conversationId: string;
  contactId: string;
  conversationalFlowVersionId: string;
  memoryParameters: string[];
  fsm: ConversationalFlowVersion;
  errorValidationMessage: string;

  static resume(conversationId: string): ConversationalFlowRunner | null;
  compileFsm(): void;
  changeTask(taskName: string): boolean;
  setTaskValidationError(message: string): void;
  getTaskValidationError(): string;
  hasTaskValidationError(): boolean;
  getAgentData(): AgentData;
  start(): void;
  save(): void;
}
```

### 2. MemoryManager

**File**: `src/core/memory-manager.ts`

**Responsabilità**:
- Interfaccia con Redis per memorizzazione dati conversazione
- Gestione delle variabili estratte da AI (convMiner) e tools
- Merge automatico delle variabili con priorità ai tools
- Gestione TTL delle conversazioni
- Storage snapshot FSM
- History dei contatti precedenti (multi-contact)

**Struttura memoria Redis**:
```
conversation_id::tenant          => { tenantData }
conversation_id::vars::convMiner => { varId: MemoryVariable }
conversation_id::vars::tools     => { varId: MemoryVariable }
conversation_id::fsm_snapshot    => { snapshot, compiledMachine }
conversation_id::previousContacts => [PreviousContact]
```

**Metodi principali**:
```typescript
class MemoryManager {
  constructor(conversationId: string, expiration?: number);

  init(ttl: number, tenantData: object, varIds: string[]): Promise<void>;
  getTenantData(): Promise<object>;

  setVars(updatedBy: string, vars: MemoryVariable[]): Promise<void>;
  getVars(keys?: string[]): Promise<MemoryVariable[]>;

  addPreviousContact(contact: PreviousContact): Promise<void>;
  getContactsHistory(): Promise<PreviousContact[]>;

  setFSMSnapshot(snapshot: object): Promise<void>;
  getFSMSnapshot(): Promise<object | null>;
}
```

### 3. Prompt Renderer

**File**: `src/core/prompt-renderer.ts`

**Responsabilità**:
- Rendering dei template usando Tournament (n8n)
- Sostituzione variabili `{{ $vars.variableName }}`
- Composizione prompt globale + task prompt + memoria
- Formattazione memoria come tabella Markdown
- Aggiunta metadati (data/ora, canale, contatti precedenti)

**Formato output memoria**:
```markdown
|var|property|value|
|-|-|-|
|data||10 ottobre|
|prestazione|Id|SSSS|
|prestazione|Tipo|TTTT|
```

## Flussi Principali

### 1. Gestione Nuovo Contatto

```
Agent → POST /handle-new-contact
  ↓
ConversationalFlowRunner::resume()
  → MemoryManager::getFSMSnapshot() [null]
  ↓
ConversationalFlowRunner::init()
  → Fetch ConversationalFlowVersion da MongoDB
  → compileFsm() con XState
  → MemoryManager::init() con variabili vuote
  ↓
start() → createMachine() → createActor() → actor.start()
  ↓
getDataForAgent()
  → getSnapshot()
  → MemoryManager::getVars()
  → renderPrompt()
  ↓
save() → MemoryManager::setFSMSnapshot()
  ↓
← Return AgentData (prompt, llmConfig, channelConfig, mcpServers)
```

### 2. Cambio Task

```
Agent → POST /change-task {taskName}
  ↓
ConversationalFlowRunner::resume()
  → MemoryManager::getFSMSnapshot()
  → Restore actor con snapshot
  ↓
changeTask(taskName)
  → MemoryManager::getVars()
  → actor.send({type: taskName, memoryParameters})
  → Validazione parametri obbligatori (guards)
  → Se valido: transizione a nuovo stato
  → Se invalido: setTaskValidationError()
  ↓
getDataForAgent()
  → renderPrompt() con nuovo task
  ↓
save() → MemoryManager::setFSMSnapshot()
  ↓
← Return AgentData | Error
```

### 3. Chiamata Tool MCP

```
Agent → GET /prompt/:conv_id
  ↓
← Return prompt con memoria
  ↓
Agent → LLM con prompt
  ↓
LLM → CALL TOOL "mcp-tool"
  ↓
Agent → GET /memory/:conv_id
  ↓
Agent → MCP Server Tool(memoryData, llmToolData)
  ↓
MCP Tool → PUT /memory/:conv_id con updatedMemoryData
  ↓
MCP Tool → Return toolResponse
  ↓
Agent → LLM con toolResponse
  ↓
LLM → Continue generation
```

## Gestione Variabili

### Tipi di Variabili

**Primitivi**:
- `string`, `number`, `boolean`, `enum`

**Complessi Predefiniti**:
- `date`: ISO 8601 TZ UTC
- `phone`: { country, land/mobile, E164 }

**Custom**:
- Oggetti complessi arbitrari
- Non estratti automaticamente da AI
- Scritti solo tramite MCP tools

### Estrazione Automatica

**Worker**: `src/workers/variable-extraction-worker.ts`

**Processo**:
1. Agent invia utterance a Flow Engine (o Flow ascolta eventi CTI)
2. Background worker con timeout configurable
3. Estrazione solo per variabili non-custom
4. Prompt include: ultimi messaggi + prompt variabili
5. Se già scritto da tool: skip (no sovrascrittura)
6. Salvataggio in `conversation_id::vars::convMiner`

## API REST Esposte

### UI API

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/flows` | GET | Lista conversational flows con tags |
| `/flows` | POST | Crea nuovo conversational flow |
| `/flows/:id` | PATCH | Aggiorna nome flow |
| `/flows/:id/versions` | GET | Lista versioni (con filtro per tagged) |
| `/flows/:id/versions/:vid` | GET | Dettaglio versione specifica |
| `/flows/:id/versions` | POST | Crea nuova versione |

### Agents API

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/handle-new-contact` | POST | Avvio nuovo contatto |
| `/change-task` | POST | Cambio task FSM |
| `/handle-end-contact` | POST | Fine contatto e cleanup |
| `/prompt/:conv_id` | GET | Ottieni prompt renderizzato con memoria |

### Memory API

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/memory/:conversation_id` | GET | Ottieni memoria completa |
| `/memory/:conversation_id` | PUT | Aggiorna variabili memoria |

## Configurazione e Deploy

### Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/flow-engine
REDIS_URL=redis://localhost:6379

# API
PORT=3000
API_VERSION=v1

# LLM Providers
OPENAI_API_KEY=sk-...
AZURE_OPENAI_ENDPOINT=https://...
GOOGLE_API_KEY=...
GROQ_API_KEY=...

# STT/TTS
GOOGLE_CLOUD_PROJECT=...
DEEPGRAM_API_KEY=...
ELEVENLABS_API_KEY=...

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Workers
VARIABLE_EXTRACTION_TIMEOUT=5000
VARIABLE_EXTRACTION_CONCURRENCY=10
```

### Docker Compose

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  flow-engine:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
      - redis
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/flow-engine
      - REDIS_URL=redis://redis:6379
```

## Testing Strategy

### Unit Tests
- Logica FSM (XState transitions)
- MemoryManager operations
- Prompt rendering
- Validation logic

### Integration Tests
- API endpoints con database mock
- FSM lifecycle completo
- Memory persistence e recovery

### E2E Tests
- Flussi conversazionali completi
- Multi-contact scenarios
- Tool calling e memory updates

**Framework**: Jest + Supertest

## Sicurezza

### Considerazioni
- Validazione rigorosa input (Zod)
- Sanitizzazione prompt templates
- Rate limiting su API
- Authentication/Authorization (JWT)
- Encryption dati sensibili in MongoDB
- TTL automatico Redis per privacy
- Audit logging completo

## Performance

### Ottimizzazioni
- Connection pooling (MongoDB, Redis)
- Caching configurazioni flow in memoria
- Lazy loading XState machines
- Queue processing per variable extraction
- Compression su snapshot FSM pesanti
- Index MongoDB su campi query frequenti

## Versioning

### Schema Version
- Ogni ConversationalFlowVersion ha `schemaVersion` (semver)
- Breaking changes = nuovo major version
- System prompts versionati per API version (`/system-prompts/v1/`, `/v2/`)
- MCP servers versionati (`/mcp-servers/v1/`)

### Backward Compatibility
- Modifiche retrocompatibili: solo redeploy container
- Breaking changes: richiede update `apiVersion` nei flow esistenti

## Monitoring e Observability

### Metrics
- FSM transition latency
- Memory operations timing
- API response times
- Variable extraction success rate
- Tool call success/failure rate

### Logging
- Structured JSON logs (Winston/Pino)
- Trace ID per ogni conversazione
- Full audit trail: transitions, memory updates, API calls

### Tools
- Prometheus per metrics
- Grafana per dashboards
- ELK/Loki per log aggregation
- OpenTelemetry per distributed tracing

## Dipendenze NPM Principali

```json
{
  "dependencies": {
    "xstate": "^5.x.x",
    "arrest": "latest",
    "@n8n/tournament": "latest",
    "ioredis": "^5.x.x",
    "mongodb": "^6.x.x",
    "zod": "^3.x.x",
    "winston": "^3.x.x",
    "bull": "^4.x.x",
    "openai": "^4.x.x",
    "@anthropic-ai/sdk": "^0.x.x",
    "@google-cloud/speech": "^6.x.x",
    "@google-cloud/text-to-speech": "^5.x.x",
    "express": "^4.x.x",
    "dotenv": "^16.x.x"
  },
  "devDependencies": {
    "typescript": "^5.x.x",
    "@types/node": "^20.x.x",
    "jest": "^29.x.x",
    "@types/jest": "^29.x.x",
    "ts-jest": "^29.x.x",
    "supertest": "^6.x.x",
    "eslint": "^8.x.x",
    "prettier": "^3.x.x"
  }
}
```

## Roadmap

### Phase 1: Core (MVP)
- [x] Definizione architettura
- [ ] Setup progetto TypeScript
- [ ] Implementazione ConversationalFlowRunner con XState
- [ ] Implementazione MemoryManager con Redis
- [ ] API Agents essenziali
- [ ] Prompt rendering basico

### Phase 2: API Complete
- [ ] API UI complete
- [ ] Memory API
- [ ] Variable extraction worker
- [ ] MCP client integration
- [ ] OpenAPI schema validation

### Phase 3: Production Ready
- [ ] Testing completo (unit + integration + e2e)
- [ ] Monitoring e logging
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Documentation completa

### Phase 4: Advanced Features
- [ ] Multi-language support avanzato
- [ ] Checkpoint system
- [ ] Deflection handling
- [ ] Advanced routing
- [ ] Analytics dashboard

## Riferimenti

- [XState Documentation](https://stately.ai/docs/quick-start)
- [Tournament (n8n)](https://github.com/n8n-io/tournament)
- [Arrest Framework](https://github.com/arrest-js/arrest) _(verificare repository corretto)_
- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [Model Context Protocol](https://modelcontextprotocol.io)

---

**Ultima modifica**: 2025-01-19
**Versione**: 1.0.0
**Autore**: Flow Engine Team