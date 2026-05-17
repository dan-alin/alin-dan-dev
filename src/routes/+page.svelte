<script lang="ts">
	import { scramble } from '$lib/actions/scramble';
	import { type } from '$lib/actions/type';
	import { mousePos } from '$lib/actions/mousePosition';
	import { MapPinned, Tag, SquareTerminal } from '@lucide/svelte/icons';
	import { onMount } from 'svelte';
	let { data } = $props();
	let profile = {
		section: 'whoami',
		name: 'Alin Dan',
		role: 'Software Engineer',
		location: 'Rome, Italy',
		build: `${__APP_VERSION__}`
	};

	onMount(() => {
		const isMobile = window.matchMedia('(pointer: coarse)').matches;

		if (!isMobile) {
			mousePos(document.body, { useBody: true, useCSSVars: true });
		}
	});
</script>

<svelte:head>
	<title>Alin Dan - Frontend Engineer</title>
	<meta name="description" content="Alin Dan - Frontend Engineer based in Rome, Italy" />
</svelte:head>

<div class="relative flex gap-2">
	<p
		class="absolute bottom-0 -left-1 origin-bottom-left -rotate-90 font-roboto text-sm text-command select-none"
		use:type={{
			text: profile.section,
			getDelay: () => {
				return Math.random() * 100 + 50;
			}
		}}
	></p>
	<div class="flex flex-col gap-1 font-roboto">
		<h1 class="text-heading">{profile.name}</h1>
		<div class="flex gap-2">
			<ul class="flex h-20 flex-col justify-between gap-2">
				<li class="flex h-5 max-w-full flex-row items-center gap-2 text-sm">
					<SquareTerminal class="size-4 text-icons" />

					<p
						use:scramble={{
							text: profile.role,
							delay: 500,
							startChar: '•'
						}}
					></p>
				</li>

				<li class="flex h-5 flex-row gap-2 text-sm">
					<MapPinned class="size-4 text-icons" />
					<p use:scramble={{ text: profile.location, delay: 500, startChar: '•' }}></p>
				</li>
				<li class="flex h-5 flex-row gap-2 text-sm">
					<Tag class="size-4 text-icons" />
					<a
						aria-label="version"
						href={`${data.githubUrl}/alin-dan-dev/releases/tag/v${profile.build}`}
						target="_blank"
						rel="external"
						class=" text-link"
						use:scramble={{ text: `${profile.build}`, delay: 500, startChar: '•' }}
					>
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
