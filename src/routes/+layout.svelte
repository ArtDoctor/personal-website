<script lang="ts">
	import Navbar from "../lib/components/Navbar.svelte";
	import Footer from "../lib/components/Footer.svelte";
	import '../app.css';
	let { children } = $props();
</script>

  
<div class="dark min-h-screen bg-gradient-to-tr from-neutral-950 via-black to-neutral-950 text-gray-100 font-sans">
	<main class="container mx-auto px-4 py-4">
		<div class="bg-neutral-950 rounded-3xl px-16 py-8 mx-4">
		<Navbar />
			{@render children()}
		<Footer />
		</div>
	</main>	
</div>

<style>
	main {
		font-family: 'Montserrat', sans-serif; /* Set Montserrat as the default */
	}
</style>