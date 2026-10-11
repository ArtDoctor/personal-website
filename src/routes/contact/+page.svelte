<script lang="ts">
	import { contact, person } from '$lib/content';
	import ContactBlock from '$lib/site/ContactBlock.svelte';
</script>

<svelte:head>
	<title>Contact · {person.name}</title>
	<meta name="description" content={contact.body} />
</svelte:head>

<section class="band page-head">
	<p class="crumb mono"><a href="/">home</a><b>/</b><span>contact</span></p>
	<h1>{contact.heading}</h1>
	<p class="intro">{contact.body}</p>
</section>

<section class="band">
	<ContactBlock />
</section>
