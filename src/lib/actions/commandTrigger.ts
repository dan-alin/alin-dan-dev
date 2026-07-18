export type CommandTriggerParams = {
	onOpen: () => void;
	disabled?: boolean;
};

export function commandTrigger(
	_node: HTMLElement,
	params: CommandTriggerParams
): { update(p: CommandTriggerParams): void; destroy(): void } {
	let { onOpen, disabled = false } = params;
	let lastFired = 0;

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.repeat) return;
		if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
		if (disabled) return;
		const now = Date.now();
		if (now - lastFired < 300) return;
		lastFired = now;

		const target = e.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
			return;
		}

		e.preventDefault();
		onOpen();
	};

	window.addEventListener('keydown', handleKeydown);

	return {
		update(p: CommandTriggerParams) {
			onOpen = p.onOpen;
			disabled = p.disabled ?? false;
		},
		destroy() {
			window.removeEventListener('keydown', handleKeydown);
		}
	};
}
