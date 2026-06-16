<script>
	const projects = [
		{
			title: 'Yazero',
			description:
				'A home for the startups I\'ve worked on with my co-founder — small bets, experiments, and products we\'re trying to make real.',
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
				'My bachelor thesis - a tool for handling Thomson spectrometer images: cleaning detector shots, finding ion parabolas, classifying species, and turning the result into energy spectra.',
			link: 'https://thomson-parabolas-unet.shelamanov.com/',
			image: '/images/thomson-parabolas-unet.png',
			tags: ['U-Net', 'Physics', 'Computer vision']
		}
	];
</script>

<section class="py-16 lg:py-24">
	<div class="mb-12 max-w-3xl">
		<p class="eyebrow mb-4">Projects</p>
		<h1 class="heading text-5xl sm:text-6xl">Some things I've built.</h1>
		<div class="accent-line mt-4"></div>
		<p class="mt-5 text-lg leading-8 text-gray-500">
			Mostly physics, simulation, and machine-learning experiments — the kind of projects where I learn by making the thing work.
		</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		{#each projects as project}
			<article class="card card-hover group overflow-hidden">
				<a href={project.link} target="_blank" rel="noopener noreferrer" class="block" aria-label={`Open ${project.title}`}>
					<div class="relative overflow-hidden border-b border-border bg-surface">
						<img src={project.image} alt={project.title} class="h-64 w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
						<div class="absolute inset-0 bg-gradient-to-t from-surface-raised via-transparent to-transparent"></div>
					</div>

					<div class="p-6">
						<div class="mb-3 flex flex-wrap gap-2">
							{#each project.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
						<h2 class="text-xl font-bold text-white">{project.title}</h2>
						<p class="mt-2 text-sm leading-7 text-gray-500">{project.description}</p>
						<div class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition group-hover:gap-3">
							View project
							<span aria-hidden="true">→</span>
						</div>
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>
