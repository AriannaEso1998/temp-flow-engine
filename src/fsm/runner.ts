/**
 * ConversationalFlowRunner - Main FSM lifecycle manager
 *
 * Responsibilities:
 * - Compile FSM from configuration
 * - Create and expose XState actor
 * - Provide domain-specific helpers (changeTask, getAgentData, etc.)
 * - Manage conversation state and validation
 *
 * const runner = new ConversationalFlowRunner(contactId, conversationId, flowVersionId);
 * runner.compileFsm(); // Creates this.actor
 *
 * // Access all XState methods directly via runner.actor:
 * runner.actor.start();
 * runner.actor.send({
 *    type: taskName,  (ad esempio "prenotazione")
      memoryParameters: self.memoryParameters,
      setTaskValidationError: this.setTaskValidationError
  });
 * runner.actor.subscribe(state => console.log(state));
 * const snapshot = runner.actor.getSnapshot();
 *
 * // Use domain-specific methods:
 * runner.changeTask('newTask');
 * const agentData = runner.getAgentData();
 */

import { createActor, type AnyActorRef } from "xstate";
import type { ConversationalFlowVersion } from "../models/index.js";
import { FSMCompiler } from "./fsm-compiler.js";

export interface FlowContext {
  currentTask: string;
  conversationId: string;
  contactId: string;
  channel: string;
  validationError?: string;
}

export interface AgentData {
  prompt: string;
  taskType: string;
  taskName: string;
  channelConfig: Record<string, unknown>;
  mcpServers: string[];
  conversationId: string;
  contactId: string;
  variables: Record<string, unknown>;
}

export class ConversationalFlowRunner {
  public conversationId: string;
  public contactId: string;
  public conversationalFlowVersionId: string;
  public memoryParameters: string[];
  public fsm!: ConversationalFlowVersion; //set by compileFsm()
  public errorValidationMessage: string;
  public actor!: AnyActorRef; // XState actor

  private config?: ConversationalFlowVersion;

  constructor(
    contactId: string,
    conversationId: string,
    conversationalFlowVersionId: string
  ) {
    this.contactId = contactId;
    this.conversationId = conversationId;
    this.conversationalFlowVersionId = conversationalFlowVersionId;
    this.memoryParameters = [];
    this.errorValidationMessage = "";
  }

  /**
   * Static factory method to resume from existing conversational flow version
   */
  static resume(
    conversationalFlowVersionId: string
  ): ConversationalFlowRunner | null {
    // TODO: Implement resume logic
    // - Fetch conversational flow version from database
    // - Load FSM snapshot from Redis if exists
    // - Create runner with restored state
    // - Restore memoryParameters and context
    throw new Error("Not implemented" + conversationalFlowVersionId);
  }

  /**
   * Compiles the FSM from configuration and creates the XState actor
   * @returns The compiled ConversationalFlowVersion
   */
  compileFsm(): ConversationalFlowVersion {
    // TODO: Implement FSM compilation and actor creation
    // - Fetch ConversationalFlowVersion from database using conversationalFlowVersionId
    // - Compile FSM using FSMCompiler
    // - Store in this.fsm
    // - Create XState actor with input context
    // - Return compiled FSM
    if (!this.config) {
      throw new Error("Config not loaded. Load config before compiling FSM.");
    }

    const compiler = new FSMCompiler(this.config);
    const machine = compiler.compile();
    this.fsm = machine;

    // Create XState actor with initial input/context
    this.actor = createActor(machine, {
      input: {
        conversationId: this.conversationId,
        contactId: this.contactId,
        currentTask: this.config.firstTask!,
        validationError: undefined,
      },
    });

    return this.fsm;
  }

  /**
   * Attempts to transition to a new task
   * Returns true if successful, false if validation fails
   */
  changeTask(taskName: string): boolean {
    // TODO: Implement task transition logic
    // - Validate taskName exists in FSM
    // - Check transition parameters are satisfied
    // - Send event to actor: this.actor.send({type: taskName, memoryParameters: self.memoryParameters, setTaskValidationError: this.setTaskValidationError})
    // - Verify state actually changed
    // - Update memoryParameters if needed
    // - Return true if successful, false if validation fails
    throw new Error("Not implemented" + taskName);
  }

  /**
   * Sets task validation error message
   */
  setTaskValidationError(message: string): void {
    this.errorValidationMessage = message;
  }

  /**
   * Gets task validation error message
   */
  getTaskValidationError(): string {
    return this.errorValidationMessage;
  }

  /**
   * Checks if there's a validation error
   */
  hasTaskValidationError(): boolean {
    return this.errorValidationMessage !== "" && this.errorValidationMessage !== undefined;
  }

  /**
   * Gets data needed by agent (prompt, config, etc.)
   */
  getAgentData(): AgentData {
    // TODO: Prepare data for agent
    // - Get current task from FSM state
    // - Extract task prompt from ConversationalFlowVersion
    // - Get task type (AIO, AIS, HUM)
    // - Get channel config from FSM
    // - Get MCP servers list for task
    // - Get current memory variables
    // - Build and return AgentData object
    throw new Error("Not implemented");
  }

  /**
   * Saves current state to memory
   */
  save(): void {
    // TODO: Persist snapshot to Redis via MemoryManager
    throw new Error("Not implemented");
  }
}
