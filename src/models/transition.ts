/**
 * Transition parameter type definitions
 * Based on OpenAPI schema components
 */

import type { TransitionParameter as GeneratedTransitionParameter } from "./types.js";

// Re-export the generated TransitionParameter type
export type TransitionParameter = GeneratedTransitionParameter;

/**
 * Helper function to filter required transition parameters
 */
export function getRequiredParameters(parameters: TransitionParameter[]): TransitionParameter[] {
  return parameters.filter((param) => param.required);
}

/**
 * Helper function to get all variable IDs from transition parameters
 */
export function getVariableIds(parameters: TransitionParameter[]): string[] {
  return parameters.map((param) => param.variableId);
}

/**
 * Helper function to check if all required parameters are satisfied
 * @param parameters - The transition parameters to check
 * @param availableVariables - Set of variable IDs that have values in memory
 */
export function areRequiredParametersSatisfied(
  parameters: TransitionParameter[],
  availableVariables: Set<string>
): { satisfied: boolean; missing: string[] } {
  const required = getRequiredParameters(parameters);
  const missing = required
    .filter((param) => !availableVariables.has(param.variableId))
    .map((param) => param.variableId);

  return {
    satisfied: missing.length === 0,
    missing,
  };
}
