/**
 * Memory API Handlers - Business logic for memory operations
 */

import { MemoryManager } from "../../../services/v1/memory-manager.js";

/**
 * TODO: Implement handlers
 *
 * - getMemoryHandler
 *   - Parse conversation_id from path
 *   - Create MemoryManager instance
 *   - Get tenant data
 *   - Get all variables (merged convMiner + tools)
 *   - Return { tenant, vars }
 *   Used by MCP tools to read current memory state
 *
 * - updateMemoryHandler
 *   - Parse conversation_id from path
 *   - Validate request body (array of MemoryVariable updates)
 *   - Create MemoryManager instance
 *   - Call memoryManager.setVars() with updatedBy from tool name
 *   - Return success
 *   Used by MCP tools to write extracted/computed values
 */
