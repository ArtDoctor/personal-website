<script lang="ts">
	import PoolTable from '$lib/components/pool/PoolTable.svelte';
	import { ballBackground } from '$lib/components/pool/pool';
	import { reveal } from '$lib/actions/reveal';
	import { about, hobbies, languages, languagesNote, person } from '$lib/content';
	import PhotoStrip from '$lib/site/PhotoStrip.svelte';

	let potted = $state(hobbies.map(() => false));
	let played = $state(false);
	let table: PoolTable | undefined = $state();

	const pottedCount = $derived(potted.filter(Boolean).length);

	/** Six-step proficiency meter: which segments are filled. */
	const segments = (filled: number) => Array.from({ length: 6 }, (_, i) => i < filled);

	function rerack() {
		potted = hobbies.map(() => false);
		played = false;
		table?.rack();
	}
</script>

<svelte:head>
	<title>Hobbies · {person.name}</title>
	<meta name="description" content={about[3]} />
</svelte:head>

<section class="band page-head">
	<p class="crumb mono"><a href="/">home</a><b>/</b><span>hobbies</span></p>
	<h1>Off duty.</h1>
	<p class="intro">{about[3]}</p>
</section>

<section class="band">
	<PhotoStrip />
</section>

<section class="band" data-tone="dark">
	<header class="head" use:reveal>
		<span class="num mono">01</span>
		<h2>Pot a hobby.</h2>
		<p class="lede">
			Every ball is something I do when I am not at a keyboard. The physics is real: elastic
			collisions, cushions that lose a little energy, cloth that slows everything down.
		</p>
	</header>

	<div class="pool">
		<PoolTable
			bind:this={table}
			labels={hobbies}
			felt="#1d5a45"
			trim="#ff4f1a"
			onpot={(index) => (potted[index] = true)}
			onshot={() => (played = true)}
		/>

		<div>
			<h3>
				{#if pottedCount === hobbies.length}
					Table cleared.
				{:else if played}
					{pottedCount} of {hobbies.length} potted
				{:else}
					Your break
				{/if}
			</h3>
			<p class="how mono">
				{#if pottedCount === hobbies.length}
					That's all of them.
				{:else}
					Drag back from the white ball and let go.
				{/if}
			</p>

			<ol class="legend">
				{#each hobbies as hobby, i}
					<li class:potted={potted[i]}>
						<span class="ball" style:background={ballBackground(i)}><b>{i + 1}</b></span>
						<span class="name">{hobby}</span>
					</li>
				{/each}
			</ol>

			<div class="buttons">
				<button type="button" class="btn solid" onclick={() => table?.breakShot()}
					>Break <span>→</span></button
				>
				<button type="button" class="btn" onclick={rerack}>Rack 'em again</button>
			</div>
		</div>
	</div>
</section>

<section class="band">
	<header class="head" use:reveal>
		<span class="num mono">02</span>
		<h2>Languages I speak.</h2>
		<p class="lede">{languagesNote}</p>
	</header>

	<div class="languages wide">
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
	</div>
</section>

<style>
	.wide ul {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		gap: 0 clamp(24px, 5vw, 80px);
		border-top: 1px solid var(--line);
	}
</style>
