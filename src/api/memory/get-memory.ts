/**
 * GET /memory/:conversation_id
 *
 * Returns the complete memory content to pass to tools.
 * Called by agents (channel, livekit) to get a data dump for tools invoked by the LLM.
 */

export interface GetMemoryRequest {
  conversationId: string;
}

export interface MemoryVariableValue {
  varId: string;
  value: unknown; // Can be any type (string, number, object, etc.)
}

export interface GetMemoryResponse {
  tenant: Record<string, unknown>;
  vars: MemoryVariableValue[];
}

export async function getMemory(
  request: GetMemoryRequest
): Promise<GetMemoryResponse> {
  // TODO: Implement logic
  // 1. MemoryManager.getTenantData()
  // 2. MemoryManager.getVars() - returns merged convMiner + tools
  // 3. Return complete memory snapshot
  // Tools will receive this data along with their specific parameters
  throw new Error("Not implemented");
}
