<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import data from '$lib/data/solar.json';

	type Props = {
		/** The whole disc, or the native-resolution crop around the largest filament. */
		view?: 'disk' | 'closeup';
		caption: string;
		/** Show the legend and the outline toggle. */
		controls?: boolean;
	};

	let { view = 'disk', caption, controls = true }: Props = $props();

	let show = $state<'both' | 'expert' | 'model'>('both');

	const paths = $derived(data[view]);
	const image = $derived(
		view === 'disk' ? '/images/projects/solar-disk.webp' : '/images/projects/solar-closeup.webp'
	);

	const options = [
		{ id: 'both', label: 'both' },
		{ id: 'expert', label: 'expert labels' },
		{ id: 'model', label: 'my model' }
	] as const;
</script>

<figure class="solar" use:reveal={{ threshold: 0.25 }}>
	<div class="plate">
		<img src={image} alt="The Sun in H-alpha light, with filaments outlined" loading="lazy" />
		<svg viewBox="0 0 1000 1000" aria-hidden="true">
			<g class="expert" class:off={show === 'model'}>
				{#each paths.expert as d}
					<path {d} pathLength="1" />
				{/each}
			</g>
			<g class="model" class:off={show === 'expert'}>
				{#each paths.model as d}
					<path {d} pathLength="1" />
				{/each}
			</g>
			{#if view === 'disk'}
				<rect
					class="window"
					x={data.closeup.box[0]}
					y={data.closeup.box[1]}
					width={data.closeup.box[2]}
					height={data.closeup.box[2]}
				/>
			{/if}
		</svg>
	</div>

	{#if controls}
		<div class="controls mono">
			<div class="keys">
				<span><i class="key expert"></i>expert labels ({data.labelled})</span>
				<span><i class="key model"></i>my model ({data.found})</span>
			</div>
			<div class="toggle" role="group" aria-label="Which outlines to show">
				{#each options as option}
					<button
						type="button"
						aria-pressed={show === option.id}
						onclick={() => (show = option.id)}
					>
						{option.label}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<figcaption class="mono">{caption}</figcaption>
</figure>

<style>
	.solar .plate {
		aspect-ratio: 1;
		background: #000;
	}

	.plate img {
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
		stroke-dasharray: 1 1.1;
		transition:
			stroke-dashoffset 1.6s ease,
			fill-opacity 0.8s ease 1.2s;
	}

	g {
		transition: opacity 0.35s;
	}

	g.off {
		opacity: 0;
	}

	/* Two series, told apart by more than colour: solid white for the experts, orange for the model. */
	.expert path {
		stroke: #fff;
		stroke-width: 2.4;
	}

	.model path {
		stroke: #ff4f1a;
		stroke-width: 3;
		fill: #ff4f1a;
		fill-opacity: 0.22;
	}

	/* Outlines draw themselves in the first time the figure scrolls into view. */
	:global(.site.ready) .solar:not(:global(.is-in)) path {
		stroke-dashoffset: 1.05;
		fill-opacity: 0;
	}

	.window {
		stroke: rgba(255, 255, 255, 0.55);
		stroke-width: 1.6;
		stroke-dasharray: 8 8;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 12px 24px;
		margin-top: 16px;
	}

	.keys {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
	}

	.keys span {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.key {
		width: 26px;
		height: 14px;
		background:
			linear-gradient(#fff, #fff) center / 16px 2px no-repeat,
			#3a3a3a;
	}

	.key.model {
		background:
			linear-gradient(#ff4f1a, #ff4f1a) center / 16px 6px no-repeat,
			#3a3a3a;
	}

	.toggle {
		display: flex;
		border: 1px solid var(--line);
	}

	.toggle button {
		padding: 8px 12px;
		color: var(--dim);
		transition:
			background 0.2s,
			color 0.2s;
	}

	.toggle button + button {
		border-left: 1px solid var(--line);
	}

	.toggle button:hover {
		color: var(--fg);
	}

	.toggle button[aria-pressed='true'] {
		background: var(--fg);
		color: var(--bg);
	}
</style>
