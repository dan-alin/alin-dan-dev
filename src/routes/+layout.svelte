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
	import CommandDialog from '$lib/components/CommandDialog.svelte';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	let isCommandDialogOpen = $state(false);

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	onMount(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === ':' && !isCommandDialogOpen) {
				const target = e.target as HTMLElement;
				if (
					target.tagName === 'INPUT' ||
					target.tagName === 'TEXTAREA' ||
					target.isContentEditable
				) {
					return;
				}
				e.preventDefault();
				isCommandDialogOpen = true;
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

 <svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="mx-auto grid min-h-dvh w-full max-w-5xl grid-cols-1 items-center justify-center p-4 px-6 text-foreground selection:bg-highlight selection:text-txt-highlight! lg:grid-cols-2 lg:justify-start xl:px-0 2xl:max-w-7xl"
>
	<main class="flex flex-col justify-center px-6">
		{@render children()}
	</main>
</div>

<footer class="fixed bottom-0 left-0 flex h-10 w-full items-center justify-end gap-4 px-4 text-xs">
	<div class="flex justify-center gap-1">
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

<CommandDialog bind:isOpen={isCommandDialogOpen} />
