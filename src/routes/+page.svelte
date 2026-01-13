<script lang="ts">
	import { scramble } from '$lib/actions/scramble';
	import { type } from '$lib/actions/type';
	import { mousePos } from '$lib/actions/mousePosition';
	import { SquareTerminalIcon, MapPinnedIcon, TagIcon } from 'lucide-svelte';

	import { onMount } from 'svelte';

	let { data } = $props();

	const version = __APP_VERSION__;
	let profile = {
		section: 'whoami',
		name: 'Alin Dan',
		role: 'Frontend Engineer',
		location: 'Rome, Italy',
		build: `${version}`
	};

	onMount(() => {
		const isMobile = window.matchMedia('(pointer: coarse)').matches;

		if (!isMobile) {
			mousePos(document.body, { useBody: true, useCSSVars: true });
		}
	});
</script>

<div class="relative flex gap-2">
	<p
		class="absolute bottom-0 -left-1 origin-bottom-left -rotate-90 font-roboto text-sm text-command"
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
					<SquareTerminalIcon class="size-4 text-icons" />

					<p
						use:scramble={{
							text: profile.role,
							delay: 500,
							startChar: '•'
						}}
					></p>
				</li>

				<li class="flex h-5 flex-row gap-2 text-sm">
					<MapPinnedIcon class="size-4 text-icons" />
					<p use:scramble={{ text: profile.location, delay: 500, startChar: '•' }}></p>
				</li>
				<li class="flex h-5 flex-row gap-2 text-sm">
					<TagIcon class="size-4 text-icons" />
					<a
						aria-label="version"
						href={`${data.githubUrl}/alin-dan-dev`}
						target="_blank"
						rel="external"
						class=" text-link"
						use:scramble={{ text: `v_${profile.build}`, delay: 500, startChar: '•' }}
					>
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
