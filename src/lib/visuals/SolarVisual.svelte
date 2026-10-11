<script lang="ts">
	import data from '$lib/data/solar.json';

	let { active = true }: { active?: boolean } = $props();

	// The square the close-up on the project page is cut from: the view drifts in to it and back.
	const [x, y, size] = data.closeup.box;
	const focus = { x: (x + size / 2) / 10, y: (y + size / 2) / 10 };
</script>

<!-- One training image, with the outlines the experts drew and the ones the model found. -->
<div class="visual" class:paused={!active} aria-hidden="true">
	<div class="sun" style:--fx="{focus.x}%" style:--fy="{focus.y}%">
		<img src="/images/projects/solar-disk.webp" alt="" loading="lazy" />
		<svg viewBox="0 0 1000 1000">
			<g class="expert">
				{#each data.disk.expert as d}
					<path {d} />
				{/each}
			</g>
			<g class="model">
				{#each data.disk.model as d}
					<path {d} />
				{/each}
			</g>
		</svg>
	</div>
	<p class="key mono">
		<span><i class="expert"></i>expert</span>
		<span><i class="model"></i>my model</span>
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
		transform-origin: var(--fx) var(--fy);
		animation: drift 22s ease-in-out infinite;
	}

	.paused .sun {
		animation-play-state: paused;
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

	path {
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	/* Two series, told apart by more than colour: a white outline, and a filled orange one. */
	.expert path {
		stroke: #fff;
		stroke-width: 1.2px;
	}

	.model path {
		stroke: var(--hot);
		stroke-width: 1.5px;
		fill: var(--hot);
		fill-opacity: 0.25;
	}

	.key {
		position: absolute;
		bottom: clamp(10px, 4%, 18px);
		left: clamp(12px, 4%, 20px);
		display: flex;
		gap: 16px;
		color: #f1f1ec;
	}

	.key span {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.key i {
		width: 12px;
		height: 8px;
		border: 1px solid #fff;
	}

	.key i.model {
		border-color: var(--hot);
		background: rgba(255, 79, 26, 0.4);
	}

	@keyframes drift {
		0%,
		12% {
			transform: none;
		}

		45%,
		67% {
			transform: translate(calc(50% - var(--fx)), calc(50% - var(--fy))) scale(2.6);
		}

		100% {
			transform: none;
		}
	}
</style>
