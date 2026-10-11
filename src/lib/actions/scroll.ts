import { prefersReducedMotion } from './reveal';

/** Writes how far the node has travelled through the viewport into `--p` (0 → 1). */
export function scrub(node: HTMLElement) {
	if (prefersReducedMotion()) return;

	let frame = 0;
	const update = () => {
		frame = 0;
		const rect = node.getBoundingClientRect();
		const viewport = window.innerHeight;
		const progress = (viewport * 0.82 - rect.top) / (rect.height + viewport * 0.3);
		node.style.setProperty('--p', String(Math.min(1.1, Math.max(0, progress))));
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};

	update();
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
		}
	};
}

/**
 * Moves a horizontally scrolling strip with the mouse, no dragging: with the pointer at the
 * left it shows the start, at the right the end, and in between it follows. Touch and
 * trackpads scroll it the usual way.
 */
export function hoverScroll(node: HTMLElement) {
	/** How much of the width at each side already counts as the edge. */
	const EDGE = 0.14;
	const instant = prefersReducedMotion();

	let position = 0;
	let target = 0;
	let frame = 0;

	const glide = () => {
		position += (target - position) * 0.1;
		if (Math.abs(target - position) < 0.5) position = target;
		node.scrollLeft = position;
		frame = position === target ? 0 : requestAnimationFrame(glide);
	};
	const move = (event: PointerEvent) => {
		if (event.pointerType !== 'mouse') return;
		const rect = node.getBoundingClientRect();
		const along = ((event.clientX - rect.left) / rect.width - EDGE) / (1 - EDGE * 2);
		target = Math.min(1, Math.max(0, along)) * (node.scrollWidth - node.clientWidth);
		if (instant) node.scrollLeft = target;
		else if (!frame) frame = requestAnimationFrame(glide);
	};
	// Start from wherever a wheel or a finger left it.
	const enter = () => (position = node.scrollLeft);

	node.addEventListener('pointerenter', enter);
	node.addEventListener('pointermove', move);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointerenter', enter);
			node.removeEventListener('pointermove', move);
		}
	};
}
