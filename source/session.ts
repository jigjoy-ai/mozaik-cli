import {
	AgenticEnvironment,
	Gpt54,
	ModelContext,
	OpenAIInferenceRunner,
	DefaultFunctionCallRunner,
	BaseHuman,
} from '@mozaik-ai/core';
import {terminalTools} from './terminal/tools.js';
import {TerminalAgent} from './terminal/agent.js';
import {UIUpdater} from './ui-updater.js';

export type AgentSession = {
	send: (message: string) => void;
};

export type AgentListeners = {
	onAssistantText: (text: string) => void;
	onFunctionCall?: (name: string) => void;
};

export function createAgentSession(listeners: AgentListeners): AgentSession {
	const functionCallRunner = new DefaultFunctionCallRunner([...terminalTools]);
	const inferenceRunner = new OpenAIInferenceRunner();

	const context = ModelContext.create('cli-agent');
	const model = new Gpt54();
	model.setTools([...terminalTools]);

	const environment = new AgenticEnvironment();
	const agent = new TerminalAgent(
		inferenceRunner,
		functionCallRunner,
		environment,
		context,
		model,
	);
	const uiUpdater = new UIUpdater(listeners);
	const user = new BaseHuman();

	agent.join(environment);
	uiUpdater.join(environment);
	user.join(environment);
	environment.start();

	return {
		send: (message: string) => user.sendMessage(environment, message),
	};
}
