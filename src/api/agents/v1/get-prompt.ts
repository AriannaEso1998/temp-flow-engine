/**
 * GET /prompt/:conversation_id
 *
 * Returns the rendered prompt including memory data for the agent.
 * Memory data is rendered as a markdown table.
 */

export interface GetPromptRequest {
  conversationId: string;
}

export interface GetPromptResponse {
  prompt: string;
}

export async function getPrompt(
  request: GetPromptRequest
): Promise<GetPromptResponse> {
  // TODO: Implement logic
  // 1. ConversationalFlowRunner.resume(conversationId)
  // 2. Get current task prompt
  // 3. MemoryManager.getVars() - merge convMiner + tools
  // 4. MemoryManager.getTenantData()
  // 5. MemoryManager.getContactsHistory() for multi-contact
  // 6. Render prompt with Tournament template engine
  // 7. Format memory as markdown table:
  //    |var|property|value|
  //    |-|-|-|
  //    |data||10 ottobre|
  //    |prestazione|Id|SSSS|
  // 8. Append memory to prompt
  // 9. Add metadata: current date/time, channel, contact info
  throw new Error("Not implemented " + request.conversationId);
}
