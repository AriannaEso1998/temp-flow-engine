/**
 * PUT /memory/:conversation_id
 *
 * Saves entries to memory.
 * Each saved entry includes updatedBy, updatedAt, and contactId.
 * Used by tools to store complex (and non-complex) variables identified during execution.
 */

export interface MemoryVariableEntry {
  updatedBy: string; // Tool name or "convMiner"
  updatedAt: string; // ISO date-time
  contactId: string;
  varId: string;
  value: unknown; // Can be any type
  descriptionForLLM?: Array<{
    name: string;
    value: string;
  }>;
}

export interface UpdateMemoryRequest {
  conversationId: string;
  entries: MemoryVariableEntry[];
}

export interface UpdateMemoryResponse {
  success: boolean;
  updatedCount: number;
}

export async function updateMemory(
  request: UpdateMemoryRequest
): Promise<UpdateMemoryResponse> {
  // TODO: Implement logic
  // 1. Validate all entries reference existing variables
  // 2. Determine if entries are from tools or convMiner (based on updatedBy)
  // 3. MemoryManager.setVars() with appropriate source
  // 4. Tools write to conversation_id::vars::tools
  // 5. ConvMiner writes to conversation_id::vars::convMiner
  // 6. Update TTL on memory keys
  throw new Error("Not implemented");
}
