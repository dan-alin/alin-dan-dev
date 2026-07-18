<script lang="ts">
	import { PATTERNS, THEMES, type Pattern, type Theme } from '$lib/settings.svelte';
	import { gridNav } from '$lib/actions/gridNav';

	interface Settings {
		pattern: Pattern;
		theme: Theme;
	}

	let { isOpen = $bindable(false), settings }: { isOpen?: boolean; settings: Settings } = $props();
	let dialog: HTMLDialogElement;

	// Theme label is the variant suffix (e.g. 'tokyonight-light' -> 'light'),
	// or the full id when there is no variant. Keeps the dialog data-driven from THEMES.
	const themeLabel = (t: Theme) => t.split('-').slice(1).join('-') || t;

	function handleClose() {
		isOpen = false;
	}

	$effect(() => {
		if (isOpen) {
			dialog
				?.querySelectorAll<HTMLElement>('[data-id]')
				.forEach((b) => b.removeAttribute('autofocus'));
			dialog
				?.querySelector<HTMLElement>(`[data-id="${settings.pattern}"]`)
				?.setAttribute('autofocus', '');
			dialog?.showModal();
		} else {
			dialog?.close();
		}
	});

	function handleQuit(e: KeyboardEvent) {
		if (!isOpen) return;
		const active = document.activeElement as HTMLElement;
		const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
		if (isInput && e.key.length === 1 && !e.ctrlKey && !e.metaKey) return;
		if (!e.metaKey && !e.ctrlKey && (e.key === 'Escape' || e.key.toLowerCase() === 'q')) {
			e.preventDefault();
			handleClose();
		}
	}
</script>

<dialog
	bind:this={dialog}
	use:gridNav={{ rowSelector: '.keyboard-row', itemSelector: 'button', activeSelector: '.text-highlight' }}
	onclose={handleClose}
	onclick={(e) => {
		if (e.target === dialog) handleClose();
	}}
	onkeydown={handleQuit}
	class="fixed top-1/2 left-1/2 m-0 h-100 w-150 max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-outlines bg-background p-6 font-roboto text-foreground shadow-none ring-0 transition-all duration-300 outline-none backdrop:bg-transparent focus:outline-none"
>
	<div class="flex h-full flex-col gap-4">
		<div class="mx-auto flex items-center gap-2 text-sm font-bold text-command uppercase">
			settings
		</div>

		<div class="mt-2 flex flex-col gap-2">
			<div class="group flex items-center gap-4 text-sm">
				<span
					class="hidden w-20 text-foreground/60 transition-colors group-focus-within:text-foreground sm:block"
					>pattern</span
				>
				<div class="keyboard-row flex gap-4">
					{#each PATTERNS as p (p)}
						<button
							data-id={p}
							class="no-focus-ring cursor-pointer transition-colors outline-none hover:text-highlight focus-visible:ring-0 focus-visible:ring-offset-0"
							class:text-highlight={settings.pattern === p}
							class:text-foreground={settings.pattern !== p}
							onfocus={() => {
								settings.pattern = p;
							}}
						>
							<span class={settings.pattern === p ? '' : 'invisible'}>[</span>{p}<span
								class={settings.pattern === p ? '' : 'invisible'}>]</span
							>
						</button>
					{/each}
				</div>
			</div>

			<div class="group mt-2 flex items-center gap-4 text-sm">
				<span
					class="hidden w-20 text-foreground/60 transition-colors group-focus-within:text-foreground sm:block"
					>theme</span
				>
				<div class="keyboard-row flex gap-4">
					{#each THEMES as t (t)}
						<button
							data-id={t}
							class="no-focus-ring cursor-pointer transition-colors outline-none hover:text-highlight focus-visible:ring-0 focus-visible:ring-offset-0"
							class:text-highlight={settings.theme === t}
							class:text-foreground={settings.theme !== t}
							onfocus={() => {
								settings.theme = t;
							}}
						>
							<span class={settings.theme === t ? '' : 'invisible'}>[</span>{themeLabel(t)}<span
								class={settings.theme === t ? '' : 'invisible'}>]</span
							>
						</button>
					{/each}
				</div>
			</div>
			<div class="group mt-6 flex justify-center text-sm">
				<div class="grid grid-cols-4 gap-x-6 gap-y-3">
					{#each [{ bg: 'bg-background', label: '--bg' }, { bg: 'bg-foreground', label: '--fg' }, { bg: 'bg-command', label: '--command' }, { bg: 'bg-heading', label: '--heading' }, { bg: 'bg-link', label: '--link' }, { bg: 'bg-icons', label: '--icons' }, { bg: 'bg-highlight', label: '--highlight' }, { bg: 'bg-outlines', label: '--outlines' }] as color (color.bg)}
						<div class="flex items-center gap-2">
							<div class="size-3.5 rounded-xs border border-outlines/30 {color.bg}"></div>
							<span class="hidden text-xs text-foreground/60 sm:block">{color.label}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-auto flex justify-center pb-2 text-sm text-icons">
			<div class="keyboard-row flex gap-8">
				<button
					class="group no-focus-ring cursor-pointer text-foreground transition-colors outline-none hover:text-highlight focus:text-highlight focus-visible:ring-0 focus-visible:ring-offset-0"
					onclick={handleClose}
				>
					<span
						class="mr-1 hidden text-icons transition-colors group-hover:text-highlight group-focus:text-highlight sm:inline"
						>[q]</span
					>quit
				</button>
			</div>
		</div>
	</div>
</dialog>
