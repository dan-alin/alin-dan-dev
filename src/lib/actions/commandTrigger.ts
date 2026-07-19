/**
 * Registers a global ⌘K / Ctrl+K keydown listener on `window` that opens the command
 * dialog. The listener is global by design, so this is a plain function meant to be
 * called inside `onMount` — not a Svelte action. Callers decide whether to register at
 * all (e.g. desktop only), so there is no `disabled` flag.
 */
export function registerCommandShortcut(onOpen: () => void): { destroy(): void } {
	let lastFired = 0;

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.repeat) return;
		if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
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
		destroy() {
			window.removeEventListener('keydown', handleKeydown);
		}
	};
}
