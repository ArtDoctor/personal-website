import { prefersReducedMotion } from '$lib/actions/reveal';

/** The colours every project visual draws with: the dark plate's ink, and the one accent. */
export const INK = '241, 241, 236';
export const HOT = '#ff4f1a';
export const MONO = "'Martian Mono', ui-monospace, monospace";

export const ink = (alpha = 1) => `rgba(${INK}, ${alpha})`;
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
/** 0 → 1 between two edges, eased at both ends. */
export const smooth = (from: number, to: number, value: number) => {
	const t = clamp((value - from) / (to - from));
	return t * t * (3 - 2 * t);
};

/** A small seeded generator, so every visitor sees the same picture. */
export function seeded(seed: number) {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export type Frame = {
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	/** Seconds the visual has been running. It stops while the canvas is off screen. */
	time: number;
	/** Seconds since the previous frame. */
	dt: number;
};

type Options = {
	draw: (frame: Frame) => void;
	/** Set to false to hold the picture still, as in a viewer showing another project. */
	active?: boolean;
	/** The moment to show when motion is turned off. */
	still?: number;
};

/**
 * Keeps a canvas the size of its box and calls `draw` on every frame, but only while the
 * canvas is on screen and active. With reduced motion it draws one settled frame instead.
 */
export function stage(canvas: HTMLCanvasElement, options: Options) {
	const context = canvas.getContext('2d');
	if (!context) return;
	const ctx = context;

	const reduced = prefersReducedMotion();
	let { draw, active = true } = options;
	const still = options.still ?? 6;

	let width = 0;
	let height = 0;
	let visible = false;
	let frame = 0;
	let time = reduced ? still : 0;
	let last = 0;

	function paint(dt: number) {
		if (!width || !height) return;
		ctx.clearRect(0, 0, width, height);
		draw({ ctx, width, height, time, dt });
	}

	function tick(now: number) {
		// The first timestamp can be a hair earlier than the moment the loop was started.
		const dt = clamp((now - last) / 1000, 0, 0.05);
		last = now;
		time += dt;
		paint(dt);
		frame = requestAnimationFrame(tick);
	}

	function sync() {
		const run = visible && active && !reduced;
		if (run && !frame) {
			last = performance.now();
			frame = requestAnimationFrame(tick);
		} else if (!run && frame) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	}

	const resizer = new ResizeObserver(() => {
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		width = canvas.clientWidth;
		height = canvas.clientHeight;
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		paint(0);
	});
	resizer.observe(canvas);

	const watcher = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		sync();
	});
	watcher.observe(canvas);

	// Canvas text is drawn with whatever is loaded at the time; redraw once the fonts are in.
	document.fonts?.ready.then(() => paint(0));

	return {
		update(next: Options) {
			draw = next.draw;
			active = next.active ?? true;
			sync();
		},
		destroy() {
			cancelAnimationFrame(frame);
			resizer.disconnect();
			watcher.disconnect();
		}
	};
}
