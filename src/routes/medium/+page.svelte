<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const mediumArticles = data.mediumArticles;
	const mediumBlogUrl = data.mediumBlogUrl;
</script>

<section class="py-16 sm:py-24">
	<div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
		<div>
			<p class="eyebrow mb-4">Medium</p>
			<h1 class="heading text-5xl sm:text-6xl">Latest writing</h1>
			<p class="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
				The latest three articles from my Medium blog about AI, data science, Linux, and things I'm
				learning while building.
			</p>
		</div>
		<a href={mediumBlogUrl} target="_blank" rel="noopener noreferrer" class="btn-primary">
			Visit Medium blog
		</a>
	</div>

	<div class="grid gap-4 lg:grid-cols-3">
		{#each mediumArticles as article}
			<a
				href={article.link}
				target="_blank"
				rel="noopener noreferrer"
				class="card card-hover group flex h-full flex-col overflow-hidden"
			>
				{#if article.image}
					<img
						src={article.image}
						alt=""
						class="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
						loading="lazy"
						referrerpolicy="no-referrer"
					/>
				{:else}
					<div class="flex h-44 w-full items-center justify-center bg-accent-muted text-5xl">
						✍️
					</div>
				{/if}
				<div class="flex flex-1 flex-col p-5">
					<time
						datetime={article.datetime}
						class="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-600"
						>{article.date}</time
					>
					<h2
						class="mb-3 text-xl font-semibold leading-7 text-white transition group-hover:text-accent-light"
					>
						{article.title}
					</h2>
					<p class="mb-5 flex-1 text-sm leading-6 text-gray-500">{article.excerpt}</p>
					<div class="mb-5 flex flex-wrap gap-2">
						{#each article.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
					<span class="inline-flex items-center gap-2 text-sm font-semibold text-accent-light">
						Read on Medium
						<span aria-hidden="true" class="transition group-hover:translate-x-1">→</span>
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
