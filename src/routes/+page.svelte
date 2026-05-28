<script>
	import { onMount } from 'svelte';

	let showHero = false;

	const languages = [
		{ name: '🇬🇧 English', level: 'C2', progress: 6 },
		{ name: '🇺🇦 Ukrainian', level: 'C2', progress: 6 },
		{ name: 'Russian', level: 'C2', progress: 6 },
		{ name: '🇩🇪 German', level: 'B1', progress: 3 },
		{ name: '🇨🇿 Czech', level: 'A2', progress: 2 },
		{ name: '🇨🇳 Chinese', level: 'HSK2', progress: 2 }
	];

	const techRows = [
		{ label: 'AI & data', src: 'https://skillicons.dev/icons?i=py,tensorflow,pytorch,sklearn,fastapi,flask,anaconda' },
		{ label: 'Web', src: 'https://skillicons.dev/icons?i=js,ts,bun,html,css,tailwind,svelte,react,vite' },
		{ label: 'Systems', src: 'https://skillicons.dev/icons?i=cs,cpp' },
		{ label: 'Databases', src: 'https://skillicons.dev/icons?i=postgres,mysql,sqlite,redis,supabase' },
		{ label: 'Tools', src: 'https://skillicons.dev/icons?i=figma,gcp,azure,bash,ubuntu,git,github,blender,unity,docker' }
	];

	onMount(() => {
		showHero = true;
	});
</script>

<section
	class="grid min-h-[72vh] items-center gap-10 py-16 transition duration-1000 lg:grid-cols-[0.9fr_1.1fr] lg:py-24"
	class:translate-y-4={!showHero}
	class:opacity-0={!showHero}
	class:opacity-100={showHero}
>
	<div class="order-2 lg:order-1">
		<div class="relative mx-auto max-w-sm">
			<div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/20 via-violet-500/10 to-transparent blur-2xl"></div>
			<div class="glass-card relative overflow-hidden p-5">
				<img src="/images/avatar.png" alt="Portrait of Artem" class="aspect-square w-full rounded-[1.5rem] object-contain" />
			</div>
		</div>
	</div>

	<div class="order-1 text-center lg:order-2 lg:text-left">
		<p class="eyebrow mb-5">Physics · data · building things</p>
		<h1 class="gradient-text text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
			Hi, I'm Artem — Ash to friends.
		</h1>
		<p class="mt-6 max-w-2xl text-xl leading-8 text-white/70 sm:text-2xl sm:leading-10">
			I study physics, write code, and like making weird ideas actually work. Sometimes that means ML models, sometimes simulations, sometimes just a lot of debugging.
		</p>
		<div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
			<a class="btn-primary" href="/projects">See projects</a>
			<a class="btn-secondary" href="/about">About me</a>
		</div>
	</div>
</section>

<section class="py-12 sm:py-16">
	<div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="eyebrow mb-3">Stack</p>
			<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tools I reach for</h2>
		</div>
		<a href="https://skillicons.dev" target="_blank" rel="noopener noreferrer" class="text-sm text-white/45 transition hover:text-cyan-200">
			Icons by skillicons
		</a>
	</div>

	<div class="grid gap-4">
		{#each techRows as row}
			<div class="glass-card glass-card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
				<span class="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">{row.label}</span>
				<img src={row.src} alt={`${row.label} technology icons`} class="max-w-full self-start sm:self-center" loading="lazy" />
			</div>
		{/each}
	</div>
</section>

<section class="py-12 sm:py-16">
	<div class="glass-card p-6 sm:p-8 lg:p-10">
		<div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<p class="eyebrow mb-3">Languages</p>
				<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Languages I speak</h2>
			</div>
			<p class="max-w-md text-sm leading-6 text-white/50">Useful for reading papers, moving countries, and occasionally ordering coffee correctly.</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each languages as lang}
				<div class="rounded-2xl border border-white/10 bg-black/20 p-4">
					<div class="mb-3 flex items-center justify-between gap-4">
						<span class="font-semibold text-white/85">{lang.name}</span>
						<span class="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-100">{lang.level}</span>
					</div>
					<div class="flex gap-1.5" aria-label={`${lang.name} proficiency ${lang.level}`}>
						{#each Array(6).fill(0) as _, i}
							<div class={`h-2.5 flex-1 rounded-full ${i < lang.progress ? 'bg-gradient-to-r from-cyan-300 to-violet-300' : 'bg-white/10'}`}></div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
