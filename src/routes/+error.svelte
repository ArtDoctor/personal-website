<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} · Artem Shelamanov</title>
</svelte:head>

<section class="band page-head">
	<p class="crumb mono"><a href="/">home</a><b>/</b><span>{page.status}</span></p>
	<h1>{page.status === 404 ? 'Nothing here.' : 'Something broke.'}</h1>
	<p class="intro">
		{page.status === 404
			? 'This page does not exist, or it moved when the site was rebuilt.'
			: page.error?.message}
	</p>
	<div class="buttons after">
		<a href="/" class="btn solid">Back to the start <span>→</span></a>
		<a href="/portfolio" class="btn">Portfolio</a>
	</div>
</section>
