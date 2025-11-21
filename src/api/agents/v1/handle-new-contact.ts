/**
 * POST /handle-new-contact
 *
 * Agent (livekit or channel) notifies the start of a new contact to the FSM.
 * The API checks if a FSM is already running for the conversation and decides
 * whether to start a new one or resume based on the conversational flow configuration.
 */

export interface HandleNewContactRequest {
  contactId: string;
  conversationId: string;
  conversationalFlowVersionId: string;
  channel: "phone" | "whatsapp" | "sms" | "mail" | "chat";
  // Optional template rendering data
  tenantData?: Record<string, unknown>;
}

export interface HandleNewContactResponse {
  routingParameters: Record<string, unknown> | null;
  taskName: string;
  taskType: "AIO" | "AIS" | "HUM";
  prompt: string;
  mcpServers: string[];
  llm: LLMConfig;
  tts: TTSConfig;
  stt: STTConfig;
  vad: VADConfig;
  courtesyMessages?: CourtesyMessagesConfig;
  languageDetection?: LanguageDetectionConfig;
}

// TODO: Import proper types from models
interface LLMConfig {
  provider: string;
  model: string;
  temperature?: number;
}

interface TTSConfig {
  provider: string;
  voice: string;
  speed?: number;
}

interface STTConfig {
  provider: string;
  language?: string;
  streaming?: boolean;
}

interface VADConfig {
  activationThreshold?: number;
  minSilenceDuration?: number;
}

interface CourtesyMessagesConfig {
  enabled: boolean;
  timeout?: number;
}

interface LanguageDetectionConfig {
  enabled: boolean;
  minWords?: number;
}

export async function handleNewContact(
  request: HandleNewContactRequest
): Promise<HandleNewContactResponse> {
  // TODO: Implement logic
  // 1. Check Redis if FSM exists for conversationId
  // 2. If exists: decide if resume or start new based on closureConfig
  // 3. If not: ConversationalFlowRunner.init()
  // 4. Register for Contact End events
  // 5. Save tenant data and initialize memory
  // 6. Return agent data with rendered prompt
  throw new Error("Not implemented " + request.conversationId);
}
