export interface GridNavOptions {
	rowSelector?: string;
	itemSelector?: string;
	activeSelector?: string;
}

/** Svelte action: use:gridNav — HJKL/arrow key grid navigation over `.keyboard-row` button groups. */
export function gridNav(
	node: HTMLElement,
	options: GridNavOptions = {}
): { destroy(): void } {
	const {
		rowSelector = '.keyboard-row',
		itemSelector = 'button',
		activeSelector = '.text-highlight'
	} = options;

	function handleKeydown(e: KeyboardEvent) {
		const active = document.activeElement as HTMLElement;
		const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

		if (isInput && e.key.length === 1 && !e.ctrlKey && !e.metaKey) return;

		const lowerKey = e.key.toLowerCase();
		const code = e.code || '';

		const isArrowRight =
			e.key === 'ArrowRight' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'l' || code === 'KeyL'));
		const isArrowLeft =
			e.key === 'ArrowLeft' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'h' || code === 'KeyH'));
		const isArrowDown =
			e.key === 'ArrowDown' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'j' || code === 'KeyJ'));
		const isArrowUp =
			e.key === 'ArrowUp' || (!e.metaKey && !e.ctrlKey && (lowerKey === 'k' || code === 'KeyK'));

		if (!isArrowRight && !isArrowLeft && !isArrowDown && !isArrowUp) return;

		if (isInput && (isArrowLeft || isArrowRight)) return;

		const rows = Array.from(node.querySelectorAll<HTMLElement>(rowSelector))
			.map((row) => Array.from(row.querySelectorAll<HTMLElement>(itemSelector)))
			.filter((items) => items.length > 0);

		if (rows.length === 0) return;

		e.preventDefault();

		const rowIdx = rows.findIndex((row) => row.includes(active));
		if (rowIdx === -1) {
			rows[0][0].focus();
			return;
		}

		const colIdx = rows[rowIdx].indexOf(active);

		if (isArrowRight) {
			rows[rowIdx][(colIdx + 1) % rows[rowIdx].length].focus();
		} else if (isArrowLeft) {
			rows[rowIdx][(colIdx - 1 + rows[rowIdx].length) % rows[rowIdx].length].focus();
		} else if (isArrowDown) {
			const nextRow = (rowIdx + 1) % rows.length;
			const target =
				rows[nextRow].find((btn) => btn.matches(activeSelector)) ?? rows[nextRow][0];
			target.focus();
		} else if (isArrowUp) {
			const prevRow = (rowIdx - 1 + rows.length) % rows.length;
			const target =
				rows[prevRow].find((btn) => btn.matches(activeSelector)) ?? rows[prevRow][0];
			target.focus();
		}
	}

	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
		}
	};
}
