/**
 * PATCH /flows/:id
 *
 * Updates the name of a Conversational Flow.
 */

export interface UpdateFlowRequest {
  id: string;
  name: string;
  updatedBy: string;
}

export interface UpdateFlowResponse {
  success: boolean;
}

export async function updateFlow(
  request: UpdateFlowRequest
): Promise<UpdateFlowResponse> {
  // TODO: Implement logic
  // 1. Find flow by ID
  // 2. Update name and updatedBy/updatedAt
  // 3. Validate uniqueness within campaign
  // 4. Save to MongoDB
  throw new Error("Not implemented");
}
