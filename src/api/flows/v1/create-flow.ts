/**
 * POST /flows
 *
 * Creates a new Conversational Flow.
 */

export interface CreateFlowRequest {
  name: string;
  campaignId: string;
  updatedBy: string;
}

export interface CreateFlowResponse {
  id: string;
}

export async function createFlow(
  request: CreateFlowRequest
): Promise<CreateFlowResponse> {
  // TODO: Implement logic
  // 1. Validate request (unique name within campaign, etc.)
  // 2. Create ConversationalFlow document in MongoDB
  // 3. Set initial metadata (createdAt, updatedAt, schemaVersion)
  // 4. Return generated ID
  throw new Error("Not implemented");
}
