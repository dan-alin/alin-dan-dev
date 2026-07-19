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
	import SettingsDialog from '$lib/components/SettingsDialog.svelte';
	import MobileSettingsBar from '$lib/components/MobileSettingsBar.svelte';
	import { registerSettingsShortcut } from '$lib/actions/settingsTrigger';
	import { platformModifierKey } from '$lib/platform';
	import { settings } from '$lib/settings.svelte';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	let isSettingsDialogOpen = $state(false);
	const modifierKey = platformModifierKey();

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });

	onMount(() => {
		if (!data.isMobile) {
			const shortcut = registerSettingsShortcut(() => (isSettingsDialogOpen = true));
			return () => shortcut.destroy();
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if data.isMobile}
	<MobileSettingsBar {settings} />
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
				onclick={() => (isSettingsDialogOpen = true)}
				aria-label="open settings"
				class="flex cursor-pointer flex-row items-center justify-center border-none bg-background text-command/80"
			>
				<kbd class="rounded-sm border border-current px-1 font-roboto text-xs">{modifierKey} K</kbd>
			</button>
		{/if}
	</div>
	<div class="flex justify-end gap-1">
		<a
			href={data.socialLinks.github}
			target="_blank"
			rel="external"
			aria-label="github profile"
			class="social-icon"
		>
			<Github class="size-full" />
		</a>
		<a
			href={data.socialLinks.linkedin}
			target="_blank"
			rel="external"
			aria-label="linkedin profile"
			class="social-icon"
		>
			<Linkedin class="size-full" />
		</a>
	</div>
</footer>

{#if !data.isMobile}
	<SettingsDialog isOpen={isSettingsDialogOpen} onClose={() => (isSettingsDialogOpen = false)} {settings} />
{/if}
