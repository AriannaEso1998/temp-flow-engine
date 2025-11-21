/**
 * GET /flows/:id/versions
 *
 * Returns the list of available and tagged versions of a conversational flow.
 */

export interface ListVersionsRequest {
  flowId: string;
  onlyTaggedVersions?: boolean;
}

export interface VersionListItem {
  versionId: string;
  tag: string | null; // "latest", "v1", etc. or null if untagged
  createdBy: string;
  createdAt: string; // ISO date-time
  draft: boolean;
}

export type ListVersionsResponse = VersionListItem[];

export async function listVersions(
  request: ListVersionsRequest
): Promise<ListVersionsResponse> {
  // TODO: Implement logic
  // 1. Query MongoDB for all versions of flow
  // 2. If onlyTaggedVersions: filter where tag !== null
  // 3. Return sorted by createdAt (most recent first)
  throw new Error("Not implemented");
}
