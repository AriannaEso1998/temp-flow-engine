/**
 * Variable type definitions for Conversational Flow
 * Based on OpenAPI schema components
 */

import type { Variable as GeneratedVariable, VariableType } from "./types.js";

// Re-export the generated Variable type
export type Variable = GeneratedVariable;
export type { VariableType };

/**
 * Type guard to check if a variable is of enum type
 */
export function isEnumVariable(variable: Variable): variable is Variable & { type: "enum"; enumValues: string[] } {
  return variable.type === "enum";
}

/**
 * Type guard to check if a variable is of custom type
 */
export function isCustomVariable(variable: Variable): variable is Variable & { type: "custom" } {
  return variable.type === "custom";
}

/**
 * Type guard to check if a variable requires a prompt
 * All non-custom types require a prompt according to FLOW-ENGINE.md
 */
export function requiresPrompt(variable: Variable): variable is Variable & { prompt: string } {
  return variable.type !== "custom";
}

/**
 * Validates that a variable has all required fields based on its type
 */
export function validateVariable(variable: Variable): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if non-custom variables have a prompt
  if (variable.type !== "custom" && !variable.prompt) {
    errors.push(`Variable "${variable.name}" of type "${variable.type}" requires a prompt`);
  }

  // Check if enum variables have enumValues
  if (variable.type === "enum" && (!variable.enumValues || variable.enumValues.length === 0)) {
    errors.push(`Variable "${variable.name}" of type "enum" requires enumValues`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
