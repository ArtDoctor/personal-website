<script>
	const projects = [
		{
			title: 'Yazero',
			description:
				'A home for the startups I’ve worked on with my co-founder — small bets, experiments, and products we’re trying to make real.',
			link: 'https://www.yazero.io/',
			image: '/images/validator-by-yazero.webp',
			tags: ['Startups', 'Product', 'Co-founder']
		},
		{
			title: 'Genetic Car Simulator',
			description:
				'A browser 3D playground where little cars slowly get better at driving over rough terrain through genes, mutation, crossover, and leaderboards.',
			link: 'https://genetic-simulator.shelamanov.com/',
			image: '/images/genetic-car-simulator.png',
			tags: ['Simulation', 'Evolution', '3D']
		},
		{
			title: 'Thomson Parabolas',
			description:
				'A tool for handling Thomson spectrometer images: cleaning detector shots, finding ion parabolas, classifying species, and turning the result into energy spectra.',
			link: 'https://thomson-parabolas-unet.shelamanov.com/',
			image: '/images/thomson-parabolas-unet.png',
			tags: ['U-Net', 'Physics', 'Computer vision']
		}
	];
</script>

<section class="py-16 lg:py-24">
	<div class="mb-10 max-w-3xl">
		<p class="eyebrow mb-4">Projects</p>
		<h1 class="gradient-text text-5xl font-bold tracking-tight sm:text-6xl">Some things I’ve built.</h1>
		<p class="mt-5 text-lg leading-8 text-white/60">
			Mostly physics, simulation, and machine-learning experiments — the kind of projects where I learn by making the thing work.
		</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		{#each projects as project}
			<article class="glass-card glass-card-hover group overflow-hidden">
				<a href={project.link} target="_blank" rel="noopener noreferrer" class="block" aria-label={`Open ${project.title}`}>
					<div class="relative overflow-hidden border-b border-white/10 bg-black/30">
						<img src={project.image} alt={project.title} class="h-72 w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
						<div class="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent"></div>
					</div>

					<div class="p-6 sm:p-7">
						<div class="mb-4 flex flex-wrap gap-2">
							{#each project.tags as tag}
								<span class="rounded-full border border-cyan-200/15 bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-100/85">{tag}</span>
							{/each}
						</div>
						<h2 class="text-2xl font-bold text-white">{project.title}</h2>
						<p class="mt-3 leading-7 text-white/60">{project.description}</p>
						<div class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition group-hover:gap-3">
							View project
							<span aria-hidden="true">→</span>
						</div>
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>
