<script lang="ts">
	import { browser } from '$app/environment';
	let { isOpen = $bindable(false) } = $props();
	let dialog: HTMLDialogElement;

	let originalTheme = browser ? localStorage.getItem('theme') || 'tokyonight' : 'tokyonight';
	let originalPattern = browser ? localStorage.getItem('pattern') || 'dots' : 'dots';
	let theme = $state(originalTheme);
	let pattern = $state(originalPattern);
	let saved = false;
	let isInitializing = false;

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	});

	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-pattern', pattern);
		}
	});

	function saveAndClose() {
		saved = true;
		if (browser) {
			localStorage.setItem('theme', theme);
			localStorage.setItem('pattern', pattern);
		}
		isOpen = false;
	}

	function handleClose() {
		if (!saved) {
			theme = originalTheme;
			pattern = originalPattern;
			if (browser) {
				document.documentElement.setAttribute('data-theme', originalTheme);
				document.documentElement.setAttribute('data-pattern', originalPattern);
			}
		}
		isOpen = false;
	}

	$effect(() => {
		if (isOpen) {
			isInitializing = true;
			saved = false;
			if (browser) {
				originalTheme = localStorage.getItem('theme') || 'tokyonight';
				originalPattern = localStorage.getItem('pattern') || 'dots';
				theme = originalTheme;
				pattern = originalPattern;
			}
			dialog?.showModal();
			// Focus the currently active pattern button when opened (since it's the top row)
			setTimeout(() => {
				const activeBtn =
					(dialog?.querySelector(`button[data-id="${originalPattern}"]`) as HTMLElement) ||
					(dialog?.querySelector('button') as HTMLElement);
				activeBtn?.focus();

				setTimeout(() => {
					isInitializing = false;
				}, 10);
			}, 10);
		} else {
			dialog?.close();
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;

		const active = document.activeElement as HTMLElement;
		const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

		// Allow normal typing if focused on an input
		if (isInput && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
			return;
		}

		if (!e.metaKey && !e.ctrlKey && e.key.toLowerCase() === 'w') {
			e.preventDefault();
			saveAndClose();
			return;
		}

		if (!e.metaKey && !e.ctrlKey && (e.key === 'Escape' || e.key.toLowerCase() === 'q')) {
			e.preventDefault();
			handleClose();
			return;
		}

		const lowerKey = e.key.toLowerCase();
		const code = e.code || '';

		let isArrowRight =
			e.key === 'ArrowRight' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'l' || code === 'KeyL'));
		let isArrowLeft =
			e.key === 'ArrowLeft' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'h' || code === 'KeyH'));
		let isArrowDown =
			e.key === 'ArrowDown' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'j' || code === 'KeyJ'));
		let isArrowUp =
			e.key === 'ArrowUp' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'k' || code === 'KeyK'));

		let isNav = isArrowRight || isArrowLeft || isArrowDown || isArrowUp;

		if (isNav) {
			if (isInput) {
				if (isArrowLeft || isArrowRight) return;
			}

			// Group buttons by their container rows
			const rows = Array.from(dialog.querySelectorAll<HTMLElement>('.keyboard-row'))
				.map((row) => Array.from(row.querySelectorAll<HTMLElement>('button')))
				.filter((buttons) => buttons.length > 0);

			if (rows.length === 0) return;

			e.preventDefault();

			let r = rows.findIndex((row) => row.includes(active));
			if (r === -1) {
				// If nothing is focused, focus the first element
				rows[0][0].focus();
				return;
			}

			let c = rows[r].indexOf(active);

			if (isArrowRight) {
				rows[r][(c + 1) % rows[r].length].focus();
			} else if (isArrowLeft) {
				rows[r][(c - 1 + rows[r].length) % rows[r].length].focus();
			} else if (isArrowDown) {
				let nextRow = (r + 1) % rows.length;
				let target =
					rows[nextRow].find((btn) => btn.classList.contains('text-highlight')) || rows[nextRow][0];
				target.focus();
			} else if (isArrowUp) {
				let prevRow = (r - 1 + rows.length) % rows.length;
				let target =
					rows[prevRow].find((btn) => btn.classList.contains('text-highlight')) || rows[prevRow][0];
				target.focus();
			}
		}
	}
</script>

<dialog
	bind:this={dialog}
	onclose={handleClose}
	onclick={(e) => {
		if (e.target === dialog) handleClose();
	}}
	onkeydown={handleKeydown}
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
					{#each ['dots', 'lines', 'grid'] as p (p)}
						<button
							data-id={p}
							class="no-focus-ring cursor-pointer transition-colors outline-none hover:text-highlight focus-visible:ring-0 focus-visible:ring-offset-0"
							class:text-highlight={pattern === p}
							class:text-foreground={pattern !== p}
							onfocus={() => {
								if (!isInitializing) pattern = p;
							}}
						>
							<span class={pattern === p ? '' : 'invisible'}>[</span>{p}<span
								class={pattern === p ? '' : 'invisible'}>]</span
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
					{#each [{ id: 'tokyonight', label: 'tokyonight' }, { id: 'tokyonight-light', label: 'light' }] as t (t.id)}
						<button
							data-id={t.id}
							class="no-focus-ring cursor-pointer transition-colors outline-none hover:text-highlight focus-visible:ring-0 focus-visible:ring-offset-0"
							class:text-highlight={theme === t.id}
							class:text-foreground={theme !== t.id}
							onfocus={() => {
								if (!isInitializing) theme = t.id;
							}}
						>
							<span class={theme === t.id ? '' : 'invisible'}>[</span>{t.label}<span
								class={theme === t.id ? '' : 'invisible'}>]</span
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
					onclick={saveAndClose}
				>
					<span
						class="mr-1 hidden text-icons transition-colors group-hover:text-highlight group-focus:text-highlight sm:inline"
						>[w]</span
					>save
				</button>
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
