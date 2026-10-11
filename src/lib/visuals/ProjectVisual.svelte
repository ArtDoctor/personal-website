<script lang="ts">
	import type { Component } from 'svelte';
	import type { Project } from '$lib/content';
	import CarsVisual from './CarsVisual.svelte';
	import KoloVisual from './KoloVisual.svelte';
	import SantiwenVisual from './SantiwenVisual.svelte';
	import SolarVisual from './SolarVisual.svelte';
	import ThomsonVisual from './ThomsonVisual.svelte';
	import YazeroVisual from './YazeroVisual.svelte';

	type Props = {
		project: Project;
		/** False holds the picture still, for a project that is not the one being shown. */
		active?: boolean;
	};

	let { project, active = true }: Props = $props();

	/** Projects with a picture drawn for them, by slug. The rest show their screenshot. */
	const drawn: Record<string, Component<{ active?: boolean }>> = {
		thomson: ThomsonVisual,
		kolo: KoloVisual,
		solar: SolarVisual,
		'genetic-cars': CarsVisual,
		yazero: YazeroVisual,
		santiwen: SantiwenVisual
	};

	const Drawn = $derived(drawn[project.slug]);
</script>

{#if Drawn}
	<Drawn {active} />
{:else}
	<img class="visual" src={project.image} alt="" loading="lazy" />
{/if}
