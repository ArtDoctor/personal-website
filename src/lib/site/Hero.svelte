<script lang="ts">
	import { person } from '$lib/content';
</script>

<section class="band hero" id="top">
	<!-- The disc the bodies orbit. It sits under the field, so they cross it in white. -->
	<div class="under disc" data-orbit-center aria-hidden="true"></div>
	<div class="corona" aria-hidden="true"></div>

	<!-- White text blended as a difference: black on the page, white where it crosses the disc. -->
	<div class="title">
		<p class="mono kicker">{person.tagline.toLowerCase()}</p>
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
	</div>

	<div class="hero-base">
		<p class="intro">{person.intro}</p>
		<div class="buttons">
			<a href="/portfolio" class="btn solid">See projects <span>→</span></a>
			<a href="#about" class="btn">About me</a>
		</div>
		<p class="footnote mono">
			* yes, like
			<a href={person.artemisUrl} target="_blank" rel="noopener noreferrer">Artemis</a>, the NASA
			mission
		</p>
	</div>
</section>

<style>
	section.hero {
		--disc-top: clamp(84px, 11vh, 130px);
		--disc-right: clamp(16px, 9vw, 150px);
		--disc-size: min(56vh, 42vw);

		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 100svh;
		padding-top: 0;
	}

	.disc {
		top: var(--disc-top);
		right: var(--disc-right);
		width: var(--disc-size);
		aspect-ratio: 1;
		border-radius: 50%;
		background: #08080a;
		animation: appear 1.4s var(--ease) both;
	}

	/* The corona. Drawn above the name so the letters do not invert it. */
	section.hero .corona {
		position: absolute;
		z-index: 3;
		top: calc(var(--disc-top) - 14px);
		right: calc(var(--disc-right) - 14px);
		width: calc(var(--disc-size) + 28px);
		aspect-ratio: 1;
		border: 1px solid var(--hot);
		border-radius: 50%;
		pointer-events: none;
		animation: appear 1.4s var(--ease) both;
	}

	.title {
		padding-top: clamp(84px, 15vh, 150px);
		color: #fff;
		mix-blend-mode: difference;
	}

	.kicker {
		margin-bottom: 18px;
		animation: fade 0.8s ease 0.7s both;
	}

	h1 {
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

	.star {
		display: inline-block;
		transition: transform 0.6s var(--ease);
	}

	.star:hover {
		transform: rotate(180deg);
	}

	.hero-base {
		max-width: 30rem;
		padding: clamp(32px, 6vh, 72px) 0 clamp(64px, 9vh, 88px);
		animation: lift 0.9s var(--ease) 0.5s both;
	}

	.footnote {
		margin-top: 28px;
		color: var(--dim);
	}

	.footnote a {
		color: var(--fg);
		border-bottom: 1px solid var(--hot);
	}

	.intro {
		margin-bottom: 26px;
		font-size: clamp(1.05rem, 1.5vw, 1.3rem);
		line-height: 1.45;
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
		}

		.title {
			min-height: calc(78vw + 150px);
		}
	}
</style>
