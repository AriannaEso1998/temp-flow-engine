/**
 * FSM Compiler - Converts ConversationalFlowVersion configuration into XState machine
 *
 * Responsibilities:
 * - Parse tasks into XState states
 * - Generate transitions from connectedTasks
 * - Create guards for parameter validation
 * - Inject system actions (setCurrentTask, etc.)
 */

import { setup, assign } from 'xstate';
import type { ConversationalFlowVersion, MemoryParameters } from "../models/index.js";


export interface FSMContext {
    conversationId: string;
    contactId: string;
    currentTask: string;
    channel: string;
    validationError?: string
    newTask?: string;
}

type FSMEvent = {
    type: string;  // Task name to transition to
    memoryParameters: Record<string, MemoryParameters>;
    setTaskValidationError: (msg: string) => void;
};

export class FSMCompiler {
    constructor(private version: ConversationalFlowVersion) {
        // Validate that the version is not a draft
        if (version.draft === true) {
            throw new Error("Cannot compile FSM from draft ConversationalFlowVersion");
        }
    }

    /**
     * Compiles the configuration into an XState machine definition
     * Returns the machine configuration object ready for createActor()
     */
    compile(): any {
        // TODO: Implement full compilation logic
        // - Generate states from tasks
        // - Generate transitions from connectedTasks
        // - Create guards for parameter validation
        // - Create actions for context updates

        // For now, create a basic machine structure
        const machine = setup({
            types: {
                context: {} as FSMContext,
                events: {} as FSMEvent,
            },
            guards: {
                isValid: ({ event }, params) => {
                    //TODO: Implement validation logic, checking if event.memoryParameters match params.requiredTaskParameters
                    console.log("Validating transition parameters against requiredTaskParameters", params);
                    event.setTaskValidationError("Manca il parametro XXX");

                    return true;
                }
            },

            actions: {
                setCurrentTask: assign(({ event }) => {
                    return { newTask: event.type };
                })
            }
        }).createMachine({
            id: `flow_${this.version.conversationalFlowId}_v_${this.version._id}`,
            initial: this.version.firstTask!,
            context: ({ input }: any) => ({
                conversationId: input?.conversationId || "",
                contactId: input?.contactId || "",
                currentTask: input?.currentTask || this.version.firstTask,
                channel: input?.channel || "",
                validationError: input?.validationError,
                globalPrompt: this.version.globalPrompt,
            }),
            states: this.generateStates()
        });

        return machine;
    }

    /**
     * Generates XState states from tasks
     */
    private generateStates(): Record<string, any> {
        // TODO: Complete state generation with transitions and guards
        // For now, create basic states from tasks
        const states: Record<string, any> = {};

        for (const task of this.version.tasks!) {
            states[task.description] = {
                entry: ({ context }: any) => {
                    // TODO: Set current task in context
                    console.log(`Entering task: ${task._id}` + JSON.stringify(context));
                },
                on: {
                    // TODO: Generate transitions from connectedTasks
                    ...this.generateTransitions(task),
                },
            };
        }

        return states;
    }

    /**
     * Generates XState transitions from connectedTasks
     */
    private generateTransitions(task: any): Record<string, any> {
        // TODO: Add guards for parameter validation
        const transitions: Record<string, any> = {};

        if (task.connectedTasks && task.connectedTasks.length > 0) {
            for (const targetTask of task.connectedTasks) {
                const eventName = `TRANSITION_TO_${targetTask.toUpperCase()}`;
                transitions[eventName] = {
                    target: targetTask,
                    // TODO: Add guard for transition parameter validation
                    // guard: ({ context }) => this.validateTransitionParameters(context, task)
                };
            }
        }

        return transitions;
    }
}
