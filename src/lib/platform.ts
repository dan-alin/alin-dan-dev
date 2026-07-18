export function platformModifierKey(): string {
	if (typeof navigator === 'undefined') return '⌘';
	return navigator.userAgent.includes('Win') || navigator.userAgent.includes('Linux')
		? 'Ctrl'
		: '⌘';
}
