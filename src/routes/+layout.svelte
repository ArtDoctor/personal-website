<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
	<div class="pointer-events-none fixed inset-0 -z-10">
		<div class="absolute left-1/2 top-[-16rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>
		<div class="absolute bottom-[-18rem] left-[-10rem] h-[36rem] w-[36rem] rounded-full bg-violet-600/20 blur-3xl"></div>
		<div class="absolute right-[-12rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl"></div>
		<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_68%)]"></div>
	</div>

	<main class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
		<div class="shell-card min-h-[calc(100vh-2rem)] overflow-hidden px-5 py-5 sm:px-8 lg:min-h-[calc(100vh-4rem)] lg:px-10">
			<Navbar />
			{@render children()}
			<Footer />
		</div>
	</main>
</div>
