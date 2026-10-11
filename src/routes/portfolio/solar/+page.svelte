<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { person, solar } from '$lib/content';
	import figure from '$lib/data/solar.json';
	import Leaderboard from '$lib/site/Leaderboard.svelte';
	import SolarFigure from '$lib/site/SolarFigure.svelte';

	// Each submission against the best score before it: new records, and the ones that fell short.
	let best = solar.history[0].score;
	const compared = solar.history.slice(1).map((entry) => {
		const delta = Math.round((entry.score - best) * 100) / 100;
		best = Math.max(best, entry.score);
		return { ...entry, delta };
	});
	const records = compared.filter((entry) => entry.delta > 0);
	const setbacks = compared.filter((entry) => entry.delta < 0);
	const signed = (delta: number) => `${delta > 0 ? '+' : '−'}${Math.abs(delta).toFixed(2)}`;
</script>

<svelte:head>
	<title>Solar Filaments · {person.name}</title>
	<meta name="description" content={solar.task} />
</svelte:head>

<section class="band page-head">
	<p class="crumb mono">
		<a href="/">home</a><b>/</b><a href="/portfolio">portfolio</a><b>/</b><span
			>solar filaments</span
		>
	</p>
	<h1>Solar Filaments</h1>
	<p class="intro">{solar.task}</p>
	<p class="status mono"><i></i>Kaggle · {solar.competition} · in progress</p>
</section>

<section class="band">
	<div class="split flip">
		<SolarFigure
			caption={`fig. 1 · one training image, scored out of fold: the model that drew these never saw it. ${figure.labelled} filaments labelled, ${figure.found} found, ${figure.matched} matched.${figure.largestMissed ? ' it missed the biggest one, bottom centre.' : ''} picked from the upper middle of the results, not the top.`}
		/>

		<div>
			<div class="prose">
				<p class="big">{solar.why}</p>
				<p>
					The dark threads on the disc are the filaments. Experts outlined them by hand; the job is
					to do the same automatically, and to get the fine shape right, not just a box around it.
				</p>
			</div>

			<div class="closeup">
				<SolarFigure
					view="closeup"
					controls={false}
					caption="fig. 2 · the dashed square from fig. 1 at full resolution. white is the expert, orange is the model."
				/>
			</div>

			<p class="credit mono">{solar.credit}</p>
		</div>
	</div>
</section>

<section class="band" data-tone="dark">
	<dl class="stats">
		<div>
			<dd>{solar.standing}</dd>
			<dt class="mono">{solar.standingNote}</dt>
		</div>
		<div>
			<dd>{solar.score.toFixed(2)}</dd>
			<dt class="mono">panoptic quality, public leaderboard</dt>
		</div>
		<div>
			<dd>{solar.history.length}</dd>
			<dt class="mono">submissions in three days</dt>
		</div>
		<div>
			<dd>707</dd>
			<dt class="mono">training images, 2048 × 2048 each</dt>
		</div>
	</dl>
</section>

<section class="band">
	<header class="head" use:reveal>
		<span class="num mono">01</span>
		<h2>How it works.</h2>
		<p class="lede">{solar.failed}</p>
	</header>

	<ol class="steps">
		{#each solar.approach as step, i}
			<li class="rise" use:reveal>
				<span class="n mono">{String(i + 1).padStart(2, '0')}</span>
				<h3>{step.title}</h3>
				<p>{step.text}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="band">
	<header class="head" use:reveal>
		<span class="num mono">02</span>
		<h2>The climb so far.</h2>
		<p class="lede">Every submission, in order. Not every idea was a good one.</p>
	</header>

	<div class="split flip">
		<Leaderboard />

		<div>
			{#each [{ title: 'new best', entries: records }, { title: 'fell short of the best so far', entries: setbacks }] as group}
				<h3 class="mono">{group.title}</h3>
				<ol class="moves">
					{#each group.entries as entry}
						<li>
							<span class="delta" class:down={entry.delta < 0}>{signed(entry.delta)}</span>
							<span>{entry.note}</span>
							<span class="mono">{entry.day}</span>
						</li>
					{/each}
				</ol>
			{/each}
		</div>
	</div>
</section>

<section class="band" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">03</span>
		<h2>The code.</h2>
		<p class="lede">
			{solar.github
				? 'The full pipeline, with every experiment that worked and every one that did not.'
				: 'The repository goes public once the competition allows it. Until then, the competition page has the task and the data.'}
		</p>
	</header>

	<div class="buttons">
		{#if solar.github}
			<a href={solar.github} target="_blank" rel="noopener noreferrer" class="btn solid">
				Code on GitHub <span>↗</span>
			</a>
		{:else}
			<span class="btn" aria-disabled="true">Code on GitHub · coming</span>
		{/if}
		<a href={solar.kaggle} target="_blank" rel="noopener noreferrer" class="btn">
			The competition <span>↗</span>
		</a>
	</div>
</section>

<section class="band">
	<div class="next mono">
		<a href="/portfolio" class="text-link">← all projects</a>
		<a href="/portfolio/kolo" class="btn">Next: Kolo <span>→</span></a>
	</div>
</section>

<style>
	.status {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 22px;
		color: var(--dim);
	}

	/* A slow pulse: the competition is still running. */
	.status i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--hot);
		animation: pulse 1.8s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.25;
		}
	}

	.closeup {
		max-width: 24rem;
		margin-top: clamp(28px, 4vw, 48px);
	}

	.credit {
		margin-top: 20px;
		color: var(--faint);
	}

	h3 {
		padding-bottom: 12px;
		border-bottom: 1px solid var(--fg);
		color: var(--dim);
	}

	.moves {
		margin-bottom: 28px;
	}

	.moves li {
		display: grid;
		grid-template-columns: 4.5rem minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
		font-size: 0.9375rem;
		line-height: 1.4;
	}

	.moves .delta {
		font-family: var(--display);
		font-size: 1.35rem;
		font-stretch: 112%;
		font-weight: var(--title-weight);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}

	/* Direction is in the sign; the colour only repeats it. */
	.moves .delta.down {
		color: var(--dim);
	}

	.moves .mono {
		color: var(--dim);
	}

	.stats dd {
		white-space: nowrap;
	}
</style>
