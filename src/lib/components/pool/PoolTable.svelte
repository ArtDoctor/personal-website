<script lang="ts">
	import { onMount } from 'svelte';
	import { BALLS } from './pool';

	type Props = {
		/** One object ball per label. */
		labels: string[];
		onpot?: (index: number) => void;
		onshot?: () => void;
		/** Cloth colour. */
		felt?: string;
		/** Colour of the rail sights and the cue. */
		trim?: string;
	};

	let { labels, onpot, onshot, felt = '#178a5c', trim = '#ffd12e' }: Props = $props();

	let canvas: HTMLCanvasElement;

	/*
	 * Top-down pool, in units of the table's short side: the cloth is [0, aspect] × [0, 1].
	 * Equal-mass elastic collisions, cushions that lose a little energy, cloth that slows
	 * everything down. Ball 0 is the cue ball.
	 */
	const RADIUS = 0.042;
	// Generous pockets and a fast cloth: this is a toy, potting should come easily.
	const POCKET = RADIUS * 2.05;
	const MAX_PULL = 0.85;
	const MAX_SPEED = 7.2;
	const BALL_BOUNCE = 0.97;
	const CUSHION_BOUNCE = 0.82;
	const SUBSTEPS = 6;

	const RAIL = '#111114';
	const CHALK = '#fbfaf5';

	type Ball = {
		id: number;
		u: number;
		v: number;
		du: number;
		dv: number;
		/** 0 while in play; counts up to 1 as the ball drops into a pocket. */
		sinking: number;
		pocket: number;
		gone: boolean;
	};

	type Toast = { text: string; u: number; v: number; age: number };

	let balls: Ball[] = [];
	let toasts: Toast[] = [];
	let aspect = 2;
	let hasShot = false;

	function rackBalls() {
		const count = labels.length;
		const spacing = RADIUS * 2.04;
		const rows = [1, 2, 3, 3, 2];
		balls = [{ id: 0, u: aspect * 0.24, v: 0.5, du: 0, dv: 0, sinking: 0, pocket: 0, gone: false }];

		let id = 1;
		rows.forEach((size, row) => {
			for (let i = 0; i < size && id <= count; i++) {
				balls.push({
					id: id++,
					u: aspect * 0.66 + row * spacing * 0.866,
					v: 0.5 + (i - (size - 1) / 2) * spacing,
					du: 0,
					dv: 0,
					sinking: 0,
					pocket: 0,
					gone: false
				});
			}
		});
		toasts = [];
		hasShot = false;
	}

	/** Puts every ball back. */
	export function rack() {
		rackBalls();
	}

	/** Fires the cue ball at the nearest ball, for anyone who would rather press a button than aim. */
	export function breakShot() {
		const cue = balls[0];
		if (!cue || cue.sinking) return;

		let nearest: Ball | null = null;
		for (const ball of balls) {
			if (ball === cue || ball.gone || ball.sinking) continue;
			if (!nearest || distance(cue, ball) < distance(cue, nearest)) nearest = ball;
		}
		if (!nearest) return;

		const length = distance(cue, nearest);
		const wobble = (Math.random() - 0.5) * 0.06;
		cue.du =
			((nearest.u - cue.u) / length - wobble * ((nearest.v - cue.v) / length)) * MAX_SPEED * 0.95;
		cue.dv =
			((nearest.v - cue.v) / length + wobble * ((nearest.u - cue.u) / length)) * MAX_SPEED * 0.95;
		hasShot = true;
		onshot?.();
	}

	function distance(a: Ball, b: Ball): number {
		return Math.hypot(a.u - b.u, a.v - b.v);
	}

	function pockets(): [number, number][] {
		const inset = RADIUS * 0.2;
		return [
			[-inset, -inset],
			[aspect / 2, -inset * 1.4],
			[aspect + inset, -inset],
			[-inset, 1 + inset],
			[aspect / 2, 1 + inset * 1.4],
			[aspect + inset, 1 + inset]
		];
	}

	function step(dt: number) {
		const holes = pockets();

		for (const ball of balls) {
			if (ball.gone) continue;

			if (ball.sinking) {
				ball.sinking = Math.min(1, ball.sinking + dt * 4.5);
				const [pu, pv] = holes[ball.pocket];
				ball.u += (pu - ball.u) * 0.2;
				ball.v += (pv - ball.v) * 0.2;
				if (ball.sinking === 1) {
					if (ball.id === 0) respotCue(ball);
					else ball.gone = true;
				}
				continue;
			}

			const speed = Math.hypot(ball.du, ball.dv);
			if (speed > 0) {
				const slowed = Math.max(0, speed - (0.45 + 0.3 * speed) * dt);
				const scale = slowed < 0.012 ? 0 : slowed / speed;
				ball.du *= scale;
				ball.dv *= scale;
			}
			ball.u += ball.du * dt;
			ball.v += ball.dv * dt;

			const hole = holes.findIndex(([pu, pv]) => Math.hypot(ball.u - pu, ball.v - pv) < POCKET);
			if (hole >= 0) {
				ball.sinking = 0.001;
				ball.pocket = hole;
				ball.du = ball.dv = 0;
				if (ball.id > 0) {
					toasts.push({ text: labels[ball.id - 1], u: ball.u, v: ball.v, age: 0 });
					onpot?.(ball.id - 1);
				}
				continue;
			}

			if (ball.u < RADIUS) {
				ball.u = RADIUS;
				ball.du = Math.abs(ball.du) * CUSHION_BOUNCE;
			} else if (ball.u > aspect - RADIUS) {
				ball.u = aspect - RADIUS;
				ball.du = -Math.abs(ball.du) * CUSHION_BOUNCE;
			}
			if (ball.v < RADIUS) {
				ball.v = RADIUS;
				ball.dv = Math.abs(ball.dv) * CUSHION_BOUNCE;
			} else if (ball.v > 1 - RADIUS) {
				ball.v = 1 - RADIUS;
				ball.dv = -Math.abs(ball.dv) * CUSHION_BOUNCE;
			}
		}

		for (let i = 0; i < balls.length; i++) {
			const a = balls[i];
			if (a.gone || a.sinking) continue;
			for (let j = i + 1; j < balls.length; j++) {
				const b = balls[j];
				if (b.gone || b.sinking) continue;

				const nu = b.u - a.u;
				const nv = b.v - a.v;
				const distance = Math.hypot(nu, nv);
				if (distance >= RADIUS * 2 || distance === 0) continue;

				const ux = nu / distance;
				const uy = nv / distance;
				const overlap = (RADIUS * 2 - distance) / 2;
				a.u -= ux * overlap;
				a.v -= uy * overlap;
				b.u += ux * overlap;
				b.v += uy * overlap;

				// Equal masses: swap the velocity components along the line of centres.
				const closing = (a.du - b.du) * ux + (a.dv - b.dv) * uy;
				if (closing <= 0) continue;
				const impulse = (closing * (1 + BALL_BOUNCE)) / 2;
				a.du -= impulse * ux;
				a.dv -= impulse * uy;
				b.du += impulse * ux;
				b.dv += impulse * uy;
			}
		}
	}

	function respotCue(cue: Ball) {
		cue.sinking = 0;
		cue.du = cue.dv = 0;
		cue.u = aspect * 0.24;
		for (const v of [0.5, 0.35, 0.65, 0.2, 0.8]) {
			cue.v = v;
			const blocked = balls.some(
				(ball) =>
					ball !== cue && !ball.gone && Math.hypot(ball.u - cue.u, ball.v - cue.v) < RADIUS * 2.1
			);
			if (!blocked) break;
		}
	}

	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;
		const ctx = context;

		const family = getComputedStyle(canvas).fontFamily;
		let width = 0;
		let height = 0;
		let dpr = 1;
		let portrait = false;
		let rail = 0;
		let unit = 1;

		// Aiming: the pull vector, in table units, from the pointer back to the cue ball.
		let aiming = false;
		let pullU = 0;
		let pullV = 0;

		function resize() {
			const rect = canvas.getBoundingClientRect();
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);

			portrait = height > width;
			rail = Math.min(width, height) * 0.075;
			const clothLong = (portrait ? height : width) - rail * 2;
			unit = (portrait ? width : height) - rail * 2;

			const nextAspect = clothLong / unit;
			if (Math.abs(nextAspect - aspect) > 0.02 || balls.length === 0) {
				aspect = nextAspect;
				rackBalls();
			}
		}

		// Table units → canvas pixels. On a tall table the long axis runs bottom to top.
		function toX(u: number, v: number) {
			return portrait ? rail + v * unit : rail + u * unit;
		}
		function toY(u: number, v: number) {
			return portrait ? rail + (aspect - u) * unit : rail + v * unit;
		}
		function toTable(event: PointerEvent): [number, number] {
			const rect = canvas.getBoundingClientRect();
			const x = (event.clientX - rect.left - rail) / unit;
			const y = (event.clientY - rect.top - rail) / unit;
			return portrait ? [aspect - y, x] : [x, y];
		}

		function drawBall(ball: Ball) {
			const x = toX(ball.u, ball.v);
			const y = toY(ball.u, ball.v);
			const r = RADIUS * unit * (1 - ball.sinking * 0.75);
			ctx.globalAlpha = 1 - ball.sinking * 0.6;

			ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
			ctx.beginPath();
			ctx.ellipse(x + r * 0.22, y + r * 0.3, r, r * 0.94, 0, 0, Math.PI * 2);
			ctx.fill();

			const style = ball.id === 0 ? null : BALLS[(ball.id - 1) % BALLS.length];
			ctx.save();
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.clip();
			ctx.fillStyle = !style || style.stripe ? CHALK : style.color;
			ctx.fillRect(x - r, y - r, r * 2, r * 2);
			if (style?.stripe) {
				ctx.fillStyle = style.color;
				ctx.fillRect(x - r, y - r * 0.56, r * 2, r * 1.12);
			}
			ctx.restore();

			if (style) {
				ctx.fillStyle = CHALK;
				ctx.beginPath();
				ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = RAIL;
				ctx.font = `800 ${r * 0.72}px ${family}`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(String(ball.id), x, y + r * 0.05);
			}

			ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
			ctx.beginPath();
			ctx.ellipse(x - r * 0.36, y - r * 0.42, r * 0.3, r * 0.17, -0.7, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;
		}

		function draw(time: number) {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);

			// Rail and cloth.
			ctx.fillStyle = RAIL;
			ctx.beginPath();
			ctx.roundRect(0, 0, width, height, rail * 1.1);
			ctx.fill();
			ctx.fillStyle = felt;
			ctx.beginPath();
			ctx.roundRect(rail, rail, width - rail * 2, height - rail * 2, rail * 0.18);
			ctx.fill();

			// Sights on the rail, and the head string the cue ball starts on.
			ctx.fillStyle = trim;
			const sightOffset = (rail * 0.5) / unit;
			for (let i = 1; i < 8; i++) {
				if (i === 4) continue;
				for (const v of [-sightOffset, 1 + sightOffset]) {
					ctx.beginPath();
					ctx.arc(toX((aspect * i) / 8, v), toY((aspect * i) / 8, v), rail * 0.07, 0, Math.PI * 2);
					ctx.fill();
				}
			}
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(toX(aspect * 0.24, 0), toY(aspect * 0.24, 0));
			ctx.lineTo(toX(aspect * 0.24, 1), toY(aspect * 0.24, 1));
			ctx.stroke();

			ctx.fillStyle = '#060607';
			for (const [pu, pv] of pockets()) {
				ctx.beginPath();
				ctx.arc(toX(pu, pv), toY(pu, pv), POCKET * unit * 0.92, 0, Math.PI * 2);
				ctx.fill();
			}

			const cue = balls[0];
			const atRest = balls.every((ball) => ball.gone || (ball.du === 0 && ball.dv === 0));

			// Before the first shot, a ring around the cue ball says "start here".
			if (cue && !hasShot && !aiming) {
				const pulse = 0.5 + 0.5 * Math.sin(time * 3.2);
				ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + pulse * 0.45})`;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(
					toX(cue.u, cue.v),
					toY(cue.u, cue.v),
					RADIUS * unit * (1.7 + pulse * 0.5),
					0,
					Math.PI * 2
				);
				ctx.stroke();
			}

			if (cue && aiming) {
				const pull = Math.min(MAX_PULL, Math.hypot(pullU, pullV));
				if (pull > 0.02) {
					const length = Math.hypot(pullU, pullV);
					const du = pullU / length;
					const dv = pullV / length;
					const power = pull / MAX_PULL;

					// Where the shot is headed.
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
					ctx.lineWidth = 2;
					ctx.setLineDash([6, 7]);
					ctx.beginPath();
					ctx.moveTo(
						toX(cue.u + du * RADIUS * 1.4, cue.v + dv * RADIUS * 1.4),
						toY(cue.u + du * RADIUS * 1.4, cue.v + dv * RADIUS * 1.4)
					);
					const reach = RADIUS * 2 + power * 0.95;
					ctx.lineTo(
						toX(cue.u + du * reach, cue.v + dv * reach),
						toY(cue.u + du * reach, cue.v + dv * reach)
					);
					ctx.stroke();
					ctx.setLineDash([]);

					// The cue, pulled back.
					const near = RADIUS * 1.5 + pull * 0.5;
					const far = near + 0.95;
					ctx.lineCap = 'round';
					ctx.strokeStyle = trim;
					ctx.lineWidth = RADIUS * unit * 0.5;
					ctx.beginPath();
					ctx.moveTo(
						toX(cue.u - du * near, cue.v - dv * near),
						toY(cue.u - du * near, cue.v - dv * near)
					);
					ctx.lineTo(
						toX(cue.u - du * far, cue.v - dv * far),
						toY(cue.u - du * far, cue.v - dv * far)
					);
					ctx.stroke();
					ctx.strokeStyle = CHALK;
					ctx.beginPath();
					ctx.moveTo(
						toX(cue.u - du * near, cue.v - dv * near),
						toY(cue.u - du * near, cue.v - dv * near)
					);
					ctx.lineTo(
						toX(cue.u - du * (near + 0.05), cue.v - dv * (near + 0.05)),
						toY(cue.u - du * (near + 0.05), cue.v - dv * (near + 0.05))
					);
					ctx.stroke();
					ctx.lineCap = 'butt';
				}
			}

			for (const ball of balls) {
				if (!ball.gone) drawBall(ball);
			}

			// The hobby you just potted floats up out of the pocket.
			ctx.font = `700 14px ${family}`;
			ctx.textBaseline = 'middle';
			for (const toast of toasts) {
				const x = Math.min(width - 12, Math.max(12, toX(toast.u, toast.v)));
				const y = toY(toast.u, toast.v) - 18 - toast.age * 34;
				ctx.globalAlpha = Math.max(0, 1 - toast.age / 1.6);
				ctx.textAlign = x < width * 0.3 ? 'left' : x > width * 0.7 ? 'right' : 'center';
				ctx.lineWidth = 4;
				ctx.strokeStyle = RAIL;
				ctx.strokeText(toast.text, x, y);
				ctx.fillStyle = CHALK;
				ctx.fillText(toast.text, x, y);
			}
			ctx.globalAlpha = 1;

			canvas.style.cursor = aiming ? 'grabbing' : atRest ? 'grab' : 'default';
		}

		let frame = 0;
		let previous = performance.now();
		let visible = true;

		function loop(now: number) {
			frame = requestAnimationFrame(loop);
			if (!visible || document.hidden) {
				previous = now;
				return;
			}

			const delta = Math.min(1 / 30, Math.max(0, (now - previous) / 1000));
			previous = now;
			for (let i = 0; i < SUBSTEPS; i++) step(delta / SUBSTEPS);
			for (const toast of toasts) toast.age += delta;
			toasts = toasts.filter((toast) => toast.age < 1.6);
			draw(now / 1000);
		}

		function down(event: PointerEvent) {
			const cue = balls[0];
			if (!cue || cue.sinking) return;
			aiming = true;
			canvas.setPointerCapture(event.pointerId);
			move(event);
		}

		function move(event: PointerEvent) {
			if (!aiming) return;
			const cue = balls[0];
			const [u, v] = toTable(event);
			pullU = cue.u - u;
			pullV = cue.v - v;
		}

		function up() {
			if (!aiming) return;
			aiming = false;
			const cue = balls[0];
			const length = Math.hypot(pullU, pullV);
			if (length < 0.04) return;
			const speed = (Math.min(MAX_PULL, length) / MAX_PULL) * MAX_SPEED;
			cue.du = (pullU / length) * speed;
			cue.dv = (pullV / length) * speed;
			hasShot = true;
			onshot?.();
		}

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
		});
		intersectionObserver.observe(canvas);

		canvas.addEventListener('pointerdown', down);
		canvas.addEventListener('pointermove', move);
		canvas.addEventListener('pointerup', up);
		canvas.addEventListener('pointercancel', up);

		resize();
		frame = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			canvas.removeEventListener('pointerdown', down);
			canvas.removeEventListener('pointermove', move);
			canvas.removeEventListener('pointerup', up);
			canvas.removeEventListener('pointercancel', up);
		};
	});
</script>

<canvas
	bind:this={canvas}
	aria-label="A small pool table. Drag back from the white ball and let go to shoot."
></canvas>

<style>
	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 2 / 1;
		touch-action: none;
		user-select: none;
	}

	@media (max-width: 700px) {
		canvas {
			aspect-ratio: 1 / 1.3;
		}
	}
</style>
