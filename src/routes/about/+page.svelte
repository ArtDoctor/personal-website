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

<section class="grid items-start gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
	<div class="order-2 space-y-6 lg:order-1">
		<div class="glass-card relative min-h-[22rem] overflow-hidden p-4 sm:min-h-[28rem]">
			<div class="absolute inset-x-8 top-8 h-24 rounded-full bg-cyan-300/10 blur-3xl"></div>
			<div class="relative h-[22rem] sm:h-[28rem]">
				<Canvas>
					<AsciiRenderer {bgColor} {characters} {fgColor} {options}>
						<Scene {autoRotate} />
					</AsciiRenderer>
				</Canvas>
			</div>
		</div>

		<div class="glass-card relative overflow-hidden p-3 sm:p-4">
			<div class="absolute inset-x-8 top-6 h-24 rounded-full bg-cyan-300/10 blur-3xl"></div>
			<div class="relative columns-1 gap-4 sm:columns-2 lg:columns-1 xl:columns-2">
				<figure class="mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 p-2">
					<img src="/images/drone_flight.png" alt="FPV drone in flight" class="w-full rounded-[1.1rem] object-contain" loading="lazy" />
					<figcaption class="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/75">FPV drones</figcaption>
				</figure>

				<figure class="mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 p-2">
					<img src="/images/bouldering.png" alt="Bouldering" class="w-full rounded-[1.1rem] object-contain" loading="lazy" />
					<figcaption class="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/75">Bouldering</figcaption>
				</figure>

				<figure class="mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 p-2">
					<img src="/images/cycling.jpg" alt="Cycling outdoors" class="w-full rounded-[1.1rem] object-contain" loading="lazy" />
					<figcaption class="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/75">Cycling</figcaption>
				</figure>

				<figure class="mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 p-2">
					<img src="/images/hike.jpg" alt="Hiking outdoors" class="w-full rounded-[1.1rem] object-contain" loading="lazy" />
					<figcaption class="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/75">Hiking</figcaption>
				</figure>
			</div>
		</div>
	</div>

	<div class="order-1 lg:order-2">
		<p class="eyebrow mb-4">About</p>
		<h1 class="gradient-text text-5xl font-bold tracking-tight sm:text-6xl">A bit about me.</h1>
		<div class="mt-7 space-y-5 text-lg leading-8 text-white/70">
			<p>
				I'm Artem. I’m into computational physics, data science, startups, and the kind of problems that look simple until you actually try to solve them.
			</p>
			<p>
				Most of what I enjoy sits somewhere between research and making things people can use: simulations, ML, small tools, rough prototypes, cleaner interfaces.
			</p>
			<p>
				Outside formal work, I like experimenting with small systems: FPV drones, physics simulations, ML models, soldering, and weird side projects that turn abstract rules into something visible or usable.
			</p>
			<p class="text-white/85">
				I’m happiest when I’m exploring systems with hidden rules — whether that’s a model, a drone build, a trail, or a good sci-fi world.
			</p>
		</div>

		<div class="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
			<p class="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/65">Hobbies</p>
			<div class="mt-4 flex flex-wrap gap-2">
				<span class="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-50/85">Drones · FPV & building</span>
				<span class="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-sm text-cyan-50/85">Bouldering</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Hiking</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Cycling</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Sci-fi & speculative fiction</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">ML experiments & Kaggle</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Soldering</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Sandbox/co-op games</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Pool/snooker</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Meditation & NSDR</span>
				<span class="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-white/75">Lockpicking</span>
			</div>
		</div>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<a href="https://linktr.ee/ash_dot_py" target="_blank" rel="noopener noreferrer" class="btn-primary">
				Find me on Linktree
			</a>
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
