<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="relative min-h-screen bg-surface text-gray-200">
	<!-- Top accent line -->
	<div class="h-px bg-gradient-to-r from-transparent via-accent to-transparent"></div>

	<!-- Subtle grid background -->
	<div class="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
		style="background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 64px 64px;">
	</div>

	<main class="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
		<Navbar />
		{@render children()}
		<Footer />
	</main>
</div>
