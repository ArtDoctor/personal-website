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

/** Lets a mouse drag a horizontally scrolling strip. Touch and trackpads already can. */
export function dragScroll(node: HTMLElement) {
	let startX = 0;
	let startScroll = 0;
	let dragging = false;

	const down = (event: PointerEvent) => {
		if (event.pointerType !== 'mouse') return;
		dragging = true;
		startX = event.clientX;
		startScroll = node.scrollLeft;
		node.setPointerCapture(event.pointerId);
		node.classList.add('is-dragging');
	};
	const move = (event: PointerEvent) => {
		if (dragging) node.scrollLeft = startScroll - (event.clientX - startX);
	};
	const up = () => {
		dragging = false;
		node.classList.remove('is-dragging');
	};

	node.addEventListener('pointerdown', down);
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointercancel', up);

	return {
		destroy() {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', up);
		}
	};
}
