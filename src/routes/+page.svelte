<script>
    import { onMount } from 'svelte';

    export let name = "Artem";
    export let title = "Computational Physicist, Entrepreneur, and Lifelong Learner";
    export let description = "I explore the intersection of physics, AI, and technology to build innovative solutions. Passionate about productivity, deep thinking, and making life smarter.";

    let subscribers = "Join 260+ curious minds";

    onMount(() => {
    console.log("Welcome to Artem's website!");
    });

  import { writable } from 'svelte/store';
  let email = writable("");
</script>

<style>
  :global(body) {
    @apply bg-gray-900 text-gray-200;
  }
</style>

<div class="flex flex-col items-center text-center min-h-screen px-6 py-12">
  <header class="flex items-center justify-between w-full max-w-4xl pb-6">
    <h1 class="text-2xl font-bold text-white">{name}</h1>
    <button class="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400">{subscribers}</button>
  </header>

  <section class="max-w-4xl">
    <img src="/profile.png" alt="{name}" class="w-32 h-32 rounded-full border-4 border-blue-500 mb-4">
    <h2 class="text-3xl font-semibold">Hey there! I'm {name} 👋</h2>
    <p class="text-lg mt-3 text-gray-400">{title}</p>
    <p class="mt-4 text-gray-300 leading-relaxed">{description}</p>
  </section>

  <section class="mt-8 bg-gray-800 p-6 rounded-xl w-full max-w-2xl">
    <h3 class="text-xl font-bold text-white">Subscribe to LifeNotes</h3>
    <p class="text-gray-400 mt-2">Get insights on productivity, deep tech, and strategy straight to your inbox.</p>
    <div class="mt-4 flex flex-col sm:flex-row gap-3">
      <input type="email" bind:value={$email} placeholder="Your email" class="flex-1 p-3 rounded-lg bg-gray-700 text-white">
      <button class="px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-500">Subscribe</button>
    </div>
  </section>
</div>
