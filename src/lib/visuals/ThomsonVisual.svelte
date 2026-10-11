<script lang="ts">
	import { HOT, MONO, clamp, ink, seeded, smooth, stage, type Frame } from './stage';

	let { active = true }: { active?: boolean } = $props();

	/*
	 * A Thomson spectrometer shot, redrawn from the pipeline's own output for the example image
	 * in the repo: each ion species lands on a parabola y = a·x², and these are the eight
	 * curvatures it fitted, with the species it assigned. One trace it could not identify.
	 */
	const TRACES = [
		{ label: 'C6+', a: 1.557e-4 },
		{ label: 'C5+', a: 1.923e-4 },
		{ label: 'C4+', a: 2.399e-4 },
		{ label: 'O5+', a: 2.839e-4 },
		{ label: 'C3+', a: 3.26e-4 },
		{ label: '?', a: 3.828e-4 },
		{ label: 'C2+', a: 5.824e-4 },
		{ label: 'Si3+', a: 7.821e-4 }
	];
	/** Detector pixels from the zero point to the far edge of the fit. */
	const SPAN = 974;
	const RMSE = 0.58;

	const SWEEP = 4.6;
	const HOLD = 3.6;
	const FADE = 0.8;

	// Detector noise: one small tile of speckle, laid at a new offset every frame.
	let noise: HTMLCanvasElement | undefined;
	function speckle() {
		const tile = document.createElement('canvas');
		tile.width = tile.height = 160;
		const context = tile.getContext('2d')!;
		const random = seeded(7);
		for (let i = 0; i < 5200; i++) {
			context.fillStyle = ink(random() * 0.13);
			context.fillRect(random() * 160, random() * 160, 1, 1);
		}
		return tile;
	}

	function draw({ ctx, width, height, time }: Frame) {
		const ox = width * 0.085;
		const oy = height * 0.87;
		const scale = (width * 0.985 - ox) / SPAN;
		const top = height * 0.07;
		const sx = (x: number) => ox + x * scale;
		const sy = (x: number, a: number) => oy - a * x * x * scale;

		const cycle = time % (SWEEP + HOLD + FADE);
		const swept = smooth(0, SWEEP, cycle) * SPAN;
		const shown = 1 - smooth(SWEEP + HOLD, SWEEP + HOLD + FADE, cycle);

		// The signal: each trace starts where its fastest ions land and dims toward the slow end.
		ctx.lineCap = 'round';
		for (const [index, trace] of TRACES.entries()) {
			const start = 70 + index * 16;
			const steps = 44;
			for (const [lineWidth, strength] of [
				[6.5 * Math.max(0.6, scale * 1.6), 0.09],
				[1.6, 0.62]
			]) {
				ctx.lineWidth = lineWidth;
				for (let i = 0; i < steps; i++) {
					const from = start + ((SPAN + 60 - start) * i) / steps;
					const to = start + ((SPAN + 60 - start) * (i + 1)) / steps;
					const along = (from - start) / (SPAN - start);
					const glow = smooth(0, 0.07, along) * (1 - along * 0.55) * (0.72 + 0.28 * (index % 3));
					ctx.strokeStyle = ink(glow * strength);
					ctx.beginPath();
					ctx.moveTo(sx(from), sy(from, trace.a));
					ctx.lineTo(sx(to), sy(to, trace.a));
					ctx.stroke();
				}
			}
		}

		// Where undeflected light and neutrals hit: the zero point every parabola shares.
		const halo = ctx.createRadialGradient(ox, oy, 0, ox, oy, width * 0.13);
		halo.addColorStop(0, ink(0.95));
		halo.addColorStop(0.1, ink(0.5));
		halo.addColorStop(0.45, ink(0.07));
		halo.addColorStop(1, ink(0));
		ctx.fillStyle = halo;
		ctx.fillRect(0, 0, width, height);

		noise ??= speckle();
		const pattern = ctx.createPattern(noise, 'repeat');
		if (pattern) {
			ctx.save();
			ctx.translate(-((time * 977) % 160), -((time * 613) % 160));
			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, width + 160, height + 160);
			ctx.restore();
		}

		// The fits, drawn in as the scan passes.
		ctx.lineCap = 'butt';
		ctx.lineWidth = 1.2;
		ctx.strokeStyle = HOT;
		ctx.globalAlpha = shown;
		ctx.setLineDash([5, 4]);
		for (const trace of TRACES) {
			ctx.beginPath();
			for (let x = 64; x <= swept; x += 8) ctx.lineTo(sx(x), sy(x, trace.a));
			ctx.stroke();
		}
		ctx.setLineDash([]);

		if (cycle < SWEEP) {
			ctx.globalAlpha = 0.5 * smooth(0, 0.3, cycle) * (1 - smooth(SWEEP - 0.4, SWEEP, cycle));
			ctx.beginPath();
			ctx.moveTo(sx(swept), 0);
			ctx.lineTo(sx(swept), height);
			ctx.stroke();
		}

		// Species labels, set where each curve still has room.
		const small = width < 520;
		const size = small ? 9 : 11;
		ctx.font = `${size}px ${MONO}`;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		let found = 0;
		for (const [index, trace] of TRACES.entries()) {
			const exit = Math.sqrt((oy - top) / (trace.a * scale)) - 46;
			const at = Math.min(SPAN * (index % 2 ? 0.8 : 0.91), exit);
			const alpha = smooth(at, at + 50, swept) * shown;
			if (alpha <= 0) continue;
			found++;
			const x = sx(at);
			const y = sy(at, trace.a);
			const boxWidth = ctx.measureText(trace.label).width + size * 1.1;
			const boxHeight = size * 1.9;
			ctx.globalAlpha = alpha;
			ctx.fillStyle = '#0c0c0e';
			ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
			ctx.strokeStyle = HOT;
			ctx.lineWidth = 1;
			ctx.strokeRect(x - boxWidth / 2 + 0.5, y - boxHeight / 2 + 0.5, boxWidth - 1, boxHeight - 1);
			ctx.fillStyle = ink();
			ctx.fillText(trace.label, x, y + 0.5);
		}

		const pad = small ? 12 : 20;
		ctx.globalAlpha = 1;
		ctx.textBaseline = 'alphabetic';
		ctx.textAlign = 'left';
		ctx.fillStyle = ink(0.45);
		ctx.fillText('y = a·x²,  a ∝ m/q', pad, pad + 8);
		ctx.globalAlpha = clamp(shown);
		ctx.textAlign = 'right';
		ctx.fillText(
			found === TRACES.length
				? `${found} parabolas · rmse ${RMSE} px`
				: `${found} / ${TRACES.length} parabolas`,
			width - pad,
			height - pad - 1
		);
		ctx.globalAlpha = 1;
	}
</script>

<canvas class="visual" use:stage={{ draw, active, still: 6 }} aria-hidden="true"></canvas>
