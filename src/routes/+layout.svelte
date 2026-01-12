<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { GithubIcon, LinkedinIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import { scramble } from '$lib/actions/scramble';
	import { type } from '$lib/actions/type';
	import { mousePos } from '$lib/actions/mousePosition';

	const githubUrl = 'https://github.com/dan-alin';

	let { children } = $props();

	const version = __APP_VERSION__;

	let profile = {
		section: 'whoami',
		name: 'Alin Dan',
		role: 'Frontend Engineer',
		location: 'Rome, Italy',
		build: `${version}`
	};
	let x, y;

	onMount(() => {
		const isMobile = window.matchMedia('(pointer: coarse)').matches;

		if (!isMobile) {
			const coords = mousePos(document.body, { useBody: true, useCSSVars: true });
			x = coords.x;
			y = coords.y;
		} else {
			x = 0;
			y = 0;
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="mx-auto grid w-full max-w-5xl grid-cols-1 justify-center px-6 lg:grid-cols-2 lg:justify-start xl:px-0 2xl:max-w-7xl"
>
	<aside class="flex flex-col justify-center font-doto text-foreground">
		<div class="relative flex gap-2">
			<p
				class="absolute bottom-0 -left-1 origin-bottom-left -rotate-90 font-roboto text-sm text-accent"
				use:type={{
					text: profile.section,
					getDelay: (c) => {
						return Math.random() * 100 + 50;
					}
				}}
			></p>
			<div class="flex flex-col gap-1 font-roboto">
				<h1 class="text-primary">{profile.name}</h1>
				<div class="flex gap-2">
					<span class="flex w-4 border border-white/10 background-lines"></span>
					<ul class="flex h-20 flex-col justify-between gap-2">
						<li class="flex max-w-full flex-row items-center gap-2 text-sm">
							<p
								class="font-doto"
								use:scramble={{
									text: profile.role,
									delay: 500,
									startChar: '•'
								}}
							/>
						</li>

						<li class="flex flex-row items-center gap-2 text-sm">
							<p
								class="font-doto"
								use:scramble={{ text: profile.location, delay: 500, startChar: '•' }}
							/>
						</li>
						<li class="flex flex-row items-center gap-2 text-sm">
							<a
								href={`${githubUrl}/alin-dan-dev`}
								target="_blank"
								class="font-doto text-secondary"
								use:scramble={{ text: profile.build, delay: 500, startChar: '•' }}
							/>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</aside>
	<!-- <main -->
	<!-- 	class=" flex flex-col gap-8 border border-muted bg-background background-lines p-6 text-foreground" -->
	<!-- > -->
	<!-- 	{@render children()} -->
	<!-- </main> -->
</div>
<footer class="fixed bottom-0 left-0 flex h-10 w-full items-center justify-end gap-4 px-4 text-xs">
	<div class="flex justify-center gap-2">
		<a href={githubUrl}>
			<GithubIcon
				class="size-5 text-foreground/20 transition-transform duration-300  hover:-translate-y-0.5 hover:text-foreground/80"
			/>
		</a>
		<a href="https://linkedin.com">
			<LinkedinIcon
				class="size-5 text-foreground/20 transition-transform duration-300  hover:-translate-y-0.5 hover:text-foreground/80"
			/>
		</a>
	</div>
</footer>
