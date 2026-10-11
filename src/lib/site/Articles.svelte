<script lang="ts">
	import type { MediumArticle } from '$lib/server/medium';

	let { articles, large = false }: { articles: MediumArticle[]; large?: boolean } = $props();
</script>

<ol class="articles" class:large>
	{#each articles as article}
		<li>
			<a href={article.link} target="_blank" rel="noopener noreferrer">
				<time datetime={article.datetime} class="mono">{article.date}</time>
				<span>
					<span class="title">{article.title}</span>
					{#if large && article.tags.length}
						<span class="tags mono">
							{#each article.tags as tag}
								<span>{tag}</span>
							{/each}
						</span>
					{/if}
				</span>
				<span class="excerpt">{article.excerpt}</span>
				{#if article.image}
					<img src={article.image} alt="" loading="lazy" referrerpolicy="no-referrer" />
				{/if}
			</a>
		</li>
	{/each}
</ol>
