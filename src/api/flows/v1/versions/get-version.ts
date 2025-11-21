/**
 * GET /flows/:id/versions/:vid
 *
 * Returns the full JSON of a flow version as saved by the UI.
 */

import type { ConversationalFlowVersion } from "../../../../models/v1/index.js";

export interface GetVersionRequest {
  flowId: string;
  versionId: string;
}

export type GetVersionResponse = ConversationalFlowVersion;

export async function getVersion(
  request: GetVersionRequest
): Promise<GetVersionResponse> {
  // TODO: Implement logic
  // 1. Query MongoDB for specific version
  // 2. Verify it belongs to the flow
  // 3. Return complete ConversationalFlowVersion object
  throw new Error("Not implemented");
}
