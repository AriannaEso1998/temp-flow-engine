/**
 * Type definitions imported from generated OpenAPI schema
 * Re-exports for cleaner imports throughout the codebase
 */

import type { components } from "../../schemas/v1/generated/index.js";

// Re-export all schema components for easier access
export type Schemas = components["schemas"];

// Common types
export type ChannelType = "phone" | "whatsapp" | "sms" | "mail" | "chat";
export type TaskType = "AIO" | "AIS" | "HUM";
export type VariableType = "string" | "number" | "boolean" | "enum" | "date" | "phone" | "custom";
export type AssignmentStrategy = "variable" | "fixed" | "prompt";
export type LanguageCode = Schemas["LanguageCode"];
export type SchemaVersionString = Schemas["SchemaVersionString"];

// Base schema types from generated definitions
export type AIHelper = Schemas["AIHelper"];
export type AudioMediaConfig = Schemas["AudioMediaConfig"];
export type AudioMediaConfigPreset = Schemas["AudioMediaConfigPreset"];
export type BaseAudioMediaConfig = Schemas["BaseAudioMediaConfig"];
export type BaseSTTConfig = Schemas["BaseSTTConfig"];
export type BaseTTSConfig = Schemas["BaseTTSConfig"];
export type Checkpoint = Schemas["Checkpoint"];
export type ClosureConfig = Schemas["ClosureConfig"];
export type ConversationalFlow = Schemas["ConversationalFlow"];
export type ConversationalFlowTask = Schemas["ConversationalFlowTask"];
export type ConversationalFlowTaskAIO = Schemas["ConversationalFlowTaskAIO"];
export type ConversationalFlowTaskAIS = Schemas["ConversationalFlowTaskAIS"];
export type ConversationalFlowTaskHUM = Schemas["ConversationalFlowTaskHUM"];
export type ConversationalFlowVersion = Schemas["ConversationalFlowVersion"];
export type CourtesyMessageConfig = Schemas["CourtesyMessageConfig"];
export type CourtesyMessageGroqParams = Schemas["CourtesyMessageGroqParams"];
export type CourtesyMessageRandomParams = Schemas["CourtesyMessageRandomParams"];
export type LLMConfig = Schemas["LLMConfig"];
export type LanguageDetectionConfig = Schemas["LanguageDetectionConfig"];
export type LanguageSTTConfig = Schemas["LanguageSTTConfig"];
export type LanguageTTSConfig = Schemas["LanguageTTSConfig"];
export type LocalizedText = Schemas["LocalizedText"];
export type MCPServer = Schemas["MCPServer"];
export type MCPToolParameter = Schemas["MCPToolParameter"];
export type MCPToolParametersMap = Schemas["MCPToolParametersMap"];
export type MCPToolSelection = Schemas["MCPToolSelection"];
export type MediaConfig = Schemas["MediaConfig"];
export type RoutingParameters = Schemas["RoutingParameters"];
export type STTConfig = Schemas["STTConfig"];
export type TTSConfig = Schemas["TTSConfig"];
export type TextMediaConfig = Schemas["TextMediaConfig"];
export type TransitionParameter = Schemas["TransitionParameter"];
export type VADConfig = Schemas["VADConfig"];
export type Variable = Schemas["Variable"];
export type WaitingMessagesConfiguration = Schemas["WaitingMessagesConfiguration"];
