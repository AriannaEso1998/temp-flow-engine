/**
 * Conversational Flow Version type definitions
 * Based on OpenAPI schema components
 */

import type {
  ConversationalFlowVersion as GeneratedConversationalFlowVersion,
  ConversationalFlow as GeneratedConversationalFlow,
  ChannelType,
  ClosureConfig,
  MediaConfig,
  LanguageDetectionConfig,
  LanguageCode,
  MCPServer,
  AIHelper,
  Checkpoint,
} from "../types.js";

// Re-export the generated types
export type ConversationalFlowVersion = GeneratedConversationalFlowVersion;
export type ConversationalFlow = GeneratedConversationalFlow;

export type {
  ChannelType,
  ClosureConfig,
  MediaConfig,
  LanguageDetectionConfig,
  LanguageCode,
  MCPServer,
  AIHelper,
  Checkpoint,
};

/**
 * Type guard to check if a ConversationalFlowVersion is a draft
 */
export function isDraft(version: ConversationalFlowVersion): boolean {
  return version.draft === true;
}

/**
 * Type guard to check if a ConversationalFlowVersion is complete (not a draft)
 */
export function isComplete(version: ConversationalFlowVersion): boolean {
  return version.draft === false;
}

/**
 * Validates that a ConversationalFlowVersion has all required fields
 * Different fields are required based on whether it's a draft or not
 */
export function validateConversationalFlowVersion(
  version: ConversationalFlowVersion
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // If draft is false, all fields should be present according to the schema's if/then/else
  if (!isDraft(version)) {
    const requiredFields: (keyof ConversationalFlowVersion)[] = [
      "_id",
      "schemaVersion",
      "conversationalFlowId",
      "globalPrompt",
      "channels",
      "mandatoryChannels",
      "closureConfig",
      "mediaConfig",
      "defaultLanguage",
      "supportedLanguages",
      "systemPromptsLanguage",
      "apiVersion",
      "variables",
      "uiMetadata",
      "mcpServers",
      "aiHelpers",
      "tasks",
      "firstTask",
      "checkpoints",
      "reasonsOfContact",
      "results",
      "createdBy",
      "createdAt",
    ];

    for (const field of requiredFields) {
      if (version[field] === undefined || version[field] === null) {
        errors.push(`ConversationalFlowVersion requires field "${field}" when draft is false`);
      }
    }

    // Validate firstTask exists in tasks
    if (version.firstTask && version.tasks) {
      const firstTaskExists = version.tasks.some((task) => task._id === version.firstTask);
      if (!firstTaskExists) {
        errors.push(`firstTask "${version.firstTask}" does not exist in tasks array`);
      }
    }

    // Validate all connectedTasks reference existing tasks
    if (version.tasks) {
      const taskIds = new Set(version.tasks.map((t) => t._id));
      for (const task of version.tasks) {
        if (task.connectedTasks) {
          for (const connectedTaskId of task.connectedTasks) {
            if (!taskIds.has(connectedTaskId)) {
              errors.push(
                `Task "${task._id}" references non-existent connectedTask "${connectedTaskId}"`
              );
            }
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
