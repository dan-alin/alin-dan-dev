export type Theme = 'tokyonight' | 'rose-pine';

export const theme = $state<{ current: Theme }>({
	current: 'rose-pine'
});

export function setTheme(newTheme: Theme) {
	theme.current = newTheme;
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	}
}

export function toggleTheme() {
	const next = theme.current === 'rose-pine' ? 'tokyonight' : 'rose-pine';
	setTheme(next);
}

export function initTheme() {
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('theme');
		setTheme(saved as Theme);
	}
}
