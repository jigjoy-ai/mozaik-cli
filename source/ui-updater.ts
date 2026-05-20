import {
	Participant,
	FunctionCallItem,
	ModelMessageItem,
	BaseObserver,
} from '@mozaik-ai/core';

type Listeners = {
	onAssistantText: (text: string) => void;
	onFunctionCall?: (name: string) => void;
};

export class UIUpdater extends BaseObserver {
	constructor(private readonly listeners: Listeners) {
		super();
	}

	override onFunctionCall(item: FunctionCallItem) {
		this.listeners.onFunctionCall?.(item.toJSON()?.name ?? 'tool');
	}

	override onExternalFunctionCall(
		_source: Participant,
		item: FunctionCallItem,
	) {
		this.listeners.onFunctionCall?.(item.toJSON()?.name ?? 'tool');
	}

	override onExternalModelMessage(
		_source: Participant,
		item: ModelMessageItem,
	) {
		const text = item.content?.text ?? '';
		if (text) this.listeners.onAssistantText(text);
	}
}
