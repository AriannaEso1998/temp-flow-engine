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
import type {
    ConversationalFlowTask,
    ConversationalFlowTaskAIO,
    ConversationalFlowTaskHUM,
    ConversationalFlowTaskAIS,
    ConversationalFlowVersion,
    MemoryParameters,
    TransitionParameter
} from "../models/index.js";


export interface FSMContext {
    conversationId: string;
    contactId: string;
    currentTask: string;
    newTask: string;
    channel: string;
}

type FSMEvent = {
    type: string;
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
        const firstTask = this.version.tasks?.find(task => task._id === this.version.firstTask)?.description;
        if (!firstTask) {
            throw new Error("First task not found in tasks list");
        }
        const machine = setup({
            types: {
                context: {} as FSMContext,
                events: {} as FSMEvent,
            },
            guards: {
                isValid: ({ event }, params: { taskParameters?: TransitionParameter[] }) => {
                    const taskParameters = params.taskParameters || [];
                    for (const param of taskParameters) {
                        if (!event.memoryParameters[param.variableId]?.value && param.required) {
                            event.setTaskValidationError(`Missing the required parameter: ${param.variableId}`);
                            return false; 
                        }
                    }

                    return true;
                }
            },

            actions: {
                setCurrentTask: assign(({ event }) => {
                    console.log(`Transitioning to task: ${event.type}`);
                    // Skip update on initialization - initial context already has correct currentTask
                    if (event.type === 'xstate.init') {
                        return {};
                    }
                    return { newTask: event.type };
                })
            }
        }).createMachine({
            id: `flow_${this.version.conversationalFlowId}_v_${this.version._id}`,
            initial: firstTask,
            context: ({ input }: any) => ({
                conversationId: input?.conversationId || "",
                contactId: input?.contactId || "",
                currentTask: input?.currentTask || firstTask,
                channel: input?.channel || "",
                newTask: firstTask
            }) satisfies FSMContext,
            states: this.generateStates()
        });

        return machine;
    }

    /**
     * Generates XState states from tasks
     */
    private generateStates(): Record<string, any> {
        const states: Record<string, any> = {};

        for (const task of this.version.tasks!) {
            states[task.description] = {
                entry: 'setCurrentTask',
                meta: {
                    _id: task._id,
                    type: task.type,
                    description: task.description,
                    prompt: task.prompt,
                    transitionParameters: task.transitionParameters,
                    aiHelpers: task.aiHelpers,
                    mcpToolSelection: task.mcpToolSelection,
                    closureConfig: task.closureConfig,
                    enabledCheckpoints: task.enabledCheckpoints,
                    channels: task.channels,
                    connectedTasks: task.connectedTasks,
                    ...(task.type === 'AIO' && 'hideTranscriptionToHuman' in task
                        ? { hideTranscriptionToHuman: (task as ConversationalFlowTaskAIO).hideTranscriptionToHuman }
                        : {}),
                    ...((task.type === 'HUM' || task.type === 'AIS') && 'routingParameters' in task
                        ? { routingParameters: ((task as ConversationalFlowTaskHUM).routingParameters ?? (task as ConversationalFlowTaskAIS).routingParameters) }
                        : {})
                } as ConversationalFlowTask,
                on: {
                    ...this.generateTransitions(task),
                },
            };
        }

        return states;
    }

    /**
     * Generates XState transitions from connectedTasks
     */
    private generateTransitions(task: ConversationalFlowTask): Record<string, any> {
        const transitions: Record<string, any> = {};
        
        if (task.connectedTasks && task.connectedTasks.length > 0) {
            for (const targetTaskId of task.connectedTasks) {

                const targetTask = this.version.tasks?.find(t => t._id === targetTaskId);
                if (!targetTask) {
                    throw new Error(`Target task with ID ${targetTaskId} not found`);
                }

                const eventName = `${targetTask.description}`;
                transitions[eventName] = {
                    target: eventName,
                    guard: {
                        type: 'isValid',
                        params: { taskParameters: targetTask.transitionParameters }
                    },
                    actions: 'setCurrentTask'
                };
            }
        }

        return transitions;
    }
}
