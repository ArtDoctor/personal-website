<script>
    let menuOpen = false;
</script>

<nav class="flex items-center justify-between py-4 px-10 relative z-10">
  <a
    href="/"
    class="text-xl font-bold hover:text-cyan-400 transition-colors duration-300"
  >
    Artem
  </a>

  <!-- Desktop Menu -->
  <div class="hidden md:flex space-x-6 text-center">
    <a
      href="/about"
      class="hover:text-violet-400 duration-300 transition-all hover:font-bold hover:scale-110"
      >About</a
    >
    <a
      href="/projects"
      class="hover:text-violet-400 duration-300 transition-all hover:font-bold hover:scale-110"
      >Projects</a
    >
    <a
      href="/contact"
      class="hover:text-violet-400 duration-300 transition-all hover:font-bold hover:scale-110"
      >Contact</a
    >
  </div>

  <!-- Mobile Menu Button -->
  <button
    class="md:hidden focus:outline-none"
    on:click={() => (menuOpen = !menuOpen)}
  >
    <!-- Hamburger icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 fill-current"
      viewBox="0 0 24 24"
    >
      <path
        fill-rule="evenodd"
        d="M4 5h16v2H4zM4 11h16v2H4zM4 17h16v2H4z"
      />
    </svg>
  </button>

  <!-- Mobile Menu Dropdown -->
  {#if menuOpen}
    <div
      class="absolute top-14 right-0 bg-gray-900 p-4 rounded shadow-lg flex flex-col space-y-3 md:hidden animate-fadeIn"
    >
      <a
        href="/about"
        class="hover:text-primary transition-colors duration-300"
        >About</a
      >
      <a
        href="/projects"
        class="hover:text-primary transition-colors duration-300"
        >Projects</a
      >
      <a
        href="/contact"
        class="hover:text-primary transition-colors duration-300"
        >Contact</a
      >
    </div>
  {/if}
</nav>
  