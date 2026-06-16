<script>
	let menuOpen = false;

	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<nav class="relative z-20 flex items-center justify-between py-6">
	<a href="/" class="group inline-flex items-center gap-3" aria-label="Go home">
		<img src="/favicon.svg" alt="" class="h-9 w-9 rounded-lg transition duration-300 group-hover:scale-105" />
		<span class="hidden text-sm font-medium text-gray-400 transition group-hover:text-white sm:block">
			Shelamanov
		</span>
	</a>

	<div class="hidden items-center gap-1 md:flex">
		{#each links as link}
			<a href={link.href} class="relative px-4 py-2 text-sm text-gray-500 transition duration-300 hover:text-white after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition after:duration-300 hover:after:scale-x-100">
				{link.label}
			</a>
		{/each}
	</div>

	<button
		class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-500 transition hover:bg-surface-overlay hover:text-white hover:border-border-hover md:hidden"
		on:click={() => (menuOpen = !menuOpen)}
		aria-expanded={menuOpen}
		aria-label="Toggle navigation menu"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			{#if menuOpen}
				<path stroke-linecap="round" d="M6 6l12 12M6 18L18 6" />
			{:else}
				<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
			{/if}
		</svg>
	</button>

	{#if menuOpen}
		<div class="absolute right-0 top-16 flex w-48 flex-col gap-0.5 rounded-lg border border-border bg-surface-raised p-1.5 shadow-2xl shadow-black/40 md:hidden">
			{#each links as link}
				<a href={link.href} class="rounded-md px-3 py-2.5 text-sm text-gray-400 transition hover:bg-surface-overlay hover:text-white" on:click={() => (menuOpen = false)}>
					{link.label}
				</a>
			{/each}
		</div>
	{/if}
</nav>
