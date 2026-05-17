<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Github from '$lib/components/icons/Github.svelte';
	import Linkedin from '$lib/components/icons/Linkedin.svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	let { children, data } = $props();

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });
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
