/**
 * POST /flows/:id/versions
 *
 * Creates a new version of a conversational flow.
 *
 * Tag management rules:
 * - If parentVersionId is null or points to "latest": update "latest" tag to new version
 * - If parentVersionId has a custom tag:
 *   - If no new tag provided: reject
 *   - If new tag provided: create version with new tag
 */

import type { ConversationalFlowVersion } from "../../../../models/v1/index.js";

export interface CreateVersionRequest {
  flowId: string;
  version: ConversationalFlowVersion;
  parentVersionId?: string | null;
  newTag?: string;
}

export interface CreateVersionResponse {
  versionId: string;
}

export async function createVersion(
  request: CreateVersionRequest
): Promise<CreateVersionResponse> {
  // TODO: Implement logic
  // 1. Validate version data (use validation utils)
  // 2. Check parentVersionId and tag management rules
  // 3. If draft=false: ensure all required fields present
  // 4. Create ConversationalFlowVersion document
  // 5. Update tag references as needed
  // 6. Compile FSM to validate it's buildable (optional)
  // 7. Return new version ID
  throw new Error("Not implemented");
}
