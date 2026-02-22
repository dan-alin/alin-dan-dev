<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { GithubIcon, LinkedinIcon } from 'lucide-svelte';

	let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="selection:text-txt--highlight! mx-auto grid min-h-dvh w-full max-w-5xl grid-cols-1 items-center justify-center p-4 px-6 text-foreground selection:bg-highlight lg:grid-cols-2 lg:justify-start xl:px-0 2xl:max-w-7xl"
>
	<main class="flex flex-col justify-center px-6">
		{@render children()}
	</main>
</div>

<footer class="fixed bottom-0 left-0 flex h-10 w-full items-center justify-end gap-4 px-4 text-xs">
	<div class="flex justify-center gap-2">
		<a href={data.githubUrl} target="_blank" rel="external" aria-label="github profile">
			<GithubIcon
				class="size-5 text-foreground/20 transition-transform duration-300 hover:-translate-y-0.5   hover:text-foreground/80"
			/>
		</a>
		<a href={data.linkedinUrl} target="_blank" rel="external" aria-label="linkedin profile">
			<LinkedinIcon
				class="size-5 text-foreground/20 transition-transform duration-300 hover:-translate-y-0.5   hover:text-foreground/80"
			/>
		</a>
	</div>
</footer>
