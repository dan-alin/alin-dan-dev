function attachMouseTracker(target: HTMLElement): { destroy(): void } {
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

				target.style.setProperty('--mx', `${clampedX}%`);
				target.style.setProperty('--my', `${clampedY}%`);

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

export function trackBodyMouse(): { destroy(): void } {
	return attachMouseTracker(document.body);
}

/** Svelte action: use:mousePos — tracks mouse position on the element and unconditionally updates CSS vars. */
export function mousePos(node: HTMLElement): { destroy(): void } {
	return attachMouseTracker(node);
}
