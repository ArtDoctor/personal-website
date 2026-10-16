<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/actions/reveal';
	import { now, person } from '$lib/content';
	import { eclipse } from './eclipse.svelte';

	let hero: HTMLElement;
	let anchor: HTMLElement;

	/** The disc has swallowed the whole hero once this much of it has scrolled past. */
	const TOTALITY = 0.8;
	/** Height of the strip the top bar sits over. */
	const BAR = 56;

	onMount(() => {
		const still = prefersReducedMotion();
		let frame = 0;

		const update = () => {
			frame = 0;
			const box = hero.getBoundingClientRect();
			const rest = anchor.getBoundingClientRect();
			const radius = rest.width / 2;
			const x = rest.left + radius;
			const y = rest.top + radius;
			const progress = Math.min(1, Math.max(0, -box.top / box.height));

			// Totality is when the far corner of the hero is inside the disc.
			const reach = Math.max(
				Math.hypot(x - box.left, y - box.top),
				Math.hypot(x - box.right, y - box.top),
				Math.hypot(x - box.left, y - box.bottom),
				Math.hypot(x - box.right, y - box.bottom)
			);
			const t = Math.min(1, progress / TOTALITY);
			const scale = still ? 1 : 1 + (reach / radius - 1) * (1 - (1 - t) ** 1.7);
			hero.style.setProperty('--k', scale.toFixed(4));

			const shadow = radius * scale;
			eclipse.progress = progress;
			eclipse.overhead = [0, window.innerWidth].every(
				(px) => Math.hypot(px - x, y) < shadow && Math.hypot(px - x, BAR - y) < shadow
			);
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			eclipse.progress = 0;
			eclipse.overhead = false;
		};
	});
</script>

