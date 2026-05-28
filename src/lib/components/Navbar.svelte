<script>
	let menuOpen = false;

	const links = [
		{ href: '/about', label: 'About' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<nav class="relative z-20 flex items-center justify-between py-2">
	<a href="/" class="group inline-flex items-center gap-3" aria-label="Go home">
		<span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-bold text-cyan-100 shadow-lg shadow-black/20 transition duration-300 group-hover:border-cyan-200/40 group-hover:bg-cyan-200/10">
			AS
		</span>
		<span class="hidden text-sm font-semibold tracking-wide text-white/90 transition group-hover:text-white sm:block">
			Artem Shelamanov
		</span>
	</a>

	<div class="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm text-white/65 backdrop-blur md:flex">
		{#each links as link}
			<a href={link.href} class="rounded-full px-4 py-2 transition duration-300 hover:bg-white/10 hover:text-white">
				{link.label}
			</a>
		{/each}
	</div>

	<button
		class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:bg-white/10 md:hidden"
		on:click={() => (menuOpen = !menuOpen)}
		aria-expanded={menuOpen}
		aria-label="Toggle navigation menu"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
			<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
		</svg>
	</button>

	{#if menuOpen}
		<div class="absolute right-0 top-14 flex w-52 flex-col gap-1 rounded-3xl border border-white/10 bg-neutral-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur md:hidden">
			{#each links as link}
				<a href={link.href} class="rounded-2xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">
					{link.label}
				</a>
			{/each}
		</div>
	{/if}
</nav>
