/**
 * POST /change-task
 *
 * Agent (livekit or channel) calls a tool (internal) that invokes this API
 * to change the task of the running conversational flow.
 * The FSM verifies required parameters by querying memory and performs the
 * task transition if all conditions are met.
 */

export interface ChangeTaskRequest {
  contactId: string;
  conversationId: string;
  taskName: string;
}

export interface ChangeTaskSuccessResponse {
  result: true;
  prompt: string;
  mcpServers: string[];
  routingParameters: Record<string, unknown> | null;
  taskName: string;
  taskType: "AIO" | "AIS" | "HUM";
}

export interface ChangeTaskErrorResponse {
  result: false;
  reason: string;
}

export type ChangeTaskResponse =
  | ChangeTaskSuccessResponse
  | ChangeTaskErrorResponse;

export async function changeTask(
  request: ChangeTaskRequest
): Promise<ChangeTaskResponse> {
  // TODO: Implement logic
  // 1. ConversationalFlowRunner.resume(conversationId)
  // 2. Get memory variables
  // 3. runner.changeTask(taskName, memoryParameters)
  // 4. If validation fails: return error with reason
  // 5. If success: return new agent data with rendered prompt
  // 6. runner.save() to persist new state
  throw new Error("Not implemented" + request.taskName);
}
