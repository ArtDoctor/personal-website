<script lang="ts">
	import Scene from './Scene.svelte';
	import type { AsciiEffectOptions } from 'three/examples/jsm/Addons.js';
	import { AsciiRenderer } from '@threlte/extras';
	import { Canvas } from '@threlte/core';

	let fgColor = $state('#67e8f9');
	let bgColor = $state('#050505');

	const defaultCharacters = ' .:-+*=%@#';
	let characters = $state(defaultCharacters);

	let alpha = $state(true);
	let block = $state(false);
	let color = $state(false);
	let invert = $state(true);
	let resolution = $state(0.11);
	let scale = $state(1);

	const options: AsciiEffectOptions = $derived({
		alpha,
		block,
		color,
		invert,
		resolution,
		scale
	});

	let autoRotate = $state(true);
</script>

<section class="grid items-center gap-10 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-24">
	<div class="glass-card relative min-h-[22rem] overflow-hidden p-4 sm:min-h-[28rem]">
		<div class="absolute inset-x-8 top-8 h-24 rounded-full bg-cyan-300/10 blur-3xl"></div>
		<div class="relative h-[22rem] sm:h-[28rem]">
			<Canvas>
				<AsciiRenderer {bgColor} {characters} {fgColor} {options}>
					<Scene {autoRotate} />
				</AsciiRenderer>
			</Canvas>
		</div>
		<div class="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/75 backdrop-blur">
			ASCII torus · live render
		</div>
	</div>

	<div>
		<p class="eyebrow mb-4">About</p>
		<h1 class="gradient-text text-5xl font-bold tracking-tight sm:text-6xl">A bit about me.</h1>
		<div class="mt-7 space-y-5 text-lg leading-8 text-white/70">
			<p>
				I'm Artem. I’m into computational physics, data science, startups, and the kind of problems that look simple until you actually try to solve them.
			</p>
			<p>
				Most of what I enjoy sits somewhere between research and making things people can use: simulations, ML, small tools, rough prototypes, cleaner interfaces.
			</p>
			<p class="text-white/85">
				I read a lot of sci-fi, get excited about new tech probably too easily, and like working with people who want to build something real.
			</p>
		</div>

		<div class="mt-8 grid gap-3 sm:grid-cols-3">
			<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
				<p class="text-sm text-white/45">Mostly</p>
				<p class="mt-1 font-semibold text-white">AI & physics</p>
			</div>
			<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
				<p class="text-sm text-white/45">Working style</p>
				<p class="mt-1 font-semibold text-white">Curious, practical</p>
			</div>
			<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
				<p class="text-sm text-white/45">Default mood</p>
				<p class="mt-1 font-semibold text-white">Let's try it</p>
			</div>
		</div>
	</div>
</section>
