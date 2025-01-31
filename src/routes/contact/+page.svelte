<script>
    import { onMount } from "svelte";
  
    let name = "";
    let email = "";
    let message = "";
    let submitted = false;
  
    function handleSubmit() {
      // This can be expanded to use a real form endpoint, e.g. using fetch()
      submitted = true;
    }
  </script>
  
  <section class="py-20 px-4 max-w-xl mx-auto">
    <h1 class="text-5xl font-bold mb-6 text-center">Contact Me</h1>
    <div class="text-3xl text-center">
      This is WIP, just write to my email: <a href="mailto:artdoctorka@gmail.com" class="text-blue-300">artdoctorka@gmail.com</a>
    </div>
    <!-- {#if submitted}
      <p class="text-center text-xl text-primary">Thanks for your message!</p>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="name" class="block text-sm mb-1">Name</label>
          <input
            id="name"
            class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            bind:value={name}
            required
          />
        </div>
        <div>
          <label for="email" class="block text-sm mb-1">Email</label>
          <input
            id="email"
            type="email"
            class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            bind:value={email}
            required
          />
        </div>
        <div>
          <label for="message" class="block text-sm mb-1">Message</label>
          <textarea
            id="message"
            rows="4"
            class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            bind:value={message}
            required
          />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-white rounded hover:bg-pink-600
            transition-colors duration-300"
        >
          Send
        </button>
      </form>
    {/if} -->
  </section>
  