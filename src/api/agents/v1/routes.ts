/**
 * Agents API Routes - Agent interaction endpoints
 *
 * Based on FLOW-ENGINE.md Agents API table (lines 1440-1444)
 */

/**
 * TODO: Define Agents routes
 *
 * Routes to implement:
 * - POST /handle-new-contact
 *   Body: { contactId, conversationId, conversationalFlowVersionId, channel }
 *   Returns: {
 *     routingParameters, taskName, taskType, prompt, mcpServers,
 *     llm, tts, stt, vad, courtesyMessages, languageDetection, ...
 *   }
 *   Description: Initialize new conversation, start FSM, return agent config
 *
 * - POST /change-task
 *   Body: { contactId, conversationId, task }
 *   Returns: {
 *     result: true/false,
 *     prompt?, mcpServers?, routingParameters?, taskName?, taskType?,
 *     reason?
 *   }
 *   Description: Transition to different task with validation
 *
 * - POST /handle-end-contact
 *   Body: TBD (based on CTI event structure)
 *   Description: Handle contact termination, generate summary, check closure
 *
 * - GET /prompt/:conversation_id
 *   Returns: { prompt: string }
 *   Description: Get rendered prompt with memory for agent
 */
