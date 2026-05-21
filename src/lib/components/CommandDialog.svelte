<script lang="ts">
	import { browser } from '$app/environment';
	let { isOpen = $bindable(false) } = $props();
	let dialog: HTMLDialogElement;

	let originalTheme = 'tokyonight';
	let originalPattern = 'dots';
	let theme = $state('tokyonight');
	let pattern = $state('dots');
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
			saved = false;
			isInitializing = true;
			if (browser) {
				originalTheme = localStorage.getItem('theme') || 'tokyonight';
				originalPattern = localStorage.getItem('pattern') || 'dots';
				theme = originalTheme;
				pattern = originalPattern;
			}
			dialog?.showModal();
			// Focus the currently active pattern button when opened (since it's the top row)
			setTimeout(() => {
				const activeBtn = dialog?.querySelector(`button[data-id="${originalPattern}"]`) as HTMLElement || dialog?.querySelector('button') as HTMLElement;
				activeBtn?.focus();
				isInitializing = false;
			}, 10);
		} else {
			dialog?.close();
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;

		if (e.key.toLowerCase() === 'w') {
			e.preventDefault();
			saveAndClose();
			return;
		}

		if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
			e.preventDefault();
			handleClose();
			return;
		}

		if (e.key.startsWith('Arrow')) {
			const active = document.activeElement as HTMLElement;
			if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
				if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
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

			if (e.key === 'ArrowRight') {
				rows[r][(c + 1) % rows[r].length].focus();
			} else if (e.key === 'ArrowLeft') {
				rows[r][(c - 1 + rows[r].length) % rows[r].length].focus();
			} else if (e.key === 'ArrowDown') {
				let nextRow = (r + 1) % rows.length;
				let target = rows[nextRow].find(btn => btn.classList.contains('text-highlight')) || rows[nextRow][0];
				target.focus();
			} else if (e.key === 'ArrowUp') {
				let prevRow = (r - 1 + rows.length) % rows.length;
				let target = rows[prevRow].find(btn => btn.classList.contains('text-highlight')) || rows[prevRow][0];
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
	class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 h-100 w-150 max-w-[90vw] rounded-xl border border-outlines bg-background p-6 shadow-none ring-0 transition-all duration-300 outline-none backdrop:bg-transparent focus:outline-none text-foreground font-roboto"
>
	<div class="flex flex-col gap-4 h-full">
		<div class="flex items-center gap-2 text-command text-sm font-bold">
			<span class="text-icons">~</span> /settings $
		</div>
		
		<div class="flex flex-col gap-2 mt-2">
			<div class="group flex items-center gap-4 text-sm">
				<span class="text-icons group-focus-within:text-foreground transition-colors w-20">pattern</span>
				<div class="keyboard-row flex gap-4">
					<button
						data-id="dots"
						class="hover:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
						class:text-highlight={pattern === 'dots'}
						class:text-foreground={pattern !== 'dots'}
						onfocus={() => { if (!isInitializing) pattern = 'dots'; }}
					>
						<span class={pattern === 'dots' ? '' : 'invisible'}>[</span>dots<span class={pattern === 'dots' ? '' : 'invisible'}>]</span>
					</button>
					<button
						data-id="lines"
						class="hover:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
						class:text-highlight={pattern === 'lines'}
						class:text-foreground={pattern !== 'lines'}
						onfocus={() => { if (!isInitializing) pattern = 'lines'; }}
					>
						<span class={pattern === 'lines' ? '' : 'invisible'}>[</span>lines<span class={pattern === 'lines' ? '' : 'invisible'}>]</span>
					</button>
					<button
						data-id="grid"
						class="hover:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
						class:text-highlight={pattern === 'grid'}
						class:text-foreground={pattern !== 'grid'}
						onfocus={() => { if (!isInitializing) pattern = 'grid'; }}
					>
						<span class={pattern === 'grid' ? '' : 'invisible'}>[</span>grid<span class={pattern === 'grid' ? '' : 'invisible'}>]</span>
					</button>
				</div>
			</div>

			<div class="group flex items-center gap-4 text-sm mt-2">
				<span class="text-icons group-focus-within:text-foreground transition-colors w-20">theme</span>
				<div class="keyboard-row flex gap-4">
					<button
						data-id="tokyonight"
						class="hover:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
						class:text-highlight={theme === 'tokyonight'}
						class:text-foreground={theme !== 'tokyonight'}
						onfocus={() => { if (!isInitializing) theme = 'tokyonight'; }}
					>
						<span class={theme === 'tokyonight' ? '' : 'invisible'}>[</span>dark<span class={theme === 'tokyonight' ? '' : 'invisible'}>]</span>
					</button>
					<button
						data-id="tokyonight-light"
						class="hover:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
						class:text-highlight={theme === 'tokyonight-light'}
						class:text-foreground={theme !== 'tokyonight-light'}
						onfocus={() => { if (!isInitializing) theme = 'tokyonight-light'; }}
					>
						<span class={theme === 'tokyonight-light' ? '' : 'invisible'}>[</span>light<span class={theme === 'tokyonight-light' ? '' : 'invisible'}>]</span>
					</button>
				</div>
			</div>
			<div class="group flex justify-center text-sm mt-6">
				<div class="grid grid-cols-4 gap-x-6 gap-y-3">
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-background border border-outlines/30"></div>
						<span class="text-xs text-icons">--bg</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-foreground border border-outlines/30"></div>
						<span class="text-xs text-icons">--fg</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-command border border-outlines/30"></div>
						<span class="text-xs text-icons">--command</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-heading border border-outlines/30"></div>
						<span class="text-xs text-icons">--heading</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-link border border-outlines/30"></div>
						<span class="text-xs text-icons">--link</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-icons border border-outlines/30"></div>
						<span class="text-xs text-icons">--icons</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-highlight border border-outlines/30"></div>
						<span class="text-xs text-icons">--highlight</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="size-3.5 rounded-xs bg-outlines border border-outlines/30"></div>
						<span class="text-xs text-icons">--outlines</span>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-auto flex justify-center text-sm pb-2 text-icons">
			<div class="keyboard-row flex gap-8">
				<button
					class="text-foreground hover:text-highlight focus:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
					onclick={saveAndClose}
				>
					[w] write
				</button>
				<button
					class="text-foreground hover:text-highlight focus:text-highlight transition-colors cursor-pointer outline-none focus-visible:ring-0 focus-visible:ring-offset-0 no-focus-ring"
					onclick={handleClose}
				>
					[q] quit
				</button>
			</div>
		</div>
	</div>
</dialog>
