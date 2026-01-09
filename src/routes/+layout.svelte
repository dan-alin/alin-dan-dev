<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import {
		CopyrightIcon,
		GithubIcon,
		LinkedinIcon,
		MapPinIcon,
		MoonIcon,
		TerminalIcon
	} from 'lucide-svelte';

	let { children } = $props();

	import { onMount } from 'svelte';

	let text = '// Pixels, Logic, and a bit of Magic';

	let output = $state(' ');

	function delayForChar(char: string) {
		if (char === '.' || char === ',' || char === '!' || char === '?') {
			return 300; // longer pause
		}
		if (char === ' ') {
			return 40; // short pause for spaces
		}
		return Math.random() * 60 + 20; // random typing speed
	}

	async function type() {
		for (let i = 0; i < text.length; i++) {
			output += text[i];
			await new Promise((r) => setTimeout(r, delayForChar(text[i])));
		}
	}

	onMount(() => {
		type();
		document.addEventListener('mousemove', (e) => {
			const x = (e.clientX / window.innerWidth) * 100;
			const y = (e.clientY / window.innerHeight) * 100;

			document.body.style.setProperty('--mx', `${x}%`);
			document.body.style.setProperty('--my', `${y}%`);
		});
	});

	let time = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	// Formatter for your specific location
	const formatter = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Rome', // Change to your timezone
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="mx-auto grid w-full max-w-5xl px-6 xl:px-0 2xl:max-w-7xl">
	<aside class="flex flex-col justify-center bg-background p-4 font-doto text-foreground">
		<h1 class="text-2xl text-foreground/40">{output}</h1>
		<div class=" gap-2">
			<h1 class="text-secondary">Alin Dan</h1>
			<div class="flex flex-row items-center gap-2">
				<MapPinIcon class="size-4 text-foreground/60" />
				<p class="font-doto">Front End Engineer</p>
			</div>

			<div class="flex flex-row items-center gap-2">
				<MapPinIcon class="size-4 text-foreground/60" />
				<p class="font-doto">Rome</p>
			</div>
			<div class="flex flex-row items-center gap-2">
				<MapPinIcon class="size-4 text-foreground/60" />
				<p class="font-doto">{formatter.format(time)}</p>
			</div>
		</div>
	</aside>
	<!-- <main -->
	<!-- 	class=" flex flex-col gap-8 border border-muted bg-background background-lines p-6 text-foreground" -->
	<!-- > -->
	<!-- 	{@render children()} -->
	<!-- </main> -->
</div>
<footer class="fixed bottom-0 left-0 grid h-10 w-full grid-cols-3 items-center gap-4 px-4 text-xs">
	<p class="flex items-center gap-2 text-foreground/20">
		<CopyrightIcon class="size-3 " /> 2026 Alin Dan.
	</p>

	<div class="flex flex-row justify-center gap-2">
		<a href="https://github.com">
			<GithubIcon
				class="size-6 text-foreground/20 transition-transform duration-300  hover:-translate-y-0.5 hover:text-foreground/80"
			/>
		</a>
		<LinkedinIcon
			class="size-6 text-foreground/20 transition-transform duration-300  hover:-translate-y-0.5 hover:text-foreground/80"
		/>
	</div>
	<div class="flex justify-end">
		<TerminalIcon class="size-6   text-foreground/20 transition-transform   duration-300 " />
	</div>
</footer>
