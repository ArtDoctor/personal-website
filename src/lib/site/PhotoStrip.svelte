<script lang="ts">
	import { dragScroll } from '$lib/actions/scroll';
	import { photos } from '$lib/content';
</script>

<div class="strip" use:dragScroll>
	{#each photos as photo, i}
		<figure>
			<img
				src={photo.src}
				alt={photo.alt}
				width={photo.width}
				height={photo.height}
				loading="lazy"
				draggable="false"
			/>
			<figcaption class="mono">fig. {i + 1} · {photo.caption.toLowerCase()}</figcaption>
		</figure>
	{/each}
</div>
