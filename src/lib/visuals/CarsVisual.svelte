<script lang="ts">
	import { HOT, MONO, ink, seeded, stage, type Frame } from './stage';

	let { active = true }: { active?: boolean } = $props();

	/*
	 * A pocket version of the simulator: ten cars, each a handful of genes (body outline, two
	 * wheel sizes, engine power, density), driving a road that gets rougher the further it goes.
	 * The two that get furthest survive as they are; the rest are bred from the best five and
	 * mutated. Toy physics, as in the real thing.
	 */
	const POPULATION = 10;
	const SIDES = 7;
	const GENERATIONS = 14;
	/** Metres of road in view, and metres on the strip along the bottom. */
	const SPAN = 19;
	const TRACK = 90;

	type Car = {
		body: number[];
		wheels: [number, number];
		power: number;
		density: number;
		mass: number;
		x: number;
		v: number;
		stalled: number;
		done: boolean;
	};

	let random = seeded(3);
	let cars: Car[] = [];
	let generation = 0;
	let record = 0;
	let clock = 0;
	let rest = 0;
	let camera = -3;
	let warmed = false;

	const roughness = (x: number) => 0.3 + Math.max(0, x) * 0.03;
	const road = (x: number) =>
		roughness(x) *
		(0.55 * Math.sin(x * 0.31) + 0.3 * Math.sin(x * 0.83 + 1.3) + 0.15 * Math.sin(x * 1.9 + 0.4));
	const slope = (x: number) => (road(x + 0.1) - road(x - 0.1)) / 0.2;

	const outline = (body: number[]) =>
		body.map((r, k) => {
			const angle = (k / SIDES) * Math.PI * 2;
			return [Math.cos(angle) * r * 1.2, Math.sin(angle) * r * 0.52 + 0.42] as const;
		});

	function build(genes: Pick<Car, 'body' | 'wheels' | 'power' | 'density'>): Car {
		const shape = outline(genes.body);
		let area = 0;
		for (let k = 0; k < SIDES; k++) {
			const [x1, y1] = shape[k];
			const [x2, y2] = shape[(k + 1) % SIDES];
			area += (x1 * y2 - x2 * y1) / 2;
		}
		const mass = area * genes.density + (genes.wheels[0] ** 2 + genes.wheels[1] ** 2) * 2;
		return { ...genes, mass, x: 0, v: 0, stalled: 0, done: false };
	}

	const between = (min: number, max: number) => min + random() * (max - min);
	const fresh = () =>
		build({
			body: Array.from({ length: SIDES }, () => between(0.4, 1)),
			wheels: [between(0.16, 0.42), between(0.16, 0.42)],
			power: between(0.25, 0.55),
			density: between(0.7, 1.4)
		});

	function restart() {
		generation = 0;
		record = 0;
		cars = Array.from({ length: POPULATION }, fresh);
	}

	function breed() {
		const ranked = [...cars].sort((a, b) => b.x - a.x);
		record = Math.max(record, ranked[0].x);
		if (generation + 1 >= GENERATIONS) return restart();
		generation++;

		const mutate = (value: number, min: number, max: number) =>
			random() < 0.4 ? Math.min(max, Math.max(min, value * between(0.86, 1.16))) : value;
		const parent = () => ranked[Math.floor(random() ** 1.6 * 5)];
		const children = Array.from({ length: POPULATION - 2 }, () => {
			const [a, b] = [parent(), parent()];
			const pick = <T,>(left: T, right: T) => (random() < 0.5 ? left : right);
			return build({
				body: a.body.map((r, k) => mutate(pick(r, b.body[k]), 0.35, 1.05)),
				wheels: [
					mutate(pick(a.wheels[0], b.wheels[0]), 0.14, 0.5),
					mutate(pick(a.wheels[1], b.wheels[1]), 0.14, 0.5)
				],
				power: mutate(pick(a.power, b.power), 0.3, 1),
				density: mutate(pick(a.density, b.density), 0.6, 1.5)
			});
		});
		cars = [...ranked.slice(0, 2).map(build), ...children];
	}

	function step(dt: number) {
		if (rest > 0) {
			rest -= dt;
			if (rest <= 0) {
				breed();
				clock = 0;
			}
			return;
		}

		clock += dt;
		for (const car of cars) {
			if (car.done) continue;
			const grip = (car.wheels[0] + car.wheels[1]) / 2;
			const pull = (car.power * 6.4) / car.mass;
			const drag = 9 * slope(car.x) + (0.5 * roughness(car.x)) / grip + 0.9 * car.v;
			car.v = Math.max(0, car.v + (pull - drag) * dt);
			car.x += car.v * dt;
			car.stalled = car.v < 0.06 ? car.stalled + dt : 0;
			if (car.stalled > 0.7) car.done = true;
		}
		if (cars.every((car) => car.done) || clock > 26) rest = 1.1;
	}

	function draw({ ctx, width, height, time, dt }: Frame) {
		if (!cars.length) restart();
		// With motion turned off there is one frame: show a generation part-way down the road.
		if (!warmed && dt === 0 && time > 0) {
			for (let t = 0; t < time; t += 0.03) step(0.03);
		}
		warmed = true;
		for (let i = 0; i < 2; i++) step(dt * 1.5);

		const leader = cars.reduce((best, car) => (car.x > best.x ? car : best));
		const ppm = width / SPAN;
		camera += (Math.max(-3, leader.x - SPAN * 0.62) - camera) * Math.min(1, dt * 2.4 || 1);
		const ground = height * 0.56;
		const sx = (x: number) => (x - camera) * ppm;
		const sy = (x: number, lift = 0) => ground - (road(x) + lift) * ppm;

		// The road, and the ground under it.
		ctx.beginPath();
		for (let px = 0; px <= width + 4; px += 4) ctx.lineTo(px, sy(camera + px / ppm));
		ctx.strokeStyle = ink(0.75);
		ctx.lineWidth = 1.2;
		ctx.stroke();
		ctx.lineTo(width, height);
		ctx.lineTo(0, height);
		ctx.fillStyle = ink(0.045);
		ctx.fill();

		const small = width < 520;
		const pad = small ? 12 : 20;
		ctx.font = `${small ? 9 : 11}px ${MONO}`;
		ctx.textBaseline = 'alphabetic';

		// Distance marks along the road.
		ctx.textAlign = 'center';
		ctx.fillStyle = ink(0.3);
		for (let mark = Math.ceil(camera / 10) * 10; mark < camera + SPAN; mark += 10) {
			if (mark < 0) continue;
			ctx.fillRect(sx(mark), sy(mark) + 6, 1, 7);
			ctx.fillText(`${mark} m`, sx(mark), sy(mark) + 26);
		}

		// The whole track along the bottom: where every car is, and the furthest anyone has been.
		const strip = height - pad - 3;
		const tx = (x: number) => pad + (Math.min(x, TRACK) / TRACK) * (width - pad * 2);
		ctx.fillRect(pad, strip, width - pad * 2, 1);
		if (record > 0) {
			ctx.fillStyle = ink(0.6);
			ctx.fillRect(tx(record), strip - 7, 1, 14);
			ctx.textAlign = tx(record) > width - 90 ? 'right' : 'left';
			ctx.fillText('record', tx(record) + (ctx.textAlign === 'left' ? 6 : -6), strip - 8);
		}
		for (const car of cars) {
			ctx.fillStyle = car === leader ? HOT : ink(0.55);
			ctx.fillRect(tx(car.x) - 2, strip - 2, 4, 5);
		}

		const ordered = [...cars].sort((a, b) => Number(a === leader) - Number(b === leader));
		for (const car of ordered) {
			const tone = car === leader ? HOT : ink(car.done ? 0.28 : 0.75);
			ctx.save();
			ctx.translate(sx(car.x), sy(car.x));
			ctx.rotate(-Math.atan(slope(car.x)));
			ctx.scale(ppm, -ppm);
			ctx.lineWidth = (car === leader ? 1.6 : 1.1) / ppm;
			ctx.strokeStyle = tone;
			ctx.fillStyle = '#0c0c0e';

			ctx.beginPath();
			for (const [x, y] of outline(car.body)) ctx.lineTo(x, y + 0.25);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			for (const [index, radius] of car.wheels.entries()) {
				const wx = index ? 0.72 : -0.72;
				const spin = -car.x / radius;
				ctx.beginPath();
				ctx.arc(wx, radius, radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.moveTo(wx, radius);
				ctx.lineTo(wx + Math.cos(spin) * radius, radius + Math.sin(spin) * radius);
				ctx.stroke();
			}
			ctx.restore();
		}

		ctx.textAlign = 'left';
		ctx.fillStyle = ink(0.45);
		ctx.fillText(
			`generation ${String(generation + 1).padStart(2, '0')} · ${POPULATION} cars`,
			pad,
			pad + 8
		);
		ctx.textAlign = 'right';
		ctx.fillStyle = ink();
		ctx.fillText(`best ${Math.max(record, leader.x).toFixed(1)} m`, width - pad, pad + 8);
	}
</script>

<canvas class="visual" use:stage={{ draw, active, still: 5 }} aria-hidden="true"></canvas>
