<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { person } from '$lib/content';
	import Orbits from '$lib/site/Orbits.svelte';
	import '../app.css';
	import '$lib/site/site.css';

	let { children } = $props();

	let ready = $state(false);
	let scrolled = $state(0);

	const links = [
		{ href: '/portfolio', label: 'portfolio' },
		{ href: '/medium', label: 'medium' },
		{ href: '/hobbies', label: 'hobbies' },
		{ href: '/contact', label: 'contact' }
	];

	const isHome = $derived(page.url.pathname === '/');

	// The orbits are at full strength behind the top of each page and step back as you read on.
	const fieldOpacity = $derived(Math.max(0.5, 1 - scrolled / 1400));

	onMount(() => {
		ready = true;
		scrolled = window.scrollY;
	});
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY)} />

<div class="site" class:ready style:--field-opacity={fieldOpacity}>
	<Orbits />

	<header class="bar" class:solid={scrolled > (isHome ? 560 : 24)}>
		<a href="/" class="brand" aria-label="Home">
			<span class="long">{person.name}</span>
			<span class="short">A<i>*</i></span>
		</a>
		<nav aria-label="Pages">
			{#each links as link}
				<a
					href={link.href}
					aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="band foot">
		<div class="mono">
			<span>© {new Date().getFullYear()} {person.name}</span>
			<span>physics · code · experiments</span>
			<nav aria-label="Pages">
				{#each links as link}
					<a href={link.href}>{link.label}</a>
				{/each}
			</nav>
			<span>50.08° N, 14.44° E</span>
		</div>
	</footer>
</div>
