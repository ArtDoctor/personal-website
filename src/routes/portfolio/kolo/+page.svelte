<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { kolo, person } from '$lib/content';

	const largest = Math.max(...kolo.clusters.map((cluster) => cluster.tracks));

	/** Autoplaying loops are decoration; with reduced motion they stay on their first frame. */
	function loop(video: HTMLVideoElement) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) video.play().catch(() => {});
			else video.pause();
		});
		observer.observe(video);
		return { destroy: () => observer.disconnect() };
	}
</script>

<svelte:head>
	<title>Kolo · {person.name}</title>
	<meta name="description" content={kolo.pitch} />
</svelte:head>

<section class="band page-head">
	<p class="crumb mono">
		<a href="/">home</a><b>/</b><a href="/portfolio">portfolio</a><b>/</b><span>kolo</span>
	</p>
	<h1>Kolo</h1>
	<p class="intro">{kolo.pitch}</p>
	<div class="buttons after">
		<a href={kolo.github} target="_blank" rel="noopener noreferrer" class="btn solid">
			Code on GitHub <span>↗</span>
		</a>
	</div>
</section>

<section class="band">
	<figure class="rise" use:reveal>
		<div class="plate wide-plate">
			<video
				use:loop
				src="/images/projects/kolo-taste.mp4"
				poster="/images/projects/kolo-taste.webp"
				muted
				loop
				playsinline
				preload="metadata"
				aria-label="Flying through a 3D map of a music library, each dot a track"
			></video>
		</div>
		<figcaption class="mono">
			fig. 1 · the taste universe. every dot is a track from my library, placed by how it sounds.
		</figcaption>
	</figure>
</section>

<section class="band" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">01</span>
		<h2>How it works.</h2>
		<p class="lede">Three steps, all running on my own machine. No accounts, no cloud.</p>
	</header>

	<ol class="steps">
		{#each kolo.steps as step, i}
			<li class="rise" use:reveal>
				<span class="n mono">{String(i + 1).padStart(2, '0')}</span>
				<h3>{step.title}</h3>
				<p>{step.text}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="band">
	<dl class="stats">
		{#each kolo.numbers as number}
			<div>
				<dd>{number.value}</dd>
				<dt class="mono">{number.label}</dt>
			</div>
		{/each}
	</dl>
</section>

<section class="band">
	<header class="head" use:reveal>
		<span class="num mono">02</span>
		<h2>My taste, in six clusters.</h2>
		<p class="lede">
			K-means found the groups. I looked at what sat near each centre and named them myself.
		</p>
	</header>

	<div class="split">
		<ol class="bars" use:reveal>
			{#each kolo.clusters as cluster}
				<li>
					<span>{cluster.name}</span>
					<span class="count mono">{cluster.tracks}</span>
					<i style:--w={cluster.tracks / largest}></i>
				</li>
			{/each}
		</ol>

		<figure>
			<div class="plate">
				<img
					src="/images/projects/kolo-tsne.webp"
					alt="A 2D t-SNE projection of the library, coloured by cluster"
					loading="lazy"
				/>
			</div>
			<figcaption class="mono">
				fig. 2 · the same library flattened to two dimensions with t-SNE.
			</figcaption>
		</figure>
	</div>
</section>

<section class="band" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">03</span>
		<h2>The player.</h2>
		<p class="lede">{kolo.player}</p>
	</header>

	<div class="gallery">
		<figure class="wide">
			<div class="plate wide-plate">
				<video
					use:loop
					src="/images/projects/kolo-player.mp4"
					poster="/images/projects/kolo-player.webp"
					muted
					loop
					playsinline
					preload="metadata"
					aria-label="The Kolo desktop player: a track list with star ratings and predicted ratings"
				></video>
			</div>
			<figcaption class="mono">
				fig. 3 · coloured stars are mine. grey ones are the model's guess.
			</figcaption>
		</figure>
		<figure>
			<div class="plate">
				<img
					src="/images/projects/kolo-mlflow.webp"
					alt="MLflow dashboard with validation curves"
					loading="lazy"
				/>
			</div>
			<figcaption class="mono">fig. 4 · experiment tracking in MLflow.</figcaption>
		</figure>
		<figure>
			<div class="plate">
				<img
					src="/images/projects/kolo-heatmap.webp"
					alt="Heatmap of cosine similarity between cluster centres"
					loading="lazy"
				/>
			</div>
			<figcaption class="mono">fig. 5 · how close the six clusters sit to each other.</figcaption>
		</figure>
	</div>
</section>

<section class="band">
	<header class="head" use:reveal>
		<span class="num mono">04</span>
		<h2>Does it work?</h2>
	</header>

	<div class="prose">
		<p class="big">
			Mostly. On ratings it has never seen, it lands within one star nine times out of ten.
		</p>
		{#each kolo.honest as line}
			<p>{line}</p>
		{/each}
	</div>
</section>

<section class="band">
	<div class="next mono">
		<a href="/portfolio" class="text-link">← all projects</a>
		<a href="/portfolio/solar" class="btn">Next: Solar Filaments <span>→</span></a>
	</div>
</section>

<style>
	.wide-plate {
		aspect-ratio: 800 / 372;
	}

	.gallery .wide-plate {
		aspect-ratio: 800 / 390;
	}

	.gallery figure:not(.wide) .plate {
		aspect-ratio: 16 / 10;
	}

	.split .plate {
		aspect-ratio: 1500 / 1098;
	}

	.prose p.big {
		max-width: 44rem;
		margin-bottom: 1em;
	}
</style>
