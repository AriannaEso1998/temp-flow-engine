/**
 * Agents API Handlers - Business logic for agent interactions
 */

// import { ConversationalFlowRunner } from "../../fsm/runner.js";
// import { MemoryManager } from "../../services/memory-manager.js";
// import { PromptRenderer } from "../../services/prompt-renderer.js";

/**
 * TODO: Implement handlers
 *
 * - handleNewContactHandler
 *   - Try ConversationalFlowRunner.resume(conversationId)
 *   - If null: create new runner, init memory, compile FSM, start actor
 *   - If exists: resume from snapshot, update contact data
 *   - Get agent data (prompt, llm config, channel config, etc.)
 *   - Save FSM snapshot
 *   - Return complete agent configuration
 *   See sequence diagram FLOW-ENGINE.md lines 1532-1609
 *
 * - changeTaskHandler
 *   - Resume ConversationalFlowRunner from snapshot
 *   - Call runner.changeTask(taskName)
 *   - Validate transition with guards
 *   - If valid: get new agent data, save snapshot, return success
 *   - If invalid: return error with validation message
 *   See sequence diagram FLOW-ENGINE.md lines 1756-1833
 *
 * - handleEndContactHandler
 *   - Resume runner
 *   - Generate contact summary (for multi-contact)
 *   - Save to previousContacts in memory
 *   - Check closure conditions (multiContact config)
 *   - Clean up or keep conversation alive based on closure config
 *
 * - getPromptHandler
 *   - Resume runner
 *   - Get memory variables
 *   - Render prompt with PromptRenderer
 *   - Include memory table, tenant data, metadata
 *   - Return rendered prompt
 *   See sequence diagram FLOW-ENGINE.md lines 1612-1681
 */
