<script lang="ts">
	import { contact, links, person } from '$lib/content';

	let copied = $state(false);

	const socials = [
		{ label: 'GitHub', href: links.github },
		{ label: 'LinkedIn', href: links.linkedin },
		{ label: 'Medium', href: links.medium },
		{ label: 'Linktree', href: links.linktree }
	];

	async function copyEmail() {
		await navigator.clipboard.writeText(person.email);
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}
</script>

<a href={`mailto:${person.email}`} class="email">{person.email}</a>

<div class="contact-row">
	<button type="button" class="btn" onclick={copyEmail}>{copied ? 'copied' : 'copy address'}</button
	>
	<p class="note">{contact.hint}</p>
	<ul class="socials mono">
		{#each socials as social}
			<li><a href={social.href} target="_blank" rel="noopener noreferrer">{social.label} ↗</a></li>
		{/each}
	</ul>
</div>
