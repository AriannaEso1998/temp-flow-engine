# Architettura Flow Engine

## 1. Panoramica Generale

Il **Flow Engine** è un sistema per la gestione di conversazioni multicanale basato su **macchine a stati finiti (FSM)** implementate con [XState](https://stately.ai/docs/quick-start). Il sistema permette di orchestrare interazioni conversazionali complesse con utenti attraverso diversi canali (telefono, WhatsApp, SMS, email, chat) utilizzando AI agents e operatori umani.

### 1.1 Principi Architetturali

- **State-Driven**: Le conversazioni sono gestite come macchine a stati finiti
- **Multi-tenant**: Supporto per più campagne e tenant
- **Multi-channel**: Supporto per diversi canali di comunicazione
- **Multi-contact**: Gestione di conversazioni che persistono attraverso più contatti
- **Template-Based**: Prompt e configurazioni dinamiche tramite template engine
- **Memory-Centric**: Sistema di memoria centralizzato per variabili e stato

---

## 2. Architettura ad Alto Livello

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend / UI                           │
│                   (React Flow / Visual Editor)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer (REST)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   UI APIs    │  │ Agents APIs  │  │ Memory APIs  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         ConversationalFlowRunner (XState FSM)              │ │
│  │  - Gestione stati conversazione                            │ │
│  │  - Transizioni tra task                                    │ │
│  │  - Validazione parametri                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Memory Manager (Redis)                        │ │
│  │  - Variabili conversazione                                 │ │
│  │  - Snapshot FSM                                            │ │
│  │  - Tenant data                                             │ │
│  │  - Storia contatti precedenti                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Template Engine (Tournament)                  │ │
│  │  - Rendering prompt dinamici                               │ │
│  │  - Interpolazione variabili                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Agents     │  │  MCP Tools   │  │  Core CTI    │
│              │  │              │  │              │
│ - Livekit    │  │ - External   │  │ - Routing    │
│ - Channel    │  │   Services   │  │ - Events     │
│   Agents     │  │ - Custom     │  │ - Recording  │
│              │  │   Tools      │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Storage Layer                            │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │   MongoDB    │         │    Redis     │                      │
│  │              │         │              │                      │
│  │ - Flows      │         │ - FSM State  │                      │
│  │ - Versions   │         │ - Variables  │                      │
│  │ - Campaigns  │         │ - Session    │                      │
│  │ - Configs    │         │   Data       │                      │
│  └──────────────┘         └──────────────┘                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     External Services                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │   LLM   │  │   STT   │  │   TTS   │  │   VAD   │             │
│  │Providers│  │Providers│  │Providers│  │Services │             │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘             │
│  OpenAI, Azure, Google, Groq, Deepgram, ElevenLabs, etc.        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Componenti Principali

### 3.1 ConversationalFlowRunner

**Responsabilità:**
- Gestione del ciclo di vita delle macchine a stati (FSM)
- Esecuzione delle transizioni tra task
- Validazione dei parametri richiesti per i task
- Persistenza e ripristino degli snapshot FSM
- Rendering dei prompt con dati dinamici

**Operazioni Principali:**
- `init()`: Inizializza una nuova FSM
- `resume()`: Ripristina una FSM da snapshot
- `start()`: Avvia l'actor XState
- `changeTask()`: Gestisce le transizioni tra task
- `getDataForAgent()`: Prepara i dati per gli agent
- `save()`: Persiste lo stato corrente

### 3.2 Memory Manager

**Responsabilità:**
- Gestione della memoria di conversazione in Redis
- Memorizzazione e recupero variabili
- Gestione snapshot FSM
- Merge tra variabili estratte da AI e da tool
- TTL e cleanup memoria

**Struttura Dati Redis:**

```
conversation_id::tenant
→ Dati tenant e campagna (scritti una volta all'inizio)

conversation_id::vars::convMiner
→ Hash con variabili estratte dall'AI Helper ConvMiner

conversation_id::vars::tools
→ Hash con variabili estratte dai tool MCP

conversation_id::previousContacts
→ Array di contatti precedenti (multicontatto)
```

**Formato Variabile:**
```json
{
  "updatedBy": "convMiner|toolName",
  "updatedAt": "ISO timestamp",
  "value": "any type",
  "contactId": "string",
  "descriptionForLLM": [
    {"name": "property", "value": "value"}
  ]
}
```

### 3.3 Template Engine

**Responsabilità:**
- Rendering dinamico dei prompt
- Interpolazione variabili da memoria
- Supporto sintassi Tournament (n8n)

**Utilizzo:**
```
Prompt template: "Per prenotare hai bisogno di {{ $vars.idPrestazione }}"
Output: "Per prenotare hai bisogno di memory->idPrestazione"
```

### 3.4 Agents (Livekit / Channel)

**Responsabilità:**
- Interfaccia con utenti sui vari canali
- Gestione connessioni LLM
- Configurazione STT/TTS per canali vocali
- Invio utterance al sistema di memoria
- Chiamata tool MCP
- Invio messaggi a Core CTI per reportistica

**Tipi di Agent:**
- **Livekit Agent**: Gestisce chiamate vocali in tempo reale
- **Channel Agent**: Gestisce canali testuali (WhatsApp, SMS, Chat, Email)

### 3.5 MCP Server Integration

**Responsabilità:**
- Esposizione di tool personalizzati agli agent
- Scrittura variabili custom in memoria
- Integrazione con servizi esterni

**Parametri Auto-Iniettati:**
- `tenantId`
- `conversationId`
- `contactId`

---

## 4. Gestione delle Variabili

### 4.1 Tipi di Variabili

**Tipi Primitivi:**
- `string`
- `number`
- `boolean`
- `enum`

**Tipi Complessi Predefiniti:**
- `date`: ISO TZ UTC
- `phone`: country, land/mobile, E164

**Tipi Custom:**
- Oggetti complessi
- Liste di oggetti
- Gestiti solo tramite tool MCP

### 4.2 Estrazione Automatica

Le variabili **non custom** vengono estratte automaticamente dall'AI Helper "ConvMiner" ad ogni utterance dell'utente:

1. Utterance ricevuta dall'agent
2. Processo di estrazione in background
3. Validazione e memorizzazione se valida
4. Non sovrascrive dati già scritti da tool

**Timeout**: Predefinito a livello di piattaforma per evitare migliaia di richieste

### 4.3 Rendering nel Prompt

Le variabili vengono renderizzate in formato tabella markdown:

```markdown
| var          | property     | value         |
|--------------|--------------|---------------|
| data         |              | 10 ottobre    |
| prestazione  | Id           | SSSS          |
| prestazione  | Tipo         | TTTT          |
```

Alternativa: formato [Toon](https://github.com/toon-format/toon)

---

## 5. Task e Transizioni

### 5.1 Tipi di Task

**AIO (AI Only)**
- Gestito completamente dall'AI
- Può nascondere trascrizioni agli operatori
- Nessun routing umano

**HUM (Human)**
- Gestito da operatori umani
- Richiede parametri di routing
- Supporta configurazione skill/agent specifici

**AIS (AI Supervised)**
- AI con supervisione umana
- Combina caratteristiche di AIO e HUM
- Operatore monitora ma non necessariamente interviene

### 5.2 Struttura delle Transizioni

#### Grafo delle Transizioni

La struttura del flow conversazionale è definita tramite:

**A livello ConversationalFlowVersion:**
- **firstTask**: ID del primo task da eseguire all'inizio della conversazione

**A livello ConversationalFlowTask:**
- **connectedTasks**: Array di task IDs a cui questo task può transitare
- **transitionParameters**: Variabili richieste per la transizione a questo task
  - `variableId`: ID della variabile
  - `required`: Boolean (obbligatoria o no)

**Esempio:**
```json
{
  "firstTask": "greeting",
  "tasks": [
    {
      "_id": "greeting",
      "name": "Greeting",
      "connectedTasks": ["collect-info", "cancellation"],
      "transitionParameters": []
    },
    {
      "_id": "collect-info",
      "name": "Collect Patient Info",
      "connectedTasks": ["select-datetime"],
      "transitionParameters": [
        {"variableId": "customerName", "required": true}
      ]
    },
    {
      "_id": "select-datetime",
      "name": "Select Date & Time",
      "connectedTasks": ["confirmation"],
      "transitionParameters": [
        {"variableId": "appointmentDate", "required": true},
        {"variableId": "appointmentTime", "required": true}
      ]
    }
  ]
}
```

**Regole:**
- Il FSM parte sempre da `firstTask`
- Un task può transitare SOLO ai task elencati nel proprio `connectedTasks`
- La transizione è validata tramite guards che controllano i `transitionParameters` richiesti dal task di destinazione

### 5.3 Validazione Transizioni

```typescript
guards: {
  isValid: ({ context, event }, params) => {
    // Controllo parametri obbligatori in event.memoryParameters
    // Se mancano: event.setTaskValidationError("Errore")
    return true;
  }
}
```

---

## 6. Configurazione Media

### 6.1 Audio Configuration

**Componenti:**
- **LLM Config**: Provider, model, temperature
- **STT Config**: Provider, streaming, hints, endpointing
- **TTS Config**: Provider, voice, speed (con supporto multi-lingua)
- **VAD Config**: Thresholds, silence detection

**Preset System:**
- Preset di default a livello piattaforma
- Override a livello di conversational flow
- Override a livello di task

### 6.2 Text Configuration

**Componenti:**
- **LLM Config**: Provider, model, temperature
- **Courtesy Messages**: Opzionale
- **Timeout**: Gestione no_utterance event

### 6.3 Courtesy Messages

**Provider:**
- **groq**: Genera messaggi contestuali con AI
- **random**: Sceglie da lista predefinita

**Configurazione:**
- `timeout`: Secondi prima del messaggio di cortesia
- `silenceAfterMessage`: Pausa dopo il messaggio

---

## 7. Sistema di Versioning

### 7.1 Struttura Versionamento

```
ConversationalFlow (record principale)
  ├─ _id
  ├─ name
  ├─ campaignId
  └─ versions[]
      ├─ ConversationalFlowVersion 1 (tag: "latest")
      ├─ ConversationalFlowVersion 2 (tag: "v1.0")
      └─ ConversationalFlowVersion 3 (draft: true)
```

### 7.2 Regole di Salvataggio

- **parentVersionId = null** o **parentVersionId = latest**: Aggiorna il tag "latest"
- **parentVersionId con tag**: Richiede nuovo tag per salvare
- **draft = true**: Versione non completa, campi opzionali

### 7.3 API Version

I prompt di sistema e gli MCP server di default sono organizzati per `apiVersion` (es: "v1", "v2").

**Modifiche retrocompatibili**: Aggiornamento container senza cambio apiVersion

**Modifiche non retrocompatibili**: Nuovo apiVersion + aggiornamento conversational flow

---

## 8. Gestione Multi-Contact

### 8.1 Closure Configuration

```json
{
  "multiContact": true,
  "conversationTimeLimit": 3600,
  "customHandler": "https://api.example.com/should-close"
}
```

**Se multiContact = false:**
- Conversazione chiusa al termine del contatto

**Se multiContact = true:**
- `conversationTimeLimit`: Durata massima assoluta (secondi)
- `customHandler`: Endpoint che decide se chiudere (true/false)

### 8.2 Storia Contatti Precedenti

```json
conversation_id::previousContacts => [
  {
    "date": "ISO timestamp",
    "channel": "phone|whatsapp|...",
    "resume": "Riassunto conversazione"
  }
]
```

Alla fine di ogni contatto viene generato un riassunto e memorizzato per i contatti successivi.

---

## 9. API Layer

### 9.1 UI APIs

**Gestione Flow:**
- `GET /flows`: Elenco flows con tag
- `POST /flows`: Crea nuovo flow
- `PATCH /flows/:id`: Aggiorna nome flow

**Gestione Versioni:**
- `GET /flows/:id/versions`: Elenco versioni
- `GET /flows/:id/versions/:vid`: Dettaglio versione
- `POST /flows/:id/versions`: Crea nuova versione

### 9.2 Agents APIs

**Lifecycle:**
- `POST /handle-new-contact`: Avvia/riprende FSM per nuovo contatto
- `POST /change-task`: Richiede cambio task
- `POST /handle-end-contact`: Gestisce termine contatto
- `GET /prompt/:conv_id`: Recupera prompt renderizzato

### 9.3 Memory APIs

**CRUD Memoria:**
- `PUT /memory/:conversation_id`: Salva variabili in memoria
- `GET /memory/:conv_id`: Recupera memoria completa

---

## 10. Flussi Principali

### 10.1 Nuovo Contatto

```
Agent → POST /handle-new-contact
  → ConversationalFlowRunner::resume(conversationId)
    → MemoryManager::getFSMSnapshot() → NULL
  → ConversationalFlowRunner::init()
    → Fetch ConversationalFlowVersion da MongoDB
    → compileFsm()
    → MemoryManager::init()
  → start()
    → createMachine()
    → createActor()
    → actor.start()
  → getDataForAgent()
    → renderPrompt(tenantData, variables)
  → save()
    → MemoryManager::setFSMSnapshot()
  ← Return agentData, llmConfig, channelConfigs
```

### 10.2 Messaggio e Tool Call

```
Agent → GET /prompt/conv_id
  → ConversationalFlowRunner::resume()
    → Restore from snapshot
  → getDataForAgent()
  ← Return agentData with rendered prompt

Agent → LLM: getResponse(userMessage, agentData)
  ← LLM: CALL TOOL "MCP-TOOL"

Agent → GET /memory/conv_id
  ← memoryData

Agent → MCP Tool(memoryData, llmToolData)
  Tool → PUT /memory/conv_id (updated data)
  ← toolResponse

Agent → LLM: toolResponse
  ← LLM: final response tokens
```

### 10.3 Cambio Task

```
LLM → Agent: change-task(taskName)
Agent → POST /change-task

FSM → ConversationalFlowRunner::resume()
  → ConversationalFlowRunner::changeTask(taskName)
    → MemoryManager::getVars()
    → createMachine with snapshot
    → actor.send({type: taskName, memoryParameters})
    → Validate transition (guards)
    → Check newTask == taskName
  ← Return true/false

If true:
  → getDataForAgent()
  → save()
  ← Return new agentData

Agent → LLM: interrupt + getResponse("/start-task", agentData)
```

---

## 11. Checkpoint System

### 11.1 Definizione Checkpoint

```json
{
  "_id": "checkpoint-id",
  "name": "Data appuntamento confermata",
  "prompt": "L'utente ha confermato la data dell'appuntamento",
  "required": true
}
```

### 11.2 Utilizzo

- Checkpoint definiti globalmente nel conversational flow
- Abilitati selettivamente per ogni task
- Possono essere obbligatori (`required: true`)
- Inviati come eventi a Core CTI per tracking

---

## 12. Language Detection

### 12.1 Configurazione

```json
{
  "enableLanguageDetection": true,
  "minWordsForLanguageDetection": 2,
  "languageDetector": "fasttext|lingua"
}
```

### 12.2 Comportamento

- Lingua default all'inizio conversazione
- Rilevamento automatico dalle utterance utente
- Configurazioni STT/TTS specifiche per lingua
- System prompts nella lingua configurata

---

## 13. Integrazione Core CTI

### 13.1 Messaggi Inviati

**Formato:**
```json
{
  "campaignId": "string",
  "conversationId": "string",
  "contactId": "string",
  "ts": "ISO timestamp",
  "body": "text|object",
  "type": "tool|system|message",
  "src": "bot|agent|user",
  "srcId": "string",
  "srcName": "string",
  "taskName": "string",
  "taskType": "HUM|AIS|AIO",
  "taskStatus": "string",
  "meta": {"visible": true|false}
}
```

### 13.2 Eventi Checkpoint

```json
{
  "serviceId": "campaignId",
  "room": "roomId",
  "callerId": "string",
  "calleeId": "string",
  "type": "success|navigation|...",
  "data": {}
}
```

---

## 14. Tecnologie Utilizzate

### 14.1 Stack Core

- **TypeScript**: Linguaggio principale
- **XState**: Gestione macchine a stati
- **REST API Framework**: [Arrest](https://github.com/lukeed/polka) (da confermare)
- **MongoDB**: Database principale (flows, versioni, configurazioni)
- **Redis**: In-memory storage (FSM snapshot, variabili conversazione)

### 14.2 Template & Frontend

- **Tournament**: Template engine (n8n)
- **CodeMirror**: Editor per prompt/template
- **React Flow**: Visual editor per FSM (probabile)

### 14.3 External Services

**LLM Providers:**
- OpenAI, Azure OpenAI, Google, Groq, Local

**STT Providers:**
- Google, Deepgram, OpenAI

**TTS Providers:**
- Google, ElevenLabs, OpenAI

**Language Detection:**
- FastText, Lingua

---

## 15. Considerazioni di Scalabilità

### 15.1 Stateless API Layer

- Le API sono stateless
- Lo stato è sempre in Redis (snapshot FSM)
- Permette scaling orizzontale dei worker API

### 15.2 Memory Layer

- Redis come single source of truth per runtime state
- MongoDB per configurazioni persistenti
- TTL automatico per cleanup memoria conversazioni

### 15.3 Agent Layer

- Agent indipendenti per ogni contatto
- Comunicano con FSM tramite API REST
- Possono essere distribuiti su infrastruttura separata

---

## 16. Security & Multi-tenancy

### 16.1 Isolamento Tenant

- Ogni conversational flow associato a `campaignId`
- Tenant data iniettato in memoria all'inizio conversazione
- MCP tools ricevono automaticamente `tenantId`

### 16.2 API Authentication

- Da definire (probabilmente API Key / JWT)
- Validazione tenant/campaign access

---

## 17. Monitoring & Observability

### 17.1 Eventi da Tracciare

- Creazione/Resume conversazioni
- Transizioni task
- Errori validazione
- Chiamate tool MCP
- Utterance utente/bot
- Checkpoint raggiunti

### 17.2 Metriche

- Durata conversazioni
- Tempo medio per task
- Success rate transizioni
- Utilizzo tool
- Performance LLM/STT/TTS

---

## 18. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                          │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │ API Pod  │     │ API Pod  │     │ API Pod  │
  │          │     │          │     │          │
  │ - FSM    │     │ - FSM    │     │ - FSM    │
  │ - Memory │     │ - Memory │     │ - Memory │
  │ - APIs   │     │ - APIs   │     │ - APIs   │
  └────┬─────┘     └────┬─────┘     └────┬─────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ MongoDB  │    │  Redis   │    │  Agents  │
  │ Cluster  │    │ Cluster  │    │ (Livekit,│
  │          │    │          │    │ Channel) │
  └──────────┘    └──────────┘    └──────────┘
```

---

## 19. Future Enhancements

### 19.1 Possibili Estensioni

- **Deflection Management**: Gestione conversazioni parallele
- **Advanced Analytics**: ML su conversazioni per insights
- **A/B Testing**: Test varianti flow su stesso campaign
- **Visual Debugger**: Debug in tempo reale FSM state
- **Playbooks**: Automazioni predefinite riutilizzabili

### 19.2 Ottimizzazioni

- **Prompt Caching**: Cache rendering prompt comuni
- **Streaming Improvements**: Ottimizzazione latenza STT/LLM/TTS
- **Smart Context**: Riduzione context LLM basato su rilevanza

---

## 20. Glossario

- **FSM**: Finite State Machine (Macchina a Stati Finiti)
- **Task**: Stato della FSM rappresentante un'attività conversazionale
- **ConversationalFlow**: Definizione di un flusso conversazionale
- **Campaign**: Campagna di contatto a cui appartiene un flow
- **Contact**: Singola interazione con utente (es: chiamata, chat)
- **Conversation**: Insieme di contatti collegati (multicontatto)
- **MCP**: Model Context Protocol - protocollo per tool esterni
- **Utterance**: Singolo messaggio/frase dell'utente
- **ConvMiner**: AI Helper per estrazione automatica variabili
- **Checkpoint**: Punto di tracciamento nel flow
- **Routing**: Assegnazione contatto a operatore umano
