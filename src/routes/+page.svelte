<script lang="ts">
	import { onMount } from 'svelte';

	let showHero = $state(false);

	const languages = [
		{ name: '🇬🇧 English', level: 'C2', progress: 6 },
		{ name: '🇺🇦 Ukrainian', level: 'C2', progress: 6 },
		{ name: 'Russian', level: 'C2', progress: 6 },
		{ name: '🇩🇪 German', level: 'B1', progress: 3 },
		{ name: '🇨🇿 Czech', level: 'A2', progress: 2 },
		{ name: '🇨🇳 Chinese', level: 'HSK2', progress: 2 }
	];

	const techRows = [
		{
			label: 'AI & data',
			src: 'https://skillicons.dev/icons?i=py,tensorflow,pytorch,sklearn,fastapi,flask,anaconda'
		},
		{
			label: 'Web',
			src: 'https://skillicons.dev/icons?i=js,ts,bun,html,css,tailwind,svelte,react,vite'
		},
		{ label: 'Systems', src: 'https://skillicons.dev/icons?i=cs,cpp' },
		{
			label: 'Databases',
			src: 'https://skillicons.dev/icons?i=postgres,mysql,sqlite,redis,supabase'
		},
		{
			label: 'Tools',
			src: 'https://skillicons.dev/icons?i=figma,gcp,azure,bash,ubuntu,git,github,blender,unity,docker'
		}
	];

	onMount(() => {
		showHero = true;
	});
</script>

<!-- ═══ Hero ═══ -->
<section
	class="grid min-h-[70vh] items-center gap-12 py-16 transition duration-1000 lg:grid-cols-[0.9fr_1.1fr] lg:py-24"
	class:translate-y-4={!showHero}
	class:opacity-0={!showHero}
	class:opacity-100={showHero}
>
	<div class="order-2 lg:order-1">
		<div class="relative mx-auto max-w-sm">
			<div class="absolute -left-3 -top-3 h-6 w-6 border-l border-t border-accent/40"></div>
			<div class="absolute -bottom-3 -right-3 h-6 w-6 border-b border-r border-accent/40"></div>
			<div class="card overflow-hidden p-2">
				<img src="/images/mai.png" alt="Portrait of Artem" class="w-full rounded object-contain" />
			</div>
		</div>
	</div>

	<div class="order-1 text-center lg:order-2 lg:text-left">
		<p class="eyebrow mb-4">Physics · data · building things</p>
		<h1 class="heading text-5xl sm:text-6xl lg:text-7xl">
			Hi, I'm Artem<a
				href="#artemis-note"
				class="align-super text-3xl text-accent sm:text-4xl lg:text-5xl">*</a
			>
		</h1>
		<p id="artemis-note" class="mt-3 text-sm text-gray-600">
			* yes, like <a
				href="https://www.nasa.gov/humans-in-space/artemis/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-accent-light underline decoration-accent/30 underline-offset-4 transition hover:text-accent"
				>Artemis</a
			>, the NASA mission
		</p>
		<p class="mt-6 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl sm:leading-9">
			I study physics, write code, and like making weird ideas actually work. Sometimes that means
			ML models, sometimes simulations, sometimes just a lot of debugging.
		</p>
		<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
			<a class="btn-primary" href="/projects">See projects</a>
			<a class="btn-secondary" href="/about">About me</a>
		</div>
	</div>
</section>

<hr class="divider" />

<!-- ═══ Tech Stack ═══ -->
<section class="py-12 sm:py-16">
	<div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="eyebrow mb-3">Stack</p>
			<h2 class="heading text-3xl sm:text-4xl">Tools I reach for</h2>
		</div>
		<a
			href="https://skillicons.dev"
			target="_blank"
			rel="noopener noreferrer"
			class="text-sm text-gray-600 transition hover:text-accent"
		>
			Icons by skillicons
		</a>
	</div>

	<div class="grid gap-3">
		{#each techRows as row}
			<div
				class="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
			>
				<span class="text-xs font-medium uppercase tracking-[0.2em] text-gray-600">{row.label}</span
				>
				<img
					src={row.src}
					alt={`${row.label} technology icons`}
					class="max-w-full self-start sm:self-center"
					loading="lazy"
				/>
			</div>
		{/each}
	</div>
</section>

<hr class="divider" />

<!-- ═══ Languages ═══ -->
<section class="py-12 sm:py-16">
	<div class="card p-6 sm:p-8 lg:p-10">
		<div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="eyebrow mb-3">Languages</p>
				<h2 class="heading text-3xl sm:text-4xl">Languages I speak</h2>
			</div>
			<p class="max-w-md text-sm leading-6 text-gray-600">
				Useful for reading papers, moving countries, and occasionally ordering coffee correctly.
			</p>
		</div>

		<div class="grid gap-3 md:grid-cols-2">
			{#each languages as lang}
				<div class="rounded-lg border border-border bg-surface p-4">
					<div class="mb-3 flex items-center justify-between gap-4">
						<span class="font-medium text-gray-300">{lang.name}</span>
						<span class="tag">{lang.level}</span>
					</div>
					<div class="flex gap-1.5" aria-label={`${lang.name} proficiency ${lang.level}`}>
						{#each Array(6).fill(0) as _, i}
							<div
								class={`h-2 flex-1 rounded-full ${i < lang.progress ? 'bg-gradient-to-r from-accent to-accent-light' : 'bg-white/5'}`}
							></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
