type RevealOptions = {
	/** Fraction of the element that must be visible before it counts as seen. */
	threshold?: number;
	/** Called once, the first time the element scrolls into view. */
	onenter?: () => void;
};

/** Adds `is-in` the first time the node scrolls into view. The CSS decides what that means. */
export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				node.classList.add('is-in');
				options.onenter?.();
				observer.disconnect();
			}
		},
		{ threshold: options.threshold ?? 0.2, rootMargin: '0px 0px -8% 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

export function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Eases a number from 0 to `to`, calling `onupdate` every frame. Returns a cancel function. */
export function countUp(
	to: number,
	onupdate: (value: number) => void,
	duration = 1400
): () => void {
	if (prefersReducedMotion()) {
		onupdate(to);
		return () => {};
	}

	const start = performance.now();
	let frame = 0;

	const tick = (now: number) => {
		const t = Math.min(1, (now - start) / duration);
		const eased = 1 - Math.pow(1 - t, 4);
		onupdate(to * eased);
		if (t < 1) frame = requestAnimationFrame(tick);
	};

	frame = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(frame);
}
