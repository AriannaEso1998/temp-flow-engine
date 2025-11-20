/**
 * Memory Variable - Represents a variable stored in Redis memory
 *
 * Based on the memory structure defined in FLOW-ENGINE.md (lines 82-101)
 *
 * Memory structure:
 * - conversation_id::vars::convMiner => variables extracted by ConvMiner AI Helper
 * - conversation_id::vars::tools => variables extracted by MCP tools
 */

/**
 * Description entry for LLM-friendly variable representation
 */
export interface DescriptionForLLMEntry {
  name: string;
  value: string;
}

/**
 * Memory Variable class representing a variable stored in conversation memory
 */
export class MemoryVariable {
  updatedBy: string | null;
  updatedAt: string | null;
  type: string;
  contactId: string;
  value: any;
  descriptionForLLM: DescriptionForLLMEntry[] | null;

  constructor(data: {
    updatedBy?: string | null;
    updatedAt?: string | null;
    type: string;
    contactId: string;
    value?: any;
    descriptionForLLM?: DescriptionForLLMEntry[] | null;
  }) {
    this.updatedBy = data.updatedBy ?? null;
    this.updatedAt = data.updatedAt ?? null;
    this.type = data.type;
    this.contactId = data.contactId;
    this.value = data.value ?? null;
    this.descriptionForLLM = data.descriptionForLLM ?? null;
  }

  /**
   * Check if the variable has a valid value (not null/undefined)
   */
  hasValue(): boolean {
    // TODO: Implement logic to check if value is present and valid
    // - Check if value is not null/undefined
    // - Could add type-specific validation
    return false;
  }

  /**
   * Check if the variable was updated by a specific source
   */
  isUpdatedBy(source: string): boolean {
    // TODO: Implement check for updatedBy field
    // - Compare updatedBy with source
    // - Handle null case
    return false;
  }

  /**
   * Get a human-readable representation for LLM prompts
   * Returns the descriptionForLLM if available, otherwise formats the value
   */
  getLLMDescription(): string {
    // TODO: Implement LLM-friendly description generation
    // - If descriptionForLLM exists, format it as markdown table row
    // - Otherwise, format value as string
    // - Handle complex objects
    return "";
  }

  /**
   * Check if the variable is stale (older than specified time)
   */
  isStale(maxAgeSeconds: number): boolean {
    // TODO: Implement staleness check
    // - Parse updatedAt timestamp
    // - Compare with current time
    // - Return true if older than maxAgeSeconds
    return false;
  }

  /**
   * Update the variable value
   */
  updateValue(
    value: any,
    updatedBy: string,
    descriptionForLLM?: DescriptionForLLMEntry[] | null
  ): void {
    // TODO: Implement value update logic
    // - Set new value
    // - Update updatedBy
    // - Update updatedAt with current timestamp
    // - Update descriptionForLLM if provided
  }

  /**
   * Serialize to JSON for storage in Redis
   */
  toJSON(): object {
    // TODO: Implement serialization
    // - Return object with all properties
    // - Ensure proper formatting for Redis storage
    return {};
  }

  /**
   * Create MemoryVariable from JSON data retrieved from Redis
   */
  static fromJSON(data: any): MemoryVariable {
    // TODO: Implement deserialization
    // - Parse JSON data
    // - Validate required fields
    // - Return new MemoryVariable instance
    throw new Error("Not implemented");
  }

  /**
   * Create an empty/uninitialized MemoryVariable
   * Used when initializing memory for a new conversation
   */
  static createEmpty(
    type: string,
    contactId: string
  ): MemoryVariable {
    // TODO: Implement empty variable creation
    // - Set updatedBy to null
    // - Set updatedAt to null
    // - Set value to null
    // - Set descriptionForLLM to null
    throw new Error("Not implemented");
  }
}

/**
 * Type alias for memory parameters passed to FSM events
 * Maps variable ID to MemoryVariable
 */
export type MemoryParameters = Record<string, MemoryVariable>;
