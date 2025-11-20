/**
 * FSM API Routes - Flow Management endpoints
 *
 * Based on FLOW-ENGINE.md UI API table (lines 1417-1425)
 */

/**
 * TODO: Define FSM routes
 *
 * Routes to implement:
 * - GET /flows
 *   Query: campaignId (required), channel (optional)
 *   Returns: Array of flows with tags
 *
 * - POST /flows
 *   Body: { name, campaignId, updatedBy }
 *   Returns: { id }
 *
 * - PATCH /flows/:id
 *   Body: { name, updatedBy }
 *   Returns: Updated flow
 *
 * - GET /flows/:id/versions
 *   Query: onlyTaggedVersions (boolean)
 *   Returns: Array of versions with tags
 *
 * - GET /flows/:id/versions/:vid
 *   Returns: Full ConversationalFlowVersion JSON
 *
 * - POST /flows/:id/versions
 *   Body: ConversationalFlowVersion
 *   Returns: { versionId }
 */
