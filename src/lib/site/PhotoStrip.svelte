<script lang="ts">
	import { hoverScroll } from '$lib/actions/scroll';
	import { photos } from '$lib/content';
</script>

<div class="strip" use:hoverScroll>
	{#each photos as photo, i}
		<figure>
			<picture style="display: block">
				{#if photo.webp}
					<source srcset={photo.webp} type="image/webp" />
				{/if}
				<img
					src={photo.src}
					alt={photo.alt}
					width={photo.width}
					height={photo.height}
					loading="lazy"
					draggable="false"
				/>
			</picture>
			<figcaption class="mono">fig. {i + 1} · {photo.caption.toLowerCase()}</figcaption>
		</figure>
	{/each}
</div>
