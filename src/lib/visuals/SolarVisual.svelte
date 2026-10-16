<script lang="ts">
	import data from '$lib/data/solar.json';

	let { active = true }: { active?: boolean } = $props();

	/*
	 * One loop, in seconds: the bare Sun, then the experts' outlines trace in one by one, then
	 * the model's, then both come off again in the same order. The loop is 20.5 s, and these
	 * starts have to agree with the keyframes in the style block, which are percentages of it.
	 */
	const EXPERT_START = 1.6;
	const EXPERT_STEP = 0.2;
	const MODEL_START = 6.6;
	const MODEL_STEP = 0.25;

	/** Middle of a path in the 1000 × 1000 frame, from its points. */
	function centre(d: string) {
		const numbers = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
		let x = 0;
		for (let i = 0; i < numbers.length; i += 2) x += numbers[i];
		return x / Math.max(1, numbers.length / 2);
	}

	/** Left to right, so both sets sweep across the disc the same way. */
	const sweep = (paths: string[], start: number, step: number) =>
		paths
			.map((d) => ({ d, x: centre(d) }))
			.sort((a, b) => a.x - b.x)
			.map(({ d }, i) => ({ d, delay: start + i * step }));

	const expert = sweep(data.disk.expert, EXPERT_START, EXPERT_STEP);
	const model = sweep(data.disk.model, MODEL_START, MODEL_STEP);
</script>

<!-- One training image: the bare Sun, then the outlines the experts drew, then the ones the model found. -->
<div class="visual" class:paused={!active} aria-hidden="true">
	<div class="sun">
		<img src="/images/projects/solar-disk.webp" alt="" loading="lazy" />
		<svg viewBox="0 0 1000 1000">
			<g class="expert">
				{#each expert as path}
					<path d={path.d} pathLength="1" style:animation-delay="{path.delay}s" />
				{/each}
			</g>
			<g class="model">
				{#each model as path}
					<path d={path.d} pathLength="1" style:animation-delay="{path.delay}s" />
				{/each}
			</g>
		</svg>
	</div>
	<p class="key mono">
		<span class="expert" style:animation-delay="{EXPERT_START}s"><i></i>expert</span>
		<span class="model" style:animation-delay="{MODEL_START}s"><i></i>my model</span>
	</p>
</div>

<style>
	.visual {
		overflow: hidden;
		background: #000;
	}

	.sun {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 132%;
		aspect-ratio: 1;
		translate: -50% -50%;
	}

	img {
		width: 100%;
		height: 100%;
		filter: contrast(1.5) brightness(1.04);
	}

	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: none;
	}

	/*
	 * Without motion every outline simply shows, which is what these base values are. The
	 * animations hide each path before its delay and trace it in, hold it, then retract it.
	 */
	path {
		stroke-linejoin: round;
		stroke-dasharray: 1 1.1;
		animation: 20.5s linear infinite both;
	}

	.paused path,
	.paused .key span {
		animation-play-state: paused;
	}

	/* Two series, told apart by more than colour: a white outline, and a filled orange one. */
	.expert path {
		stroke: #fff;
		stroke-width: 3;
		animation-name: expert;
	}

	.model path {
		stroke: var(--hot);
		stroke-width: 3.6;
		fill: var(--hot);
		fill-opacity: 0.25;
		animation-name: model;
	}

	/* Expert outlines: 1.4 s to trace, on for 12 s from the start, 1.2 s to come off. */
	@keyframes expert {
		0% {
			stroke-dashoffset: 1;
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}

		6.83%,
		58.54% {
			stroke-dashoffset: 0;
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}

		64.39%,
		100% {
			stroke-dashoffset: -1;
		}
	}

	/* The model's: the same trace, then the fill, on for 8.4 s so they come off after the experts'. */
	@keyframes model {
		0% {
			stroke-dashoffset: 1;
			fill-opacity: 0;
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}

		6.83% {
			stroke-dashoffset: 0;
			fill-opacity: 0;
		}

		9.76%,
		40.98% {
			stroke-dashoffset: 0;
			fill-opacity: 0.25;
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}

		43.41% {
			fill-opacity: 0;
		}

		46.83%,
		100% {
			stroke-dashoffset: -1;
			fill-opacity: 0;
		}
	}

	.key {
		position: absolute;
		bottom: clamp(10px, 4%, 18px);
		left: clamp(12px, 4%, 20px);
		display: flex;
		gap: 16px;
		color: #f1f1ec;
	}

	/* Each label lights up while its outlines are on the Sun. */
	.key span {
		display: flex;
		align-items: center;
		gap: 7px;
		animation: 20.5s linear infinite both;
	}

	.key .expert {
		animation-name: expert-key;
	}

	.key .model {
		animation-name: model-key;
	}

	.key i {
		width: 12px;
		height: 8px;
		border: 1px solid #fff;
	}

	.key .model i {
		border-color: var(--hot);
		background: rgba(255, 79, 26, 0.4);
	}

	@keyframes expert-key {
		0%,
		80%,
		100% {
			opacity: 0.4;
		}

		1.95%,
		78.05% {
			opacity: 1;
		}
	}

	@keyframes model-key {
		0%,
		61.46%,
		100% {
			opacity: 0.4;
		}

		1.95%,
		58.54% {
			opacity: 1;
		}
	}
</style>
