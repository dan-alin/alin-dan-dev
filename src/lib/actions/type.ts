type TypeOptions = {
	text: string;
	delay?: number; // fallback delay per char
	getDelay?: (char: string, index: number) => number;
	cursor?: boolean;
};

export function type(node: HTMLElement, options: TypeOptions) {
	let { text, delay = 80, getDelay, cursor = false } = options;

	let timeout: number | undefined;
	let currentIndex = 0;
	let cancelled = false;

	function stop() {
		cancelled = true;
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	}

	function start() {
		stop();
		cancelled = false;
		currentIndex = 0;
		node.textContent = '';

		// Respect reduced motion
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			node.textContent = text;
			return;
		}

		const typeNext = () => {
			if (cancelled) return;

			if (currentIndex < text.length) {
				node.textContent += text[currentIndex];
				const char = text[currentIndex];
				currentIndex++;

				const charDelay = getDelay ? getDelay(char, currentIndex - 1) : delay;

				timeout = window.setTimeout(typeNext, charDelay);
			} else {
				if (cursor) {
					node.textContent = text;
				}
			}
		};

		typeNext();
	}

	start();

	return {
		update(newOptions: TypeOptions) {
			text = newOptions.text;
			delay = newOptions.delay ?? delay;
			getDelay = newOptions.getDelay ?? getDelay;
			cursor = newOptions.cursor ?? cursor;
			start();
		},
		destroy() {
			stop();
		}
	};
}
