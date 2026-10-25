<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/actions/reveal';
	import { BALLS } from './pool';
	import clackUrl from './clack.wav';

	type Props = {
		/** One object ball per label. */
		labels: string[];
		onpot?: (index: number) => void;
		onshot?: () => void;
		/** The last object ball has gone down. */
		onclear?: (result: { shots: number; seconds: number }) => void;
		/** Cloth colour. */
		felt?: string;
		/** Colour of the rail sights and the cue. */
		trim?: string;
	};

	let { labels, onpot, onshot, onclear, felt = '#178a5c', trim = '#ffd12e' }: Props = $props();

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

	// Confetti, for clearing the table: thrown up out of the pockets, held back by the air,
	// and drifting down onto the cloth. Heights are in table units too.
	const SCRAPS_PER_POCKET = 26;
	const GRAVITY = 5;
	const AIR = 1.4;
	const FALL = 0.5;
	const PARTY = 4.5;

	const RAIL = '#111114';
	const CHALK = '#fbfaf5';

	// Ball markings, on a sphere of radius 1: the stripe is the band |y| < STRIPE, and the
	// number sits in a white disc at each end of the z axis.
	const STRIPE = 0.56;
	const DISC = Math.sqrt(1 - 0.5 ** 2);

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
		/** Rotation from the ball's own frame to the table's (u, v, up), row-major. */
		turn: number[];
		/** Has rolled since its picture was last painted. */
		rolled: boolean;
	};

	type Toast = { text: string; u: number; v: number; age: number };

	/** A scrap of confetti. `z` is its height above the cloth; `flip` turns it over as it falls. */
	type Scrap = {
		u: number;
		v: number;
		z: number;
		du: number;
		dv: number;
		dz: number;
		angle: number;
		spin: number;
		flip: number;
		color: string;
		landed: boolean;
	};

	let balls: Ball[] = [];
	let toasts: Toast[] = [];
	let confetti: Scrap[] = [];
	let aspect = 2;
	/** A tall table, drawn with its long axis running bottom to top. */
	let portrait = false;
	let hasShot = false;
	let shots = 0;
	let firstShotAt = 0;
	/** When the table was cleared, in seconds on the animation clock, or -1 while it is not. */
	let clearedAt = -1;

	/** Number up, turned any which way, the way a rack never quite lines up. */
	function randomTurn(): number[] {
		const angle = Math.random() * Math.PI * 2;
		const c = Math.cos(angle);
		const s = Math.sin(angle);
		return [c, -s, 0, s, c, 0, 0, 0, 1];
	}

	/** Rolls a ball without slipping along (du, dv): it turns about the axis across its path. */
	function roll(ball: Ball, du: number, dv: number) {
		const length = Math.hypot(du, dv);
		if (length === 0) return;
		const kx = -dv / length;
		const ky = du / length;
		const c = Math.cos(length / RADIUS);
		const s = Math.sin(length / RADIUS);
		const t = 1 - c;
		const r = [
			c + t * kx * kx,
			t * kx * ky,
			s * ky,
			t * kx * ky,
			c + t * ky * ky,
			-s * kx,
			-s * ky,
			s * kx,
			c
		];
		const m = ball.turn;
		const next = new Array<number>(9);
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				next[row * 3 + col] =
					r[row * 3] * m[col] + r[row * 3 + 1] * m[3 + col] + r[row * 3 + 2] * m[6 + col];
			}
		}
		// Thousands of small turns drift; straighten the columns back up.
		const ax = Math.hypot(next[0], next[3], next[6]);
		next[0] /= ax;
		next[3] /= ax;
		next[6] /= ax;
		const dot = next[0] * next[1] + next[3] * next[4] + next[6] * next[7];
		next[1] -= dot * next[0];
		next[4] -= dot * next[3];
		next[7] -= dot * next[6];
		const ay = Math.hypot(next[1], next[4], next[7]);
		next[1] /= ay;
		next[4] /= ay;
		next[7] /= ay;
		next[2] = next[3] * next[7] - next[6] * next[4];
		next[5] = next[6] * next[1] - next[0] * next[7];
		next[8] = next[0] * next[4] - next[3] * next[1];
		ball.turn = next;
		ball.rolled = true;
	}

	/*
	 * The clack of two balls: a recording of two solid balls struck together ("billiard ball
	 * clack" by Za-Games, CC0, freesound.org/s/539854), played a touch higher or lower each
	 * time so a run of hits doesn't sound like one sample. Audio can only start from a click
	 * or a tap, so it wakes on the first shot.
	 */
	let audio: AudioContext | null = null;
	let master: GainNode | null = null;
	let sample: AudioBuffer | null = null;
	let voices: number[] = [];

	function wakeAudio() {
		if (!audio) {
			if (typeof AudioContext === 'undefined') return;
			const context = new AudioContext();
			audio = context;
			master = context.createGain();
			master.gain.value = 0.6;
			master.connect(context.destination);
			fetch(clackUrl)
				.then((response) => response.arrayBuffer())
				.then((data) => context.decodeAudioData(data))
				.then((buffer) => (sample = buffer))
				.catch(() => {});
		}
		if (audio.state === 'suspended') audio.resume();
	}

	/** `closing` is how fast the two balls met; `u`, `v` is where, so it pans across the table. */
	function clack(closing: number, u: number, v: number) {
		if (!audio || !master || !sample || audio.state !== 'running' || closing < 0.08) return;
		const now = audio.currentTime;
		// A break sets off a dozen collisions at once; a few voices are plenty.
		voices = voices.filter((time) => now - time < 0.04);
		if (voices.length >= 4) return;
		voices.push(now);

		const level = Math.min(1, closing / 4);
		const out = audio.createGain();
		out.gain.value = 0.02 + 0.98 * level ** 1.5;
		const across = portrait ? v : u / aspect;
		if (audio.createStereoPanner) {
			const pan = audio.createStereoPanner();
			pan.pan.value = (across * 2 - 1) * 0.6;
			out.connect(pan).connect(master);
		} else out.connect(master);

		// A gentle touch has less of the sharp click in it than a hard hit.
		const tone = audio.createBiquadFilter();
		tone.type = 'lowpass';
		tone.frequency.value = 3500 + level * 16000;

		const source = audio.createBufferSource();
		source.buffer = sample;
		source.playbackRate.value = 0.94 + Math.random() * 0.1 + level * 0.04;
		source.connect(tone).connect(out);
		source.start(now);
	}

	function rackBalls() {
		const count = labels.length;
		const spacing = RADIUS * 2.04;
		const rows = [1, 2, 3, 3, 2];
		balls = [
			{
				id: 0,
				u: aspect * 0.24,
				v: 0.5,
				du: 0,
				dv: 0,
				sinking: 0,
				pocket: 0,
				gone: false,
				turn: randomTurn(),
				rolled: true
			}
		];

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
					gone: false,
					turn: randomTurn(),
					rolled: true
				});
			}
		});
		toasts = [];
		confetti = [];
		hasShot = false;
		shots = 0;
		clearedAt = -1;
	}

	/** Puts every ball back. */
	export function rack() {
		rackBalls();
	}

	/** Fires the cue ball at the nearest ball, for anyone who would rather press a button than aim. */
	export function breakShot() {
		const cue = balls[0];
		if (!cue || cue.sinking) return;
		wakeAudio();

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
		countShot();
	}

	function countShot() {
		if (!hasShot) firstShotAt = performance.now();
		hasShot = true;
		shots++;
		onshot?.();
	}

	function clear() {
		clearedAt = performance.now() / 1000;
		onclear?.({ shots, seconds: (performance.now() - firstShotAt) / 1000 });
		if (!prefersReducedMotion()) burst();
	}

	/** Every pocket throws a handful of confetti in the colours of the balls it swallowed. */
	function burst() {
		const colours = [...new Set(BALLS.map((ball) => ball.color)), CHALK, trim];
		pockets().forEach(([pu, pv]) => {
			const inward = Math.atan2(0.5 - pv, aspect / 2 - pu);
			for (let i = 0; i < SCRAPS_PER_POCKET; i++) {
				const angle = inward + (Math.random() - 0.5) * 1.7;
				const speed = 0.25 + Math.random() * 1.4;
				confetti.push({
					u: pu,
					v: pv,
					z: 0,
					du: Math.cos(angle) * speed,
					dv: Math.sin(angle) * speed,
					dz: 1.4 + Math.random() * 1.8,
					angle: Math.random() * Math.PI * 2,
					spin: (Math.random() - 0.5) * 16,
					flip: Math.random() * Math.PI * 2,
					color: colours[Math.floor(Math.random() * colours.length)],
					landed: false
				});
			}
		});
	}

	function flutter(dt: number) {
		const holes = pockets();
		const drag = Math.exp(-AIR * dt);
		for (const scrap of confetti) {
			if (scrap.landed) continue;
			// Paper: it rises like anything thrown, but falls no faster than it can flutter.
			scrap.dz = Math.max(-FALL, scrap.dz - GRAVITY * dt);
			scrap.du = scrap.du * drag + Math.sin(scrap.flip) * 0.35 * dt;
			scrap.dv *= drag;
			scrap.u += scrap.du * dt;
			scrap.v += scrap.dv * dt;
			scrap.z += scrap.dz * dt;
			scrap.angle += scrap.spin * dt;
			scrap.flip += 9 * dt;
			if (scrap.z <= 0 && scrap.dz < 0) {
				scrap.z = 0;
				scrap.landed = true;
			}
		}
		// Whatever lands on a pocket falls in.
		confetti = confetti.filter(
			(scrap) =>
				!scrap.landed ||
				holes.every(([pu, pv]) => Math.hypot(scrap.u - pu, scrap.v - pv) > POCKET * 0.8)
		);
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
					else {
						ball.gone = true;
						if (clearedAt < 0 && balls.every((other) => other.id === 0 || other.gone)) clear();
					}
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
			roll(ball, ball.du * dt, ball.dv * dt);

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
				clack(closing, (a.u + b.u) / 2, (a.v + b.v) / 2);
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

		/*
		 * Each ball is painted pixel by pixel as a sphere seen from straight above: every pixel
		 * is turned back into the ball's own frame to see whether it lands on the stripe, the
		 * number disc or the digit. The picture is only repainted after the ball has rolled.
		 */
		type Picture = { canvas: HTMLCanvasElement; image: ImageData; portrait: boolean };
		const pictures = new WeakMap<Ball, Picture>();
		const GLYPH = 64;
		const glyphs = new Map<number, Uint8ClampedArray>();

		function rgb(hex: string): [number, number, number] {
			const n = parseInt(hex.slice(1), 16);
			return [n >> 16, (n >> 8) & 255, n & 255];
		}
		const chalk = rgb(CHALK);
		const ink = rgb(RAIL);

		/** The digit's coverage over the number disc, which spans GLYPH pixels per ball radius. */
		function glyph(id: number): Uint8ClampedArray {
			let mask = glyphs.get(id);
			if (mask) return mask;
			const scratch = document.createElement('canvas');
			scratch.width = scratch.height = GLYPH;
			const g = scratch.getContext('2d')!;
			g.font = `800 ${GLYPH * 0.72}px ${family}`;
			g.textAlign = 'center';
			g.textBaseline = 'middle';
			g.fillText(String(id), GLYPH / 2, GLYPH * 0.55);
			const pixels = g.getImageData(0, 0, GLYPH, GLYPH).data;
			mask = new Uint8ClampedArray(GLYPH * GLYPH);
			for (let i = 0; i < mask.length; i++) mask[i] = pixels[i * 4 + 3];
			glyphs.set(id, mask);
			return mask;
		}

		function picture(ball: Ball): HTMLCanvasElement {
			const size = Math.max(8, Math.ceil(RADIUS * unit * dpr * 2));
			let pic = pictures.get(ball);
			if (!pic || pic.canvas.width !== size || pic.portrait !== portrait) {
				const canvas = document.createElement('canvas');
				canvas.width = canvas.height = size;
				pic = { canvas, image: new ImageData(size, size), portrait };
				pictures.set(ball, pic);
			} else if (!ball.rolled) return pic.canvas;
			paint(ball, pic.image);
			pic.canvas.getContext('2d')!.putImageData(pic.image, 0, 0);
			ball.rolled = false;
			return pic.canvas;
		}

		function paint(ball: Ball, image: ImageData) {
			const style = ball.id === 0 ? null : BALLS[(ball.id - 1) % BALLS.length];
			const colour = style ? rgb(style.color) : chalk;
			const mask = style ? glyph(ball.id) : null;
			const m = ball.turn;
			const data = image.data;
			const half = image.width / 2;
			// About a pixel, for soft edges on the markings.
			const edge = 1 / half;

			let i = 0;
			for (let py = 0; py < image.height; py++) {
				for (let px = 0; px < image.width; px++, i += 4) {
					let x = (px + 0.5 - half) / half;
					let y = (py + 0.5 - half) / half;
					// Corners outside the ball repeat its rim, so the clip has colour to cut.
					const reach = x * x + y * y;
					if (reach > 1) {
						x /= Math.sqrt(reach);
						y /= Math.sqrt(reach);
					}
					const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
					const u = portrait ? -y : x;
					const v = portrait ? x : y;
					const bx = m[0] * u + m[3] * v + m[6] * z;
					const by = m[1] * u + m[4] * v + m[7] * z;
					const bz = m[2] * u + m[5] * v + m[8] * z;

					let r = colour[0];
					let g = colour[1];
					let b = colour[2];
					if (style) {
						if (style.stripe) {
							const band = clamp((STRIPE - Math.abs(by)) / edge + 0.5);
							r = chalk[0] + (r - chalk[0]) * band;
							g = chalk[1] + (g - chalk[1]) * band;
							b = chalk[2] + (b - chalk[2]) * band;
						}
						const disc = clamp((Math.abs(bz) - DISC) / (edge * 0.6) + 0.5);
						if (disc > 0) {
							r += (chalk[0] - r) * disc;
							g += (chalk[1] - g) * disc;
							b += (chalk[2] - b) * disc;
							// The far disc is seen from the other side; flip it so it reads the right way.
							const gx = Math.floor(((bz > 0 ? bx : -bx) + 0.5) * GLYPH);
							const gy = Math.floor((by + 0.5) * GLYPH);
							if (mask && gx >= 0 && gx < GLYPH && gy >= 0 && gy < GLYPH) {
								const digit = (mask[gy * GLYPH + gx] / 255) * disc;
								r += (ink[0] - r) * digit;
								g += (ink[1] - g) * digit;
								b += (ink[2] - b) * digit;
							}
						}
					}
					// A little darker towards the rim, so it reads as round while it rolls.
					const shade = 0.86 + 0.14 * z;
					data[i] = r * shade;
					data[i + 1] = g * shade;
					data[i + 2] = b * shade;
					data[i + 3] = 255;
				}
			}
		}

		function clamp(value: number) {
			return value < 0 ? 0 : value > 1 ? 1 : value;
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

			ctx.save();
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(picture(ball), x - r, y - r, r * 2, r * 2);
			ctx.restore();

			ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
			ctx.beginPath();
			ctx.ellipse(x - r * 0.36, y - r * 0.42, r * 0.3, r * 0.17, -0.7, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;
		}

		function drawScrap(scrap: Scrap) {
			const x = toX(scrap.u, scrap.v);
			const y = toY(scrap.u, scrap.v);
			const size = RADIUS * unit * 0.42;

			// Its shadow on the cloth, further off the higher it is, the way the balls' fall.
			if (!scrap.landed) {
				ctx.fillStyle = `rgba(0, 0, 0, ${0.22 * Math.max(0, 1 - scrap.z)})`;
				ctx.fillRect(
					x + scrap.z * unit * 0.3 - size * 0.4,
					y + scrap.z * unit * 0.4 - size * 0.25,
					size * 0.8,
					size * 0.5
				);
			}

			const lift = 1 + scrap.z * 1.4;
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(scrap.angle);
			ctx.scale(lift, lift * (scrap.landed ? 0.85 : 0.15 + 0.85 * Math.abs(Math.cos(scrap.flip))));
			ctx.fillStyle = scrap.color;
			ctx.fillRect(-size / 2, -size * 0.3, size, size * 0.6);
			ctx.restore();
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

			// After a clear the party runs for a few seconds and then winds down.
			const since = clearedAt < 0 ? -1 : time - clearedAt;
			const party = since < 0 ? 0 : Math.min(1, Math.max(0, PARTY - since));

			// Sights on the rail, and the head string the cue ball starts on. During the party
			// they chase round the table like the lights on an arcade cabinet.
			ctx.fillStyle = trim;
			const sightOffset = (rail * 0.5) / unit;
			for (let i = 1; i < 8; i++) {
				if (i === 4) continue;
				for (const [side, v] of [-sightOffset, 1 + sightOffset].entries()) {
					const lap = side ? 15 - i : i;
					const glow = party * Math.max(0, Math.sin(time * 11 - lap * 0.8)) ** 3;
					ctx.beginPath();
					ctx.arc(
						toX((aspect * i) / 8, v),
						toY((aspect * i) / 8, v),
						rail * (0.07 + glow * 0.1),
						0,
						Math.PI * 2
					);
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

			// The moment of the clear: a ring goes out from every pocket.
			if (since >= 0 && since < 0.8) {
				ctx.strokeStyle = trim;
				ctx.lineWidth = 3 * (1 - since / 0.8);
				for (const [pu, pv] of pockets()) {
					ctx.beginPath();
					ctx.arc(toX(pu, pv), toY(pu, pv), POCKET * unit * (1 + since * 7), 0, Math.PI * 2);
					ctx.stroke();
				}
			}

			for (const scrap of confetti) {
				if (scrap.landed) drawScrap(scrap);
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

			for (const scrap of confetti) {
				if (!scrap.landed) drawScrap(scrap);
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
			flutter(delta);
			draw(now / 1000);
		}

		function down(event: PointerEvent) {
			const cue = balls[0];
			if (!cue || cue.sinking) return;
			wakeAudio();
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
			countShot();
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
