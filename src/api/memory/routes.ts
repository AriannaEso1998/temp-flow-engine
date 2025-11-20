/**
 * Memory API Routes - Memory access endpoints
 *
 * Based on FLOW-ENGINE.md Memory API table (lines 1447-1451)
 */

/**
 * TODO: Define Memory routes
 *
 * Routes to implement:
 * - GET /memory/:conversation_id
 *   Returns: {
 *     tenant: object,
 *     vars: [{ varId, value }]
 *   }
 *   Description: Get complete memory dump for tools
 *
 * - PUT /memory/:conversation_id
 *   Body: [{
 *     updatedBy: string,
 *     updatedAt: string,
 *     contactId: string,
 *     varId: string,
 *     value: object,
 *     descriptionForLLM: [{ name, value }]
 *   }]
 *   Description: Update variables in memory (used by MCP tools)
 */
