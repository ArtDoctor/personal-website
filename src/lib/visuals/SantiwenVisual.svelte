<script lang="ts">
	import { prefersReducedMotion } from '$lib/actions/reveal';

	let { active = true }: { active?: boolean } = $props();

	/*
	 * The reader on a real sentence (the blurb of The Three-Body Problem), with the pinyin and
	 * dictionary entries it shows for it. The focus steps through the words, as you do in the app.
	 */
	const words = [
		{ hanzi: '文化大革命', pinyin: 'Wén huà Dà gé mìng', gloss: 'Cultural Revolution (1966-1976)' },
		{ hanzi: '如火如荼', pinyin: 'rú huǒ rú tú', gloss: 'like wildfire (idiom); unstoppable' },
		{ hanzi: '进行', pinyin: 'jìn xíng', gloss: 'to proceed; to be in progress' },
		{ hanzi: '的', pinyin: 'de', gloss: 'of; ~’s (possessive particle)' },
		{ hanzi: '同时', pinyin: 'tóng shí', gloss: 'at the same time; simultaneously' },
		{ hanzi: '军方', pinyin: 'jūn fāng', gloss: 'military' },
		{ hanzi: '探寻', pinyin: 'tàn xún', gloss: 'to search; to seek; to explore' },
		{ hanzi: '外星', pinyin: 'wài xīng', gloss: 'alien; extraterrestrial' },
		{ hanzi: '文明', pinyin: 'wén míng', gloss: 'civilized; civilization; culture' }
	];

	let at = $state(1);

	$effect(() => {
		if (!active || prefersReducedMotion()) return;
		const timer = setInterval(() => (at = (at + 1) % words.length), 1700);
		return () => clearInterval(timer);
	});
</script>

<div class="visual" aria-hidden="true">
	<p class="count mono">word {at + 1} / {words.length}</p>

	<!-- The sizes inside are in container units, so the same picture works at any plate size. -->
	<div class="page">
		<p class="sentence" lang="zh-Hans">
			{#each words as word, i}
				<!-- The fifth word ends the clause, so it carries the comma. -->
				<span class="word" class:on={i === at} class:pause={i === 4}>
					<span class="pinyin mono" lang="zh-Latn">{word.pinyin}</span>
					<span class="hanzi">{word.hanzi}</span>
				</span>
			{/each}
		</p>

		<p class="entry">
			<span class="hanzi" lang="zh-Hans">{words[at].hanzi}</span>
			<span class="mono">{words[at].pinyin}</span>
			<span class="gloss">{words[at].gloss}</span>
		</p>
	</div>
</div>

<style>
	.visual {
		container-type: size;
		color: #f1f1ec;
	}

	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 6cqh;
		height: 100%;
		padding: 2cqh 6cqw 0;
	}

	/* On a small plate the counter would sit on top of the sentence. */
	@container (max-width: 440px) {
		.count {
			display: none;
		}
	}

	.count {
		position: absolute;
		top: 12px;
		left: 12px;
		color: rgba(241, 241, 236, 0.45);
	}

	.sentence {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 1.5cqh 1.1cqw;
	}

	/* The pinyin sits above its word without widening it, so the line breaks never move. */
	.word {
		position: relative;
		padding-top: max(12px, 3.4cqw);
		padding-bottom: 0.9cqw;
		border-bottom: 1px solid transparent;
		color: rgba(241, 241, 236, 0.4);
		transition:
			color 0.4s,
			border-color 0.4s;
	}

	.word.on {
		border-color: var(--hot);
		color: #f1f1ec;
	}

	.hanzi {
		font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
		font-size: 5.5cqw;
		font-weight: 500;
		line-height: 1.15;
	}

	.word .pinyin {
		position: absolute;
		top: 0;
		left: 0;
		font-size: max(8px, 1.9cqw);
		white-space: nowrap;
		opacity: 0;
		transition: opacity 0.4s;
	}

	.word.on .pinyin {
		opacity: 1;
	}

	.pause {
		margin-right: 3.6cqw;
	}

	.pause .hanzi::after {
		content: '，';
		position: absolute;
		left: 100%;
		color: rgba(241, 241, 236, 0.4);
	}

	.entry {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: baseline;
		gap: 0.4cqw 2.4cqw;
		min-height: 13cqw;
		padding-top: 2.4cqw;
		border-top: 1px solid rgba(241, 241, 236, 0.18);
	}

	.entry .hanzi {
		grid-row: span 2;
		font-size: 5cqw;
	}

	.entry .mono {
		font-size: max(8px, 1.7cqw);
		color: rgba(241, 241, 236, 0.5);
	}

	.entry .gloss {
		font-size: max(10px, 2.9cqw);
		line-height: 1.3;
	}
</style>
