/**
 * Task type definitions for Conversational Flow
 * Based on OpenAPI schema components
 */

import type {
  ConversationalFlowTask as GeneratedTask,
  ConversationalFlowTaskAIO,
  ConversationalFlowTaskAIS,
  ConversationalFlowTaskHUM,
  TaskType,
  ChannelType,
  RoutingParameters,
  AIHelper,
  MCPToolSelection,
  Checkpoint,
  ClosureConfig,
} from "./types.js";

// Re-export all task-related types
export type ConversationalFlowTask = GeneratedTask;
export type TaskAIO = ConversationalFlowTaskAIO;
export type TaskAIS = ConversationalFlowTaskAIS;
export type TaskHUM = ConversationalFlowTaskHUM;

export type {
  TaskType,
  ChannelType,
  RoutingParameters,
  AIHelper,
  MCPToolSelection,
  Checkpoint,
  ClosureConfig
};

/**
 * Type guard to check if a task is of type AIO
 */
export function isTaskAIO(task: ConversationalFlowTask): task is TaskAIO {
  return task.type === "AIO";
}

/**
 * Type guard to check if a task is of type AIS
 */
export function isTaskAIS(task: ConversationalFlowTask): task is TaskAIS {
  return task.type === "AIS";
}

/**
 * Type guard to check if a task is of type HUM
 */
export function isTaskHUM(task: ConversationalFlowTask): task is TaskHUM {
  return task.type === "HUM";
}

/**
 * Type guard to check if a task requires routing parameters
 * Both AIS and HUM tasks require routing parameters
 */
export function requiresRouting(task: ConversationalFlowTask): task is TaskAIS | TaskHUM {
  return task.type === "AIS" || task.type === "HUM";
}

/**
 * Helper to get task by ID from a list of tasks
 */
export function getTaskById(tasks: ConversationalFlowTask[], taskId: string): ConversationalFlowTask | undefined {
  return tasks.find((task) => task._id === taskId);
}

/**
 * Helper to get all tasks connected to a specific task
 */
export function getConnectedTasks(
  tasks: ConversationalFlowTask[],
  fromTaskId: string
): ConversationalFlowTask[] {
  const task = getTaskById(tasks, fromTaskId);
  if (!task || !task.connectedTasks) {
    return [];
  }

  return task.connectedTasks
    .map((taskId) => getTaskById(tasks, taskId))
    .filter((t): t is ConversationalFlowTask => t !== undefined);
}

/**
 * Validates a task has all required fields based on its type
 */
export function validateTask(task: ConversationalFlowTask): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check routing parameters for AIS and HUM tasks
  if (requiresRouting(task)) {
    if (!task.routingParameters) {
      errors.push(`Task "${task._id}" of type "${task.type}" requires routingParameters`);
    } else {
      // Validate routing parameters
      if (typeof task.routingParameters.timeout !== "number" || task.routingParameters.timeout <= 0) {
        errors.push(`Task "${task._id}": routingParameters.timeout must be a positive number`);
      }
    }
  }

  // Validate connected tasks reference existing tasks
  if (task.connectedTasks && task.connectedTasks.length > 0) {
    // Note: This validation requires access to all tasks, so it's a partial validation
    // Full validation should be done at the ConversationalFlowVersion level
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
