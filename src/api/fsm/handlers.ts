/**
 * FSM API Handlers - Business logic for flow management
 */

// import { FlowService } from "../../services/flow-service.js";

// const flowService = new FlowService();

/**
 * TODO: Implement handlers
 *
 * - listFlowsHandler
 *   - Parse campaignId and optional channel from query
 *   - Call flowService.listFlows()
 *   - Return flows with tags
 *
 * - createFlowHandler
 *   - Validate request body
 *   - Call flowService.createFlow()
 *   - Return created flow ID
 *
 * - updateFlowHandler
 *   - Parse flowId from path
 *   - Validate request body
 *   - Call flowService.updateFlow()
 *   - Return success
 *
 * - listVersionsHandler
 *   - Parse flowId from path
 *   - Parse onlyTaggedVersions from query
 *   - Call flowService.listVersions()
 *   - Return versions
 *
 * - getVersionHandler
 *   - Parse flowId and versionId from path
 *   - Call flowService.getVersion()
 *   - Return version or 404
 *
 * - createVersionHandler
 *   - Parse flowId from path
 *   - Validate ConversationalFlowVersion body
 *   - Validate draft status, required fields, etc.
 *   - Call flowService.createVersion()
 *   - Return version ID
 */
