<script lang="ts">
	import { HOT, MONO, ink, seeded, smooth, stage, type Frame } from './stage';

	let { active = true }: { active?: boolean } = $props();

	/*
	 * What the validator does, as a diagram: an idea goes in, four analyses run on it with web
	 * search behind each, and a report comes out. No scores here, since they would be made up.
	 */
	const IDEA = 'Magic birthday cake generator.';
	const ANALYSES = ['market', 'problem', 'competitors', 'customers'];
	const LOOP = 10.5;

	// Search results on their way in: a few per analysis, each with its own start and delay.
	const random = seeded(11);
	const results = ANALYSES.flatMap((_, node) =>
		Array.from({ length: 16 }, () => ({
			node,
			// Below and to the right of the node, clear of its label.
			angle: 0.2 + random() * 1.1,
			reach: 0.5 + random() * 0.5,
			delay: random()
		}))
	);

	function draw({ ctx, width, height, time }: Frame) {
		const t = time % LOOP;
		const small = width < 520;
		const pad = small ? 12 : 20;
		const size = small ? 9 : 11;
		const out = 1 - smooth(LOOP - 0.8, LOOP, t);

		const idea = { x: width * 0.13, y: height * 0.5 };
		const report = { x: width * 0.9, y: height * 0.5 };
		const nodes = ANALYSES.map((label, i) => ({
			label,
			x: width * 0.52,
			y: height * (0.22 + i * 0.185),
			// When the analysis starts, and how long it takes.
			from: 2.3 + i * 0.35,
			lasts: 2.6 + ((i * 7) % 4) * 0.45
		}));
		const radius = Math.max(4, height * 0.022);

		ctx.font = `${size}px ${MONO}`;
		ctx.textBaseline = 'middle';
		ctx.lineWidth = 1;
		ctx.globalAlpha = out;

		const link = (
			from: { x: number; y: number },
			to: { x: number; y: number },
			progress: number,
			colour: string
		) => {
			if (progress <= 0) return;
			const mid = (from.x + to.x) / 2;
			ctx.strokeStyle = colour;
			ctx.beginPath();
			ctx.moveTo(from.x, from.y);
			// A bezier, cut where the signal has got to.
			for (let s = 0.04; s <= progress + 0.001; s += 0.04) {
				const u = 1 - s;
				ctx.lineTo(
					u * u * u * from.x + 3 * u * u * s * mid + 3 * u * s * s * mid + s * s * s * to.x,
					u * u * u * from.y + 3 * u * u * s * from.y + 3 * u * s * s * to.y + s * s * s * to.y
				);
			}
			ctx.stroke();
		};

		// The idea, typed in.
		const typed = IDEA.slice(0, Math.floor(smooth(0.3, 1.9, t) * IDEA.length));
		ctx.textAlign = 'left';
		ctx.fillStyle = ink(0.45);
		ctx.fillText('idea', pad, pad + 4);
		ctx.fillStyle = ink();
		ctx.fillText(typed + (t < 2.2 && t % 0.7 < 0.4 ? '▍' : ''), pad, height - pad);

		let finished = 0;
		for (const node of nodes) {
			const reached = smooth(1.9, node.from, t);
			const work = smooth(node.from, node.from + node.lasts, t);
			const done = work >= 1;
			if (done) finished++;

			link(idea, node, reached, ink(0.3));
			link(node, report, smooth(node.from + node.lasts, node.from + node.lasts + 0.6, t), HOT);

			// Search results drifting in while the analysis runs.
			if (work > 0 && !done) {
				for (const result of results) {
					if (nodes[result.node] !== node) continue;
					const life = (work * 2.2 + result.delay) % 1;
					const distance = (1 - life) * result.reach * height * 0.24 + radius;
					ctx.fillStyle = ink(0.85 * Math.sin(life * Math.PI));
					ctx.fillRect(
						node.x + Math.cos(result.angle) * distance * 1.7 - 1,
						node.y + Math.sin(result.angle) * distance * 0.5 - 1,
						small ? 2 : 2.5,
						small ? 2 : 2.5
					);
				}
			}

			if (reached <= 0) continue;
			ctx.globalAlpha = out * reached;
			ctx.fillStyle = '#0c0c0e';
			ctx.strokeStyle = ink(0.35);
			ctx.beginPath();
			ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			// Progress round the node, then a solid dot when it is done.
			ctx.strokeStyle = ink();
			ctx.lineWidth = 1.6;
			ctx.beginPath();
			ctx.arc(node.x, node.y, radius, -Math.PI / 2, -Math.PI / 2 + work * Math.PI * 2);
			ctx.stroke();
			ctx.lineWidth = 1;
			if (done) {
				ctx.fillStyle = ink();
				ctx.beginPath();
				ctx.arc(node.x, node.y, radius * 0.45, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.fillStyle = ink(done ? 1 : 0.5);
			ctx.textAlign = 'left';
			ctx.fillText(node.label, node.x + radius + 8, node.y - radius - 6);
			ctx.globalAlpha = out;
		}

		// Where it starts, and where it ends up.
		ctx.fillStyle = ink();
		ctx.beginPath();
		ctx.arc(idea.x, idea.y, radius * 1.3, 0, Math.PI * 2);
		ctx.fill();

		const ready = smooth(7.3, 7.9, t);
		ctx.strokeStyle = ink(0.35);
		ctx.fillStyle = '#0c0c0e';
		ctx.beginPath();
		ctx.arc(report.x, report.y, radius * 1.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.globalAlpha = out * ready;
		ctx.fillStyle = HOT;
		ctx.beginPath();
		ctx.arc(report.x, report.y, radius * 1.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = out;

		ctx.textAlign = 'right';
		ctx.fillStyle = ink(ready ? 1 : 0.45);
		ctx.fillText('report', width - pad, report.y + radius * 1.3 + size * 1.6);
		ctx.fillStyle = ink(0.45);
		ctx.fillText(`${finished} / ${ANALYSES.length} analyses`, width - pad, pad + 4);
		ctx.globalAlpha = 1;
	}
</script>

<canvas class="visual" use:stage={{ draw, active, still: 9 }} aria-hidden="true"></canvas>
