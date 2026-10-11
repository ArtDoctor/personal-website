<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { experiments, links, person } from '$lib/content';
	import WorkList from '$lib/site/WorkList.svelte';
</script>

<svelte:head>
	<title>Portfolio · {person.name}</title>
	<meta
		name="description"
		content="Mostly physics, simulation, and machine-learning experiments — the kind of projects where I learn by making the thing work."
	/>
</svelte:head>

<section class="band page-head">
	<p class="crumb mono"><a href="/">home</a><b>/</b><span>portfolio</span></p>
	<h1>Some things I've built.</h1>
	<p class="intro">
		Mostly physics, simulation, and machine-learning experiments — the kind of projects where I
		learn by making the thing work.
	</p>
</section>

<section class="band">
	<WorkList />
</section>

<section class="band" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">+</span>
		<h2>Smaller experiments.</h2>
		<p class="lede">Weekend things, jokes that got out of hand, and tools I wanted for myself.</p>
	</header>

	<ul class="experiments">
		{#each experiments as experiment}
			<li>
				<a href={experiment.link} target="_blank" rel="noopener noreferrer">
					<span class="title">{experiment.title}</span>
					<span class="desc">{experiment.description}</span>
					<span class="stack mono">{experiment.stack}</span>
				</a>
			</li>
		{/each}
		<li>
			<a href={links.github} target="_blank" rel="noopener noreferrer" class="rest">
				<span class="title">The rest ↗</span>
				<span class="desc">Simulations, Kaggle notebooks, course projects and abandoned ideas.</span
				>
				<span class="stack mono">github.com/ArtDoctor</span>
			</a>
		</li>
	</ul>
</section>
