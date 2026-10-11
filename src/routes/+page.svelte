<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { scrub } from '$lib/actions/scroll';
	import {
		about,
		alsoTrue,
		contact,
		facts,
		formatResult,
		languages,
		languagesNote,
		person,
		projects,
		results,
		stack,
		type Project
	} from '$lib/content';
	import Articles from '$lib/site/Articles.svelte';
	import ContactBlock from '$lib/site/ContactBlock.svelte';
	import Hero from '$lib/site/Hero.svelte';
	import PhotoStrip from '$lib/site/PhotoStrip.svelte';
	import ProjectVisual from '$lib/visuals/ProjectVisual.svelte';

	let { data } = $props();

	// The first of these gets the big plate.
	const featured = projects.slice(0, 4);
	const href = (project: Project) => (project.page ? `/portfolio/${project.page}` : project.link);

	let wordIndex = 0;
	const aboutWords = about
		.slice(0, 2)
		.map((paragraph) => paragraph.split(' ').map((word) => ({ word, index: wordIndex++ })));
	const wordCount = wordIndex;

	/** Six-step proficiency meter: which segments are filled. */
	const segments = (filled: number) => Array.from({ length: 6 }, (_, i) => i < filled);
</script>

<svelte:head>
	<title>{person.name}</title>
	<meta name="description" content={person.intro} />
</svelte:head>

<Hero />

<!-- ═══ Results ═══ -->
<section class="band" id="results" data-tone="dark">
	<header class="head slim" use:reveal>
		<h2>Things that worked.</h2>
		<p class="lede">A few numbers I'm still pleased about.</p>
	</header>

	<ol class="rows">
		{#each results as result, i}
			<li class:lead={i === 0} use:reveal={{ threshold: 0.5 }}>
				<span class="value"><span>{formatResult(result)}</span></span>
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

<!-- ═══ Selected work ═══ -->
<section class="band" id="work">
	<header class="head plain" use:reveal>
		<h2>Some things I've built.</h2>
		<p class="lede">
			Mostly physics, simulation, and machine-learning experiments - the kind of projects where I
			learn by making the thing work.
		</p>
	</header>

	<ol class="featured">
		{#each featured as project, i}
			<li class:lead={i === 0} use:reveal>
				<a
					href={href(project)}
					target={project.page ? undefined : '_blank'}
					rel={project.page ? undefined : 'noopener noreferrer'}
				>
					<span class="plate"><ProjectVisual {project} /></span>
					<span class="text">
						<span class="stack mono">{project.stack}</span>
						<span class="title">{project.title}</span>
						<span class="desc">{project.description}</span>
						<span class="go mono"
							>{project.page ? 'Read the write-up →' : `${project.linkLabel} ↗`}</span
						>
					</span>
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

<!-- ═══ About, and off duty ═══ -->
<section class="band" id="about" data-tone="dark">
	<header class="head slim" use:reveal>
		<h2>A bit about me.</h2>
	</header>

	<div class="about-grid">
		<figure class="portrait" use:reveal>
			<div class="frame">
				<picture style="display: block">
					<source srcset="/images/mai.webp" type="image/webp" />
					<img
						src="/images/mai.png"
						alt="Portrait of Artem"
						width="561"
						height="701"
						loading="lazy"
					/>
				</picture>
			</div>
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

			<dl class="facts">
				{#each facts as fact}
					<div>
						<dt class="mono">{fact.label.toLowerCase()}</dt>
						<dd>{fact.value}</dd>
					</div>
				{/each}
				<div>
					<dt class="mono">tools</dt>
					<dd>
						{#each stack as group}
							<span>{group.items.join(', ')}</span>
						{/each}
					</dd>
				</div>
			</dl>
		</div>
	</div>

	<div class="spoken">
		<header class="head slim" use:reveal>
			<h2>Languages I speak.</h2>
			<p class="lede">{languagesNote}</p>
		</header>

		<ul class="languages">
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
	</div>

	<div class="off-duty">
		<header class="head slim" use:reveal>
			<h2>Off duty.</h2>
			<p class="lede">{about[2]}</p>
		</header>

		<PhotoStrip />
		<div class="buttons after">
			<a href="/hobbies" class="btn solid">All the hobbies, and a pool table <span>→</span></a>
		</div>
	</div>
</section>

<!-- ═══ Writing ═══ -->
<section class="band" id="writing">
	<header class="head plain" use:reveal>
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

<!-- ═══ Contact ═══ -->
<section class="band" id="contact" data-tone="dark">
	<header class="head slim" use:reveal>
		<h2>{contact.heading}</h2>
		<p class="lede">{contact.body}</p>
	</header>

	<ContactBlock />
</section>
