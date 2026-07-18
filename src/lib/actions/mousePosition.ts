export type MousePositionOptions = {
	useBody?: boolean; // track mouse on body instead of element
	useCSSVars?: boolean; // update --mx / --my automatically
};

/** Svelte action: use:mousePos — tracks mouse position on the element (or body) and optionally updates CSS vars. */
export function mousePos(node: HTMLElement, options: MousePositionOptions = {}): { destroy(): void } {
	const target = options.useBody ? document.body : node;
	let ticking = false;

	const handleMouse = (e: MouseEvent) => {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(() => {
				const bounds = target.getBoundingClientRect();
				const posX = ((e.clientX - bounds.left) / bounds.width) * 100;
				const posY = ((e.clientY - bounds.top) / bounds.height) * 100;

				const clampedX = Math.max(0, Math.min(posX, 100));
				const clampedY = Math.max(0, Math.min(posY, 100));

				if (options.useCSSVars) {
					target.style.setProperty('--mx', `${clampedX}%`);
					target.style.setProperty('--my', `${clampedY}%`);
				}

				ticking = false;
			});
		}
	};

	target.addEventListener('mousemove', handleMouse);

	return {
		destroy() {
			target.removeEventListener('mousemove', handleMouse);
		}
	};
}
