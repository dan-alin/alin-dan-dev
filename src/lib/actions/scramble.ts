type ScrambleOptions = {
	text: string;
	duration?: number;
	delay?: number;
	characters?: string;
	startChar?: string;
	startCharCount?: number;
};

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function scramble(node: HTMLElement, options: ScrambleOptions) {
	let {
		text,
		duration = 1000,
		delay = 0,
		characters = DEFAULT_CHARS,
		startChar = 'X',
		startCharCount
	} = options;

	let timeout: number | undefined;
	let interval: NodeJS.Timeout | undefined;

	function stop() {
		if (timeout) clearTimeout(timeout);
		if (interval) clearInterval(interval);
	}

	function start() {
		stop();

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			node.textContent = text;
			return;
		}

		// Determine the starting placeholder string
		const placeholderLength = startCharCount ?? text.length;
		node.textContent = startChar.repeat(placeholderLength);

		timeout = window.setTimeout(() => {
			const length = text.length;
			const revealFactor = 3;
			const totalFrames = Math.max(length * revealFactor, 1);
			const frameDuration = duration / totalFrames;

			let frame = 0;

			interval = setInterval(() => {
				let output = '';

				for (let i = 0; i < length; i++) {
					if (frame / revealFactor > i) {
						output += text[i]; // reveal the real text
					} else {
						output += characters[Math.floor(Math.random() * characters.length)];
					}
				}

				node.textContent = output;
				frame++;

				if (frame >= totalFrames) {
					stop();
					node.textContent = text;
				}
			}, frameDuration);
		}, delay);
	}

	start();

	return {
		update(newOptions: ScrambleOptions) {
			text = newOptions.text;
			duration = newOptions.duration ?? duration;
			delay = newOptions.delay ?? delay;
			characters = newOptions.characters ?? characters;
			startChar = newOptions.startChar ?? startChar;
			startCharCount = newOptions.startCharCount ?? startCharCount;
			start();
		},
		destroy() {
			stop();
		}
	};
}
