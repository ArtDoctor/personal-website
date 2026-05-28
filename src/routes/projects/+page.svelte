<script>
	let projects = [
		{
			title: 'Genetic Car Simulator',
			description:
				'A browser-based 3D simulator that evolves simple cars over rugged roads with Python-powered genes, mutation, crossover, and leaderboards.',
			link: 'https://genetic-simulator.shelamanov.com/',
			image: '/images/genetic-car-simulator.png'
		},
		{
			title: 'Thomson Parabolas U-Net',
			description:
				'An automated Thomson spectrometer image-analysis pipeline that preprocesses detector images, fits ion parabolas, classifies species, and builds energy spectra.',
			link: 'https://thomson-parabolas-unet.shelamanov.com/',
			image: '/images/thomson-parabolas-unet.png'
		},
		{
			title: 'Awesome Project',
			description: 'A fancy project that does awesome things.',
			link: 'https://example.com',
			image: '/images/project1.jpg'
		},
		{
			title: 'Another Project',
			description: 'This one is even cooler!',
			link: 'https://example.com',
			image: '/images/project1.jpg'
		}
	];
</script>

<section class="mx-auto max-w-5xl px-4 py-20">
	<h1 class="mb-10 text-center text-4xl font-bold">My Projects</h1>
	<div class="grid gap-8 md:grid-cols-2">
		{#each projects as project}
			<div
				class="overflow-hidden rounded-lg bg-gray-800 shadow transition-shadow duration-300 hover:shadow-lg"
			>
				<img src={project.image} alt={project.title} class="h-48 w-full object-cover" />
				<div class="p-4">
					<h2 class="text-2xl font-semibold">{project.title}</h2>
					<p class="mt-2 text-gray-300">{project.description}</p>
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-primary mt-4 inline-block rounded px-4 py-2 text-white transition-colors duration-300 hover:bg-pink-600"
						>View Project</a
					>
				</div>
			</div>
		{/each}
	</div>
</section>
