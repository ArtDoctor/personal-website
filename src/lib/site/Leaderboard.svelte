<script lang="ts">
	import { solar } from '$lib/content';

	const points = solar.history;

	// The chart is drawn at the container's real width, so labels stay the same size on a phone.
	let width = $state(640);
	const height = 340;
	const margin = { top: 26, right: 52, bottom: 40, left: 44 };

	const domain = { min: 0.32, max: 0.41 };
	const ticks = [0.32, 0.34, 0.36, 0.38, 0.4];

	const x = (i: number) =>
		margin.left + (i / (points.length - 1)) * (width - margin.left - margin.right);
	const y = (score: number) =>
		margin.top +
		((domain.max - score) / (domain.max - domain.min)) * (height - margin.top - margin.bottom);

	const line = $derived(
		points
			.map((point, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(point.score).toFixed(1)}`)
			.join('')
	);

	// One x label per day, under that day's first submission.
	const days = $derived(
		points.flatMap((point, i) =>
			i === 0 || points[i - 1].day !== point.day ? [{ i, day: point.day }] : []
		)
	);

	let hovered = $state<number | null>(null);
	const last = points.length - 1;

	function nearest(event: PointerEvent) {
		const box = (event.currentTarget as SVGElement).getBoundingClientRect();
		const position = event.clientX - box.left;
		let best = 0;
		for (let i = 1; i < points.length; i++) {
			if (Math.abs(x(i) - position) < Math.abs(x(best) - position)) best = i;
		}
		hovered = best;
	}
</script>

<figure class="chart">
	<div class="plot" bind:clientWidth={width}>
		<svg
			{width}
			{height}
			role="img"
			aria-label={`Public leaderboard score over ${points.length} submissions, from ${points[0].score.toFixed(2)} to ${points[last].score.toFixed(2)}`}
			onpointermove={nearest}
			onpointerleave={() => (hovered = null)}
		>
			{#each ticks as tick}
				<line
					class="gridline"
					x1={margin.left}
					x2={width - margin.right}
					y1={y(tick)}
					y2={y(tick)}
				/>
				<text
					class="tick"
					x={margin.left - 10}
					y={y(tick)}
					text-anchor="end"
					dominant-baseline="middle"
				>
					{tick.toFixed(2)}
				</text>
			{/each}

			{#each days as { i, day }}
				<line
					class="gridline"
					x1={x(i)}
					x2={x(i)}
					y1={height - margin.bottom}
					y2={height - margin.bottom + 6}
				/>
				<text class="tick" x={x(i)} y={height - margin.bottom + 22}>{day}</text>
			{/each}

			{#if hovered !== null}
				<line
					class="cross"
					x1={x(hovered)}
					x2={x(hovered)}
					y1={margin.top}
					y2={height - margin.bottom}
				/>
			{/if}

			<path class="line" d={line} />

			{#each points as point, i}
				<circle
					class="dot"
					class:best={i === last}
					cx={x(i)}
					cy={y(point.score)}
					r={hovered === i ? 6 : i === last ? 5 : 4}
				/>
			{/each}

			<!-- Only the two ends are labelled; the rest is on hover and in the table below. -->
			<text class="value" x={x(0)} y={y(points[0].score) - 14} text-anchor="start"
				>{points[0].score.toFixed(2)}</text
			>
			<text class="value" x={x(last) + 12} y={y(points[last].score)} dominant-baseline="middle">
				{points[last].score.toFixed(2)}
			</text>
		</svg>

		<!-- Keyboard users step through the same points the crosshair finds. -->
		{#each points as point, i}
			<button
				type="button"
				class="hit"
				style:left={`${x(i)}px`}
				style:top={`${y(point.score)}px`}
				aria-label={`Submission ${i + 1}, ${point.day}: ${point.score.toFixed(2)}. ${point.note}`}
				onfocus={() => (hovered = i)}
				onblur={() => (hovered = null)}
			></button>
		{/each}

		{#if hovered !== null}
			<div
				class="tip"
				class:flip={x(hovered) > width * 0.6}
				style:left={`${x(hovered)}px`}
				style:top={`${y(points[hovered].score)}px`}
			>
				<strong>{points[hovered].score.toFixed(2)}</strong>
				<span>{points[hovered].note}</span>
				<span class="mono">submission {hovered + 1} · {points[hovered].day}</span>
			</div>
		{/if}
	</div>

	<details>
		<summary class="mono">show as a table</summary>
		<table>
			<thead>
				<tr><th>#</th><th>Day</th><th>Score</th><th>What changed</th></tr>
			</thead>
			<tbody>
				{#each points as point, i}
					<tr
						><td>{i + 1}</td><td>{point.day}</td><td>{point.score.toFixed(2)}</td><td
							>{point.note}</td
						></tr
					>
				{/each}
			</tbody>
		</table>
	</details>

	<figcaption class="mono">
		Public leaderboard score (Panoptic Quality, higher is better) for each of my {points.length} submissions.
	</figcaption>
</figure>

<style>
	.plot {
		position: relative;
	}

	svg {
		display: block;
		overflow: visible;
		touch-action: pan-y;
	}

	.gridline {
		stroke: var(--line);
		stroke-width: 1;
	}

	.tick {
		fill: var(--dim);
		font-family: var(--mono);
		font-size: 10px;
		text-anchor: middle;
	}

	.tick[text-anchor='end'] {
		text-anchor: end;
	}

	.cross {
		stroke: var(--fg);
		stroke-width: 1;
		opacity: 0.35;
	}

	.line {
		fill: none;
		stroke: var(--fg);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* A ring in the surface colour keeps each dot legible where it sits on the line. */
	.dot {
		fill: var(--fg);
		stroke: var(--bg);
		stroke-width: 2;
	}

	.dot.best {
		fill: var(--hot);
	}

	.value {
		fill: var(--fg);
		font-family: var(--sans);
		font-size: 15px;
		font-stretch: 112%;
		font-weight: 650;
		font-variant-numeric: tabular-nums;
	}

	.hit {
		position: absolute;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		pointer-events: none;
		transform: translate(-50%, -50%);
	}

	.hit:focus-visible {
		outline: 1px solid var(--hot);
		outline-offset: 0;
	}

	.tip {
		position: absolute;
		z-index: 3;
		display: grid;
		gap: 2px;
		width: max-content;
		max-width: 15rem;
		padding: 10px 12px;
		border: 1px solid var(--line);
		background: var(--bg);
		font-size: 0.875rem;
		line-height: 1.35;
		pointer-events: none;
		transform: translate(14px, -50%);
	}

	.tip.flip {
		transform: translate(calc(-100% - 14px), -50%);
	}

	.tip strong {
		font-size: 1.25rem;
		font-stretch: 112%;
		font-variant-numeric: tabular-nums;
	}

	.tip .mono {
		color: var(--dim);
	}

	details {
		margin-top: 6px;
	}

	summary {
		width: fit-content;
		color: var(--dim);
		cursor: pointer;
	}

	summary:hover {
		color: var(--fg);
	}

	table {
		width: 100%;
		margin-top: 12px;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		padding: 7px 12px 7px 0;
		border-bottom: 1px solid var(--line);
		text-align: left;
		font-variant-numeric: tabular-nums;
	}

	th {
		color: var(--dim);
		font-weight: 500;
	}
</style>
