<script lang="ts">
	import type { Theme } from '$lib/settings.svelte';
	import { Sun, Moon, LayoutGrid } from '@lucide/svelte';

	interface Settings {
		theme: Theme;
		toggleTheme(): void;
		nextPattern(): void;
	}

	let { settings }: { settings: Settings } = $props();
</script>

<header class="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-start gap-2 px-4">
	<button onclick={() => settings.toggleTheme()} aria-label="toggle theme" class="social-icon">
		{#if settings.theme === 'tokyonight'}
			<Moon class="size-full" />
		{:else}
			<Sun class="size-full" />
		{/if}
	</button>
	<button onclick={() => settings.nextPattern()} aria-label="toggle pattern" class="social-icon">
		<LayoutGrid class="size-full" />
	</button>
</header>