<section class="band hero" id="top" bind:this={hero}>
	<!-- Where the bodies orbit: the disc at its resting size. -->
	<div class="under anchor" data-orbit-center bind:this={anchor} aria-hidden="true"></div>
	<!-- The disc. It sits under the field, so the bodies cross it in white, and it grows as the
	     page scrolls until the whole hero is in its shadow. -->
	<div class="under disc" aria-hidden="true"></div>
	<!-- The corona. Drawn above the name so the letters do not invert it. An SVG stroke rather
	     than a bordered round box: GPU rasterisers can leave seams across a box that large. -->
	<svg class="rim" aria-hidden="true">
		<circle
			style="cx: var(--disc-x); cy: var(--disc-y); r: calc(var(--disc-size) / 2 * var(--k, 1) + 14px)"
		/>
	</svg>

	<!-- Everything below is white text blended as a difference: black on the page, white wherever
	     the disc is under it. Orange cannot survive that, so there is none in here. -->
	<div class="title">
		<p class="mono kicker">{person.tagline}</p>
		<h1 aria-label={person.name}>
			<span class="line"
				><span
					>Artem<a
						href={person.artemisUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="star"
						aria-label="Footnote: like Artemis">*</a
					></span
				></span
			>
			<span class="line"><span>Shelamanov</span></span>
		</h1>
		<p class="footnote mono">
			* yes, like
			<a href={person.artemisUrl} target="_blank" rel="noopener noreferrer">Artemis</a>, the NASA
			mission
		</p>
	</div>

	<div class="hero-base">
		<p class="intro">{person.intro}</p>
		<div class="buttons">
			<a href="#work" class="btn solid">See projects <span>↓</span></a>
			<a href="#contact" class="btn">Get in touch</a>
		</div>
	</div>

	<p class="now">
		<span class="mono">now</span>
		<a href={now.href}>{now.text} <span aria-hidden="true">→</span></a>
	</p>
</section>

<style>
	section.hero {
		--disc-top: clamp(84px, 11vh, 130px);
		--disc-right: clamp(16px, 9vw, 150px);
		--disc-size: min(56vh, 42vw);
		--disc-x: calc(100% - var(--disc-right) - var(--disc-size) / 2);
		--disc-y: calc(var(--disc-top) + var(--disc-size) / 2);
		--grey: #8f8f8f;

		display: grid;
		grid-template-columns: minmax(0, 34rem) minmax(0, 1fr);
		grid-template-rows: 1fr auto;
		column-gap: var(--gutter);
		min-height: 100svh;
		padding-top: 0;
		padding-bottom: clamp(28px, 5vh, 48px);
	}

	.anchor {
		top: var(--disc-top);
		right: var(--disc-right);
		width: var(--disc-size);
		aspect-ratio: 1;
		visibility: hidden;
	}

	.disc {
		inset: 0;
		background: #08080a;
		clip-path: circle(calc(var(--disc-size) / 2 * var(--k, 1)) at var(--disc-x) var(--disc-y));
		transform-origin: var(--disc-x) var(--disc-y);
		animation: appear 1.4s var(--ease) both;
	}

	/* Clipped to the hero, so the ring does not carry on into the band below. */
	section.hero .rim {
		position: absolute;
		inset: 0;
		z-index: 3;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
		transform-origin: var(--disc-x) var(--disc-y);
		animation: appear 1.4s var(--ease) both;
	}

	.rim circle {
		fill: none;
		stroke: var(--hot);
		stroke-width: 1px;
	}

	.title,
	.hero-base,
	.now {
		color: #fff;
		mix-blend-mode: difference;
	}

	.title {
		grid-column: 1 / -1;
		padding-top: clamp(84px, 15vh, 150px);
	}

	.kicker {
		margin-bottom: 18px;
		animation: fade 0.8s ease 0.7s both;
	}

	h1 {
		font-family: var(--display);
		font-size: clamp(1.85rem, 9.4vw, 10.5rem);
		font-stretch: 125%;
		font-weight: var(--display-weight);
		line-height: 0.86;
		letter-spacing: -0.035em;
		text-transform: uppercase;
	}

	.line {
		display: block;
		overflow: hidden;
		padding-bottom: 0.06em;
	}

	.line > span {
		display: inline-block;
		animation: rise 1.1s var(--ease) both;
	}

	.line:nth-child(2) > span {
		animation-delay: 0.09s;
	}

	.hero-base {
		padding-top: clamp(28px, 5vh, 64px);
		animation: lift 0.9s var(--ease) 0.5s both;
	}

	.intro {
		margin-bottom: 26px;
		font-size: clamp(1.05rem, 1.5vw, 1.3rem);
		line-height: 1.45;
	}

	/* Black and white swap under the blend, so these read as the usual solid and outline. */
	.hero-base .btn {
		border-color: #fff;
		color: #fff;
	}

	.hero-base .btn.solid,
	.hero-base .btn:not(.solid):hover {
		background: #fff;
		color: #000;
	}

	.hero-base .btn.solid:hover {
		background: transparent;
		color: #fff;
	}

	.hero-base a:focus-visible,
	.now a:focus-visible {
		outline-color: #fff;
	}

	/* Straight under the name, so it is clear what the star points at. */
	.footnote {
		margin-top: clamp(10px, 1.4vw, 20px);
		color: var(--grey);
		animation: fade 0.8s ease 0.9s both;
	}

	.footnote a {
		border-bottom: 1px solid #fff;
		color: #fff;
	}

	.now {
		align-self: end;
		justify-self: end;
		max-width: 16rem;
		font-size: 0.9375rem;
		line-height: 1.4;
		text-align: right;
		animation: fade 0.8s ease 1s both;
	}

	.now .mono {
		display: block;
		margin-bottom: 6px;
		color: var(--grey);
	}

	.now a {
		padding-bottom: 2px;
		border-bottom: 1px solid var(--grey);
		transition: border-color 0.2s;
	}

	.now a:hover {
		border-color: #fff;
	}

	.now a span {
		display: inline-block;
		transition: transform 0.4s var(--ease);
	}

	.now a:hover span {
		transform: translateX(4px);
	}

	@keyframes appear {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	@keyframes rise {
		from {
			transform: translateY(108%);
		}
	}

	@keyframes lift {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}

	@media (max-width: 860px) {
		section.hero {
			--disc-top: 120px;
			--disc-right: -18vw;
			--disc-size: 78vw;

			grid-template-columns: minmax(0, 1fr);
		}

		.title {
			min-height: calc(78vw + 150px);
		}

		.now {
			justify-self: start;
			margin-top: 32px;
			text-align: left;
		}
	}
</style>
