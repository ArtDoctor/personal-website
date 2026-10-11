<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	/*
	 * Bodies in orbit around one heavy mass, integrated with softened Newtonian gravity:
	 *
	 *   a = −GM · d / (|d|² + ε²)^(3/2)
	 *
	 * The mass sits on whatever element carries `data-orbit-center` (the black disc in the
	 * hero) and at the middle of the screen when there is none. The cursor is a second,
	 * lighter mass. Everything is drawn in white and blended as a difference, so it shows up
	 * black on the white bands and white on the black ones.
	 */
	const PERIOD = 46;
	const CURSOR_MASS = 0.26;
	const REACH = 78;
	const CURSOR_REACH = 180;

	const TRAIL = 14;
	const TRAIL_STEP = 0.07;

	type Body = {
		x: number;
		y: number;
		vx: number;
		vy: number;
		r: number;
		ring: boolean;
		age: number;
		/** Recent positions, oldest first, as x,y pairs: the streak each body leaves behind. */
		trail: number[];
	};

	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;
		const ctx = context;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let width = 0;
		let height = 0;
		let dpr = 1;
		let bodies: Body[] = [];
		const centre = { x: 0, y: 0, radius: 200, gm: 1 };
		const pointer = { x: -9999, y: -9999, pull: 0, seen: 0 };

		function target() {
			const anchor = document.querySelector<HTMLElement>('[data-orbit-center]');
			if (anchor) {
				const rect = anchor.getBoundingClientRect();
				if (rect.bottom > -rect.height * 0.4 && rect.top < height) {
					return {
						x: rect.left + rect.width / 2,
						y: rect.top + rect.height / 2,
						radius: rect.width / 2
					};
				}
			}
			return { x: width / 2, y: height / 2, radius: Math.min(width, height) * 0.24 };
		}

		function launch(body: Body) {
			const distance = centre.radius * (1.1 + Math.random() ** 1.5 * 1.5);
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.sqrt(centre.gm / distance) * (0.9 + Math.random() * 0.2);
			body.x = centre.x + Math.cos(angle) * distance;
			body.y = centre.y + Math.sin(angle) * distance;
			body.vx = -Math.sin(angle) * speed;
			body.vy = Math.cos(angle) * speed;
			body.age = 0;
			body.trail.length = 0;
		}

		function resize() {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);

			Object.assign(centre, target());
			const orbitSpeed = (2 * Math.PI * centre.radius) / PERIOD;
			centre.gm = orbitSpeed * orbitSpeed * centre.radius;

			const count = Math.round(Math.min(150, Math.max(46, (width * height) / 10500)));
			bodies = Array.from({ length: count }, () => {
				const body: Body = {
					x: 0,
					y: 0,
					vx: 0,
					vy: 0,
					r: 1 + Math.random() * 1.8,
					ring: Math.random() < 0.1,
					age: 1,
					trail: []
				};
				launch(body);
				body.age = 1;
				return body;
			});
		}

		let sinceSample = 0;

		function step(delta: number) {
			sinceSample += delta;
			const sample = sinceSample >= TRAIL_STEP;
			if (sample) sinceSample = 0;

			// Follow the disc. Most of its motion is the page scrolling, so carry the bodies along.
			const next = target();
			const moveX = (next.x - centre.x) * Math.min(1, delta * 14);
			const moveY = (next.y - centre.y) * Math.min(1, delta * 14);
			centre.x += moveX;
			centre.y += moveY;
			centre.radius += (next.radius - centre.radius) * Math.min(1, delta * 4);
			const orbitSpeed = (2 * Math.PI * centre.radius) / PERIOD;
			centre.gm = orbitSpeed * orbitSpeed * centre.radius;

			pointer.pull +=
				((performance.now() - pointer.seen < 1600 ? 1 : 0) - pointer.pull) * Math.min(1, delta * 3);
			const softening = (centre.radius * 0.2) ** 2;

			for (const body of bodies) {
				body.x += moveX * 0.9;
				body.y += moveY * 0.9;
				for (let k = 0; k < body.trail.length; k += 2) {
					body.trail[k] += moveX * 0.9;
					body.trail[k + 1] += moveY * 0.9;
				}
				if (sample) {
					body.trail.push(body.x, body.y);
					if (body.trail.length > TRAIL * 2) body.trail.splice(0, 2);
				}

				let dx = centre.x - body.x;
				let dy = centre.y - body.y;
				let d2 = dx * dx + dy * dy + softening;
				let pull = centre.gm / (d2 * Math.sqrt(d2));
				let ax = dx * pull;
				let ay = dy * pull;

				if (pointer.pull > 0.01) {
					dx = pointer.x - body.x;
					dy = pointer.y - body.y;
					d2 = dx * dx + dy * dy + 3600;
					pull = (centre.gm * CURSOR_MASS * pointer.pull) / (d2 * Math.sqrt(d2));
					ax += dx * pull;
					ay += dy * pull;
				}

				// Semi-implicit Euler keeps the orbits from spiralling outward.
				body.vx += ax * delta;
				body.vy += ay * delta;
				body.x += body.vx * delta;
				body.y += body.vy * delta;
				body.age = Math.min(1, body.age + delta * 0.6);

				const away = Math.hypot(body.x - centre.x, body.y - centre.y);
				const lost =
					body.x < -260 || body.x > width + 260 || body.y < -260 || body.y > height + 260;
				if (away > centre.radius * 4.2 || (lost && away > centre.radius * 2.8)) launch(body);
			}
		}

		function draw() {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);
			ctx.lineWidth = 1;

			const links: number[][] = [[], [], []];
			for (let i = 0; i < bodies.length; i++) {
				const a = bodies[i];
				for (let j = i + 1; j < bodies.length; j++) {
					const b = bodies[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					if (Math.abs(dx) > REACH || Math.abs(dy) > REACH) continue;
					const distance = Math.hypot(dx, dy);
					if (distance > REACH) continue;
					links[Math.min(2, Math.floor((1 - distance / REACH) * 3))].push(a.x, a.y, b.x, b.y);
				}
			}
			links.forEach((bucket, level) => {
				ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + level * 0.14})`;
				ctx.beginPath();
				for (let k = 0; k < bucket.length; k += 4) {
					ctx.moveTo(bucket[k], bucket[k + 1]);
					ctx.lineTo(bucket[k + 2], bucket[k + 3]);
				}
				ctx.stroke();
			});

			if (pointer.pull > 0.05) {
				for (const body of bodies) {
					const distance = Math.hypot(body.x - pointer.x, body.y - pointer.y);
					if (distance > CURSOR_REACH) continue;
					ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / CURSOR_REACH) * 0.8 * pointer.pull})`;
					ctx.beginPath();
					ctx.moveTo(pointer.x, pointer.y);
					ctx.lineTo(body.x, body.y);
					ctx.stroke();
				}
				ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * pointer.pull})`;
				ctx.beginPath();
				ctx.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2);
				ctx.stroke();
			}

			// Streaks, like a long exposure: the older half of each trail fainter than the newer.
			for (const [from, to, alpha] of [
				[0, TRAIL, 0.13],
				[TRAIL - 2, TRAIL * 2, 0.3]
			]) {
				ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
				ctx.beginPath();
				for (const body of bodies) {
					const end = Math.min(to, body.trail.length);
					if (end - from < 4) continue;
					ctx.moveTo(body.trail[from], body.trail[from + 1]);
					for (let k = from + 2; k < end; k += 2) ctx.lineTo(body.trail[k], body.trail[k + 1]);
					if (to >= TRAIL * 2 || end === body.trail.length) ctx.lineTo(body.x, body.y);
				}
				ctx.stroke();
			}

			for (const body of bodies) {
				ctx.fillStyle = `rgba(255, 255, 255, ${0.82 * body.age})`;
				ctx.beginPath();
				ctx.arc(body.x, body.y, body.r, 0, Math.PI * 2);
				ctx.fill();

				if (body.ring) {
					ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * body.age})`;
					ctx.beginPath();
					ctx.arc(body.x, body.y, body.r + 3, 0, Math.PI * 2);
					ctx.stroke();
				}
			}
		}

		let frame = 0;
		let previous = performance.now();

		function loop(now: number) {
			frame = requestAnimationFrame(loop);
			if (document.hidden) {
				previous = now;
				return;
			}
			const delta = Math.min(1 / 30, Math.max(0, (now - previous) / 1000));
			previous = now;
			step(delta / 2);
			step(delta / 2);
			draw();
		}

		function onmove(event: PointerEvent) {
			if (event.pointerType !== 'mouse') return;
			pointer.x = event.clientX;
			pointer.y = event.clientY;
			pointer.seen = performance.now();
		}

		resize();
		window.addEventListener('resize', resize);

		if (reducedMotion) {
			draw();
		} else {
			window.addEventListener('pointermove', onmove, { passive: true });
			frame = requestAnimationFrame(loop);
		}

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onmove);
		};
	});
</script>

<canvas bind:this={canvas} class="field" aria-hidden="true"></canvas>
