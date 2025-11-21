/**
 * FSM API Validators - Input validation for flow management
 */

/**
 * TODO: Implement validators
 *
 * - validateCreateFlowRequest
 *   - Validate name is non-empty string
 *   - Validate campaignId exists
 *   - Validate updatedBy is valid user ID
 *
 * - validateUpdateFlowRequest
 *   - Validate name is non-empty string
 *   - Validate updatedBy is valid user ID
 *
 * - validateCreateVersionRequest
 *   - Validate ConversationalFlowVersion schema
 *   - Use validateConversationalFlowVersion from models
 *   - Check draft status and required fields
 *   - Validate parentVersionId logic
 *
 * - validateListFlowsQuery
 *   - Validate campaignId is required
 *   - Validate channel is valid ChannelType (if provided)
 */
