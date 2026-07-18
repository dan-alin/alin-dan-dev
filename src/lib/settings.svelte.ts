import { browser } from '$app/environment';

const THEMES = ['tokyonight', 'tokyonight-light'] as const;
const PATTERNS = ['dots', 'lines', 'grid'] as const;

export type Theme = (typeof THEMES)[number];
export type Pattern = (typeof PATTERNS)[number];

export { THEMES, PATTERNS };

function createSettings() {
	const initTheme = browser
		? ((localStorage.getItem('theme') as Theme) ?? 'tokyonight')
		: 'tokyonight';
	const initPattern = browser
		? ((localStorage.getItem('pattern') as Pattern) ?? 'dots')
		: 'dots';

	let theme = $state<Theme>(initTheme);
	let pattern = $state<Pattern>(initPattern);

	if (browser) {
		document.documentElement.setAttribute('data-theme', initTheme);
		document.documentElement.setAttribute('data-pattern', initPattern);
	}

	return {
		get theme() {
			return theme;
		},
		set theme(v: Theme) {
			if (theme === v) return;
			theme = v;
			if (browser) {
				localStorage.setItem('theme', v);
				document.documentElement.setAttribute('data-theme', v);
			}
		},
		get pattern() {
			return pattern;
		},
		set pattern(v: Pattern) {
			if (pattern === v) return;
			pattern = v;
			if (browser) {
				localStorage.setItem('pattern', v);
				document.documentElement.setAttribute('data-pattern', v);
			}
		},
		nextPattern() {
			const i = PATTERNS.indexOf(pattern);
			this.pattern = PATTERNS[(i + 1) % PATTERNS.length];
		},
		toggleTheme() {
			this.theme = theme === 'tokyonight' ? 'tokyonight-light' : 'tokyonight';
		}
	};
}

export const settings = createSettings();
