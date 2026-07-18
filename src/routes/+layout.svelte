<script lang="ts">
	import '@fontsource-variable/doto';
	import '@fontsource-variable/roboto-mono';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Github from '$lib/components/icons/Github.svelte';
	import Linkedin from '$lib/components/icons/Linkedin.svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { onMount, type Component } from 'svelte';
	import { Sun, Moon, LayoutGrid } from '@lucide/svelte';
	import { settings } from '$lib/settings.svelte';

	let { children, data } = $props();
	let isCommandDialogOpen = $state(false);
	let modifierKey = $state('⌘');

	let CommandDialogComponent: Component<any> | undefined = $state();

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	onMount(() => {
		if (navigator.userAgent.indexOf('Win') !== -1 || navigator.userAgent.indexOf('Linux') !== -1) {
			modifierKey = 'Ctrl';
		}

		if (!data.isMobile) {
			import('$lib/components/CommandDialog.svelte').then((m) => {
				CommandDialogComponent = m.default;
			});
		}

		const handleKeydown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				if (data.isMobile) return;

				const target = e.target as HTMLElement;
				if (
					!isCommandDialogOpen &&
					(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
				) {
					return;
				}
				e.preventDefault();
				isCommandDialogOpen = !isCommandDialogOpen;
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if data.isMobile}
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
{/if}

<div
	class="mx-auto grid min-h-dvh w-full max-w-5xl grid-cols-1 items-center justify-center p-4 px-6 text-foreground selection:bg-highlight selection:text-txt-highlight! lg:grid-cols-2 lg:justify-start xl:px-0 2xl:max-w-7xl"
>
	<main class="flex flex-col justify-center px-6">
		{@render children()}
	</main>
</div>

<footer
	class="fixed bottom-0 left-0 flex h-10 w-full items-center justify-center gap-4 px-4 text-xs sm:justify-between"
>
	<div class="flex justify-start gap-1">
		{#if !data.isMobile}
			<button
				onclick={() => (isCommandDialogOpen = true)}
				aria-label="open settings"
				class="flex cursor-pointer flex-row items-center justify-center border-none bg-background text-command/80"
			>
				<kbd class="rounded-sm border border-current px-1 font-roboto text-xs">{modifierKey} K</kbd>
			</button>
		{/if}
	</div>
	<div class="flex justify-end gap-1">
		<a
			href={data.githubUrl}
			target="_blank"
			rel="external"
			aria-label="github profile"
			class="social-icon"
		>
			<Github class="size-full" />
		</a>
		<a
			href={data.linkedinUrl}
			target="_blank"
			rel="external"
			aria-label="linkedin profile"
			class="social-icon"
		>
			<Linkedin class="size-full" />
		</a>
	</div>
</footer>

{#if CommandDialogComponent}
	<CommandDialogComponent bind:isOpen={isCommandDialogOpen} />
{/if}
