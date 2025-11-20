/**
 * GET /flows
 *
 * Returns the list of conversational flows and their tags.
 * Optionally filter by campaign and supported channel.
 */

export interface ListFlowsRequest {
  campaignId: string;
  channel?: "phone" | "whatsapp" | "sms" | "mail" | "chat";
}

export interface FlowTag {
  versionId: string;
  tag: string; // "latest", "v1", "v2", etc.
  createdBy: string;
  createdAt: string; // ISO date-time
}

export interface FlowListItem {
  id: string;
  name: string;
  campaignId: string;
  templateId: string | null;
  updatedAt: string; // ISO date-time
  updatedBy: string;
  tags: FlowTag[];
}

export type ListFlowsResponse = FlowListItem[];

export async function listFlows(
  request: ListFlowsRequest
): Promise<ListFlowsResponse> {
  // TODO: Implement logic
  // 1. Query MongoDB for flows with campaignId
  // 2. If channel specified: filter by versions supporting that channel
  // 3. For each flow, get all tagged versions
  // 4. Return list with metadata
  throw new Error("Not implemented");
}
