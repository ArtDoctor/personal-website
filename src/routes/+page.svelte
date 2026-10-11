<script lang="ts">
	import { onMount } from 'svelte';
	import { countUp, prefersReducedMotion, reveal } from '$lib/actions/reveal';
	import { scrub } from '$lib/actions/scroll';
	import {
		about,
		alsoTrue,
		contact,
		formatResult,
		languages,
		languagesNote,
		person,
		projects,
		results,
		stack,
		traits,
		type Project
	} from '$lib/content';
	import Articles from '$lib/site/Articles.svelte';
	import ContactBlock from '$lib/site/ContactBlock.svelte';
	import Hero from '$lib/site/Hero.svelte';
	import PhotoStrip from '$lib/site/PhotoStrip.svelte';

	let { data } = $props();

	const featured = projects.slice(0, 4);
	const href = (project: Project) => (project.page ? `/portfolio/${project.page}` : project.link);

	let shown = $state(results.map((result) => result.value));

	// The "<1 min" row counts down from an hour instead of up from zero.
	const countFrom = (value: number) => (value === 1 ? 60 : 0);

	let wordIndex = 0;
	const aboutWords = about.map((paragraph) =>
		paragraph.split(' ').map((word) => ({ word, index: wordIndex++ }))
	);
	const wordCount = wordIndex;

	/** Six-step proficiency meter: which segments are filled. */
	const segments = (filled: number) => Array.from({ length: 6 }, (_, i) => i < filled);

	onMount(() => {
		if (!prefersReducedMotion()) shown = results.map((result) => countFrom(result.value));
	});

	function runCount(i: number) {
		const result = results[i];
		const from = countFrom(result.value);
		countUp(1, (t) => (shown[i] = from + (result.value - from) * t));
	}
</script>

<svelte:head>
	<title>{person.name}</title>
	<meta name="description" content={person.intro} />
</svelte:head>

<Hero />

<!-- ═══ About ═══ -->
<section class="band" id="about" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">01</span>
		<h2>A bit about me.</h2>
	</header>

	<div class="about-grid">
		<figure class="portrait" use:reveal>
			<div class="frame">
				<img src="/images/mai.png" alt="Portrait of Artem" width="561" height="701" />
			</div>
			<figcaption class="mono">fig. 1 · the author · {person.city}, from {person.from}</figcaption>
		</figure>

		<div>
			<div class="words" use:scrub>
				{#each aboutWords as paragraph}
					<p>
						{#each paragraph as { word, index }}
							<span style:--i={index / wordCount}>{word}</span>{' '}
						{/each}
					</p>
				{/each}
			</div>

			<dl class="traits">
				{#each traits as trait}
					<div>
						<dt class="mono">{trait.label.toLowerCase()}</dt>
						<dd>{trait.value}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>

<!-- ═══ Selected work ═══ -->
<section class="band" id="work">
	<header class="head" use:reveal>
		<span class="num mono">02</span>
		<h2>Some things I've built.</h2>
		<p class="lede">
			Mostly physics, simulation, and machine-learning experiments — the kind of projects where I
			learn by making the thing work.
		</p>
	</header>

	<ol class="featured">
		{#each featured as project, i}
			<li use:reveal>
				<a
					href={href(project)}
					target={project.page ? undefined : '_blank'}
					rel={project.page ? undefined : 'noopener noreferrer'}
				>
					<span class="plate"><img src={project.image} alt="" loading="lazy" /></span>
					<span class="idx mono">{String(i + 1).padStart(2, '0')}</span>
					<span class="title">{project.title}</span>
					<span class="arrow" aria-hidden="true">{project.page ? '→' : '↗'}</span>
					<span class="desc">{project.description}</span>
					<span class="stack mono">{project.stack}</span>
				</a>
			</li>
		{/each}
	</ol>

	<div class="buttons after">
		<a href="/portfolio" class="btn solid">
			All {projects.length} projects, and the small ones <span>→</span>
		</a>
	</div>
</section>

<!-- ═══ Results ═══ -->
<section class="band" id="results" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">03</span>
		<h2>Things that worked.</h2>
		<p class="lede">Not a CV. Just a few numbers I'm still pleased about.</p>
	</header>

	<ol class="rows">
		{#each results as result, i}
			<li use:reveal={{ threshold: 0.6, onenter: () => runCount(i) }}>
				<span class="value" aria-label={formatResult(result)}>{formatResult(result, shown[i])}</span
				>
				<span class="mono">{result.label}</span>
				<p class="note">{result.note}</p>
			</li>
		{/each}
	</ol>

	<ul class="also mono">
		{#each alsoTrue as item}
			<li>{item}</li>
		{/each}
	</ul>
</section>

<!-- ═══ Writing ═══ -->
<section class="band" id="writing">
	<header class="head" use:reveal>
		<span class="num mono">04</span>
		<h2>Latest writing.</h2>
		<p class="lede">
			The latest three articles from my Medium blog about AI, data science, Linux, and things I'm
			learning while building.
		</p>
	</header>

	<Articles articles={data.mediumArticles} />
	<p class="after">
		<a href="/medium" class="text-link">More about the writing →</a>
	</p>
</section>

<!-- ═══ Off duty ═══ -->
<section class="band" id="off-duty" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">05</span>
		<h2>Off duty.</h2>
		<p class="lede">{about[3]}</p>
	</header>

	<PhotoStrip />
	<div class="buttons after">
		<a href="/hobbies" class="btn solid">All the hobbies, and a pool table <span>→</span></a>
	</div>
</section>

<!-- ═══ Tools and languages ═══ -->
<section class="band" id="kit">
	<header class="head" use:reveal>
		<span class="num mono">06</span>
		<h2>Tools I reach for.</h2>
	</header>

	<div class="kit-grid">
		<dl class="stack-list">
			{#each stack as group}
				<div>
					<dt class="mono">{group.label.toLowerCase()}</dt>
					<dd>{group.items.join(', ')}</dd>
				</div>
			{/each}
		</dl>

		<div class="languages">
			<h3>Languages I speak</h3>
			<ul>
				{#each languages as language}
					<li>
						<span>{language.name}</span>
						<span class="level mono">{language.level}</span>
						<span class="meter6" aria-hidden="true">
							{#each segments(language.progress) as on}
								<i class:on></i>
							{/each}
						</span>
					</li>
				{/each}
			</ul>
			<p class="note">{languagesNote}</p>
		</div>
	</div>
</section>

<!-- ═══ Contact ═══ -->
<section class="band" id="contact" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">07</span>
		<h2>{contact.heading}</h2>
		<p class="lede">{contact.body}</p>
	</header>

	<ContactBlock />
</section>
