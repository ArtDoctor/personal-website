<script lang="ts">
	import { person } from '$lib/content';
	import Articles from '$lib/site/Articles.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Writing · {person.name}</title>
	<meta
		name="description"
		content="The latest articles from my Medium blog about AI, data science, Linux, and things I'm learning while building."
	/>
</svelte:head>

<section class="band page-head">
	<p class="crumb mono"><a href="/">home</a><b>/</b><span>medium</span></p>
	<h1>Latest writing.</h1>
	<p class="intro">
		The latest three articles from my Medium blog about AI, data science, Linux, and things I'm
		learning while building.
	</p>
</section>

<section class="band">
	<Articles articles={data.mediumArticles} large />
	<div class="buttons after">
		<a href={data.mediumBlogUrl} target="_blank" rel="noopener noreferrer" class="btn solid">
			Visit Medium blog <span>↗</span>
		</a>
	</div>
</section>

<section class="band" data-tone="dark">
	<dl class="stats">
		<div>
			<dd>20+</dd>
			<dt class="mono">articles so far</dt>
		</div>
		<div>
			<dd>~5,000</dd>
			<dt class="mono">followers on Medium</dt>
		</div>
		<div>
			<dd>5+</dd>
			<dt class="mono">talks on Python, ML and MLOps</dt>
		</div>
		<div>
			<dd>3</dd>
			<dt class="mono">shown here, the rest on Medium</dt>
		</div>
	</dl>
</section>
