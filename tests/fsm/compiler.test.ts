/**
 * FSM Compiler Tests
 *
 * Tests the FSM compiler functionality including:
 * - Machine compilation from ConversationalFlowVersion
 * - State generation from tasks
 * - Transition generation with guards
 * - Parameter validation in guards
 */

import { describe, it, expect } from 'vitest';
import { FSMCompiler } from '../../src/fsm/compiler.js';
import { createActor } from 'xstate';
import type { ConversationalFlowVersion, MemoryParameters } from '../../src/models/index.js';

describe('FSMCompiler', () => {
  describe('Constructor validation', () => {
    it('should throw error when version is draft', () => {
      const draftVersion: ConversationalFlowVersion = {
        draft: true
      };

      expect(() => new FSMCompiler(draftVersion)).toThrow(
        'Cannot compile FSM from draft ConversationalFlowVersion'
      );
    });

    it('should accept non-draft version', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      expect(() => new FSMCompiler(version)).not.toThrow();
    });
  });

  describe('compile()', () => {
    it('should throw error when firstTask is not found', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [],
        firstTask: 'nonexistent',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      expect(() => compiler.compile()).toThrow('First task not found in tasks list');
    });

    it('should compile a simple FSM with one task', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'welcome',
            prompt: 'Welcome the user',
            transitionParameters: [],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();

      expect(machine).toBeDefined();
      expect(machine.id).toBe('flow_flow1_v_version1');
    });

    it('should compile FSM with multiple tasks and transitions', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'prestazione',
            prompt: 'Search for service',
            transitionParameters: [],
            connectedTasks: ['task2', 'task3'],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          },
          {
            _id: 'task2',
            type: 'AIO',
            description: 'prenotazione',
            prompt: 'Book appointment',
            transitionParameters: [
              { variableId: 'idPrestazione', required: true }
            ],
            connectedTasks: [],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          },
          {
            _id: 'task3',
            type: 'AIO',
            description: 'cancellazione',
            prompt: 'Cancel appointment',
            transitionParameters: [
              { variableId: 'idPrestazione', required: true }
            ],
            connectedTasks: [],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();

      expect(machine).toBeDefined();

      // Create actor to test the machine
      const actor = createActor(machine, {
        input: {
          conversationId: 'conv1',
          contactId: 'contact1',
          currentTask: 'prestazione',
          channel: 'phone'
        }
      });

      actor.start();
      const snapshot = actor.getSnapshot();

      // Verify initial state
      expect(snapshot.value).toBe('prestazione');
      expect(snapshot.context.conversationId).toBe('conv1');
      expect(snapshot.context.contactId).toBe('contact1');
      expect(snapshot.context.currentTask).toBe('prestazione');
      expect(snapshot.context.channel).toBe('phone');
    });

    it('should include correct metadata in states', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'welcome',
            prompt: 'Welcome prompt',
            transitionParameters: [],
            mcpToolSelection: [
              {
                mcpServerName: 'server1',
                selectedTools: []
              }
            ],
            hideTranscriptionToHuman: true,
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();

      const actor = createActor(machine);
      actor.start();
      const snapshot = actor.getSnapshot();

      expect(snapshot.getMeta()).toEqual({
        'flow_flow1_v_version1.welcome': {
          taskId: 'task1',
          type: 'AIO',
          prompt: 'Welcome prompt',
          mcpToolSelection: [
            {
              mcpServerName: 'server1',
              selectedTools: []
            }
          ],
          hideTranscriptionToHuman: true
        }
      });
    });

    it('should include routingParameters for HUM tasks', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'HUM',
            description: 'operatore',
            prompt: 'Transfer to operator',
            transitionParameters: [],
            routingParameters: {
              timeout: 30,
              agentSkills: ['support']
            },
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();

      const actor = createActor(machine);
      actor.start();
      const snapshot = actor.getSnapshot();

      expect(snapshot.getMeta()).toEqual({
        'flow_flow1_v_version1.operatore': {
          taskId: 'task1',
          type: 'HUM',
          prompt: 'Transfer to operator',
          mcpToolSelection: undefined,
          routingParameters: {
            timeout: 30,
            agentSkills: ['support']
          }
        }
      });
    });
  });

  describe('Guard validation', () => {
    it('should allow transition when all required parameters are present', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'prestazione',
            prompt: 'Search service',
            transitionParameters: [],
            connectedTasks: ['task2'],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          },
          {
            _id: 'task2',
            type: 'AIO',
            description: 'prenotazione',
            prompt: 'Book appointment',
            transitionParameters: [
              { variableId: 'idPrestazione', required: true }
            ],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();
      const actor = createActor(machine);
      actor.start();

      // Mock memory with required parameter
      const memoryParameters: Record<string, MemoryParameters> = {
        idPrestazione: {
          updatedBy: 'tool',
          updatedAt: '2025-01-01T00:00:00Z',
          type: 'string',
          contactId: 'contact1',
          value: 'PREST123',
          descriptionForLLM: null
        }
      };

      let validationError: string | null = null;
      const setTaskValidationError = (msg: string) => {
        validationError = msg;
      };

      actor.send({
        type: 'prenotazione',
        memoryParameters,
        setTaskValidationError
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('prenotazione');
      expect(validationError).toBeNull();
    });

    it('should block transition when required parameter is missing', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'prestazione',
            prompt: 'Search service',
            transitionParameters: [],
            connectedTasks: ['task2'],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          },
          {
            _id: 'task2',
            type: 'AIO',
            description: 'prenotazione',
            prompt: 'Book appointment',
            transitionParameters: [
              { variableId: 'idPrestazione', required: true }
            ],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();
      const actor = createActor(machine);
      actor.start();

      // Empty memory - missing required parameter
      const memoryParameters: Record<string, MemoryParameters> = {};

      let validationError: string | null = null;
      const setTaskValidationError = (msg: string) => {
        validationError = msg;
      };

      actor.send({
        type: 'prenotazione',
        memoryParameters,
        setTaskValidationError
      });

      const snapshot = actor.getSnapshot();

      // Should remain in prestazione state
      expect(snapshot.value).toBe('prestazione');
      expect(validationError).toBe('Missing the required parameter: idPrestazione');
    });

    it('should allow transition when non-required parameter is missing', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'prestazione',
            prompt: 'Search service',
            transitionParameters: [],
            connectedTasks: ['task2'],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          },
          {
            _id: 'task2',
            type: 'AIO',
            description: 'prenotazione',
            prompt: 'Book appointment',
            transitionParameters: [
              { variableId: 'idPrestazione', required: false }
            ],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();
      const actor = createActor(machine);
      actor.start();

      const memoryParameters: Record<string, MemoryParameters> = {};

      let validationError: string | null = null;
      const setTaskValidationError = (msg: string) => {
        validationError = msg;
      };

      actor.send({
        type: 'prenotazione',
        memoryParameters,
        setTaskValidationError
      });

      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe('prenotazione');
      expect(validationError).toBeNull();
    });
  });

  describe('Context updates', () => {
    it('should update currentTask on transition', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'prestazione',
            prompt: 'Search service',
            transitionParameters: [],
            connectedTasks: ['task2'],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          },
          {
            _id: 'task2',
            type: 'AIO',
            description: 'prenotazione',
            prompt: 'Book appointment',
            transitionParameters: [],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      const machine = compiler.compile();
      const actor = createActor(machine);
      actor.start();

      expect(actor.getSnapshot().context.currentTask).toBe('prestazione');

      actor.send({
        type: 'prenotazione',
        memoryParameters: {},
        setTaskValidationError: () => {}
      });

      expect(actor.getSnapshot().context.currentTask).toBe('prenotazione');
    });
  });

  describe('Error handling', () => {
    it('should throw error when target task in connectedTasks is not found', () => {
      const version: ConversationalFlowVersion = {
        draft: false,
        _id: 'version1',
        schemaVersion: '1.0.0',
        conversationalFlowId: 'flow1',
        globalPrompt: 'Global prompt',
        channels: ['phone'],
        mandatoryChannels: [],
        closureConfig: { multiContact: false },
        mediaConfig: {
          audio: {
            presetId: 'default',
            llm: { provider: 'openai', model: 'gpt-4', temperature: 0.7 },
            stt: { default: { provider: 'google' }, fallback: { provider: 'deepgram' } },
            tts: { default: { provider: 'google', voice: 'en-US-Standard-A' }, fallback: { provider: 'google', voice: 'en-US-Standard-B' } },
            vad: {},
            allowInterruptionsOnStart: true,
            allowInterruptions: true,
            enableRecording: false,
            userInteractionTimeout: 20,
            preemptiveGeneration: false
          },
          text: {}
        },
        defaultLanguage: 'it-IT',
        supportedLanguages: ['it-IT'],
        systemPromptsLanguage: 'it-IT',
        apiVersion: 'v1',
        variables: [],
        uiMetadata: {},
        mcpServers: [],
        aiHelpers: [],
        tasks: [
          {
            _id: 'task1',
            type: 'AIO',
            description: 'prestazione',
            prompt: 'Search service',
            transitionParameters: [],
            connectedTasks: ['nonexistent'],
            closureConfig: { multiContact: false },
            enabledCheckpoints: []
          }
        ],
        firstTask: 'task1',
        checkpoints: [],
        reasonsOfContact: [],
        results: [],
        createdBy: 'test',
        createdAt: '2025-01-01T00:00:00Z'
      };

      const compiler = new FSMCompiler(version);
      expect(() => compiler.compile()).toThrow('Target task with ID nonexistent not found');
    });
  });
});
