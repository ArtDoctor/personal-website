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
