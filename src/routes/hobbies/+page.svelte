<script lang="ts">
	import PoolTable from '$lib/components/pool/PoolTable.svelte';
	import { ballBackground } from '$lib/components/pool/pool';
	import { reveal } from '$lib/actions/reveal';
	import { about, hobbies, person } from '$lib/content';
	import PhotoStrip from '$lib/site/PhotoStrip.svelte';

	/** Fewest shots anyone has cleared the table in, on this browser. */
	const BEST = 'pool-best';

	let potted = $state(hobbies.map(() => false));
	let played = $state(false);
	let table: PoolTable | undefined = $state();
	let result = $state<{ shots: number; seconds: number; best: number; record: boolean } | null>(
		null
	);

	const pottedCount = $derived(potted.filter(Boolean).length);

	function cleared({ shots, seconds }: { shots: number; seconds: number }) {
		let previous = 0;
		try {
			previous = Number(localStorage.getItem(BEST)) || 0;
		} catch {
			// No storage, no record to beat.
		}
		const record = !previous || shots < previous;
		if (record) {
			try {
				localStorage.setItem(BEST, String(shots));
			} catch {
				// Still a record, just not one that will be remembered.
			}
		}
		result = { shots, seconds, best: record ? shots : previous, record };
	}

	function rerack() {
		potted = hobbies.map(() => false);
		played = false;
		result = null;
		table?.rack();
	}

	const plural = (count: number) => `${count} ${count === 1 ? 'shot' : 'shots'}`;
	const clock = (seconds: number) =>
		`${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
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
	<header class="head plain" use:reveal>
		<h2>Pot a hobby.</h2>
		<p class="lede">
			Every ball is something I do when I am not at a keyboard. The physics is real: elastic
			collisions, cushions that lose a little energy, cloth that slows everything down.
		</p>
	</header>

	<div class="pool">
		<div class="table">
			<PoolTable
				bind:this={table}
				labels={hobbies}
				felt="#1d5a45"
				trim="#ff4f1a"
				onpot={(index) => (potted[index] = true)}
				onshot={() => (played = true)}
				onclear={cleared}
			/>

			{#if result}
				<div class="cleared" aria-hidden="true">
					<span class="mono">table cleared</span>
					<strong>{plural(result.shots)}</strong>
					<span class="mono">{clock(result.seconds)}{result.record ? ' · new best' : ''}</span>
				</div>
			{/if}
		</div>

		<div>
			<h3>
				{#if result || pottedCount === hobbies.length}
					Table cleared.
				{:else if played}
					{pottedCount} of {hobbies.length} potted
				{:else}
					Your break
				{/if}
			</h3>
			<p class="how mono">
				{#if result}
					All {hobbies.length} in {plural(result.shots)} and {clock(result.seconds)}.
					{result.record ? 'Your best yet.' : `Your best is ${plural(result.best)}.`}
				{:else if pottedCount === hobbies.length}
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
