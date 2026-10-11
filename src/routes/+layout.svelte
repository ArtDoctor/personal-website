<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { person } from '$lib/content';
	import { eclipse } from '$lib/site/eclipse.svelte';
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

	// On the home page the bar floats over the hero until the disc has passed under it.
	const solid = $derived(isHome ? eclipse.overhead || eclipse.progress > 0.9 : scrolled > 24);
	const readout = $derived(
		eclipse.coverage > 0.995 ? 'totality' : `obscuration ${Math.round(eclipse.coverage * 100)}%`
	);

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

	<header class="bar" class:solid class:float={isHome && !solid}>
		<a href="/" class="brand" aria-label="Home">
			<span class="long">{person.name}</span>
			<span class="short">A<i>*</i></span>
		</a>
		{#if isHome}
			<span class="readout" class:on={eclipse.active} aria-hidden="true">{readout}</span>
		{/if}
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
