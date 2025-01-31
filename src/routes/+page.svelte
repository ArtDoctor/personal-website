<script>
  let showHero = false;
  let languages = [
    { name: "🇬🇧 English", level: "C2", progress: 6, color: "green" },
    { name: "🇺🇦 Ukrainian", level: "C2", progress: 6, color: "green" },
    { name: "Russian", level: "C2", progress: 6, color: "green" },
    { name: "🇩🇪 German", level: "B1", progress: 3, color: "yellow" },
    { name: "🇨🇿 Czech", level: "A2", progress: 2, color: "yellow" },
    { name: "🇨🇳 Chinese", level: "HSK2", progress: 2, color: "yellow" }
  ];

  // Trigger fadeIn on mount
  import { onMount } from "svelte";
  onMount(() => {
    showHero = true;
  });
</script>

<section
  class="flex flex-col md:flex-row items-center justify-center text-left py-20 transition-opacity duration-1000"
  class:opacity-0={!showHero}
  class:opacity-100={showHero}
>
  <div class="md:w-1/2 flex justify-center mb-8 md:mb-0">
    <img src="/images/avatar.png" alt="Hero" class="h-64 w-64 md:h-96 md:w-96" />
  </div>
  <div class="md:w-1/2">
    <h1
      class="text-5xl md:text-7xl  font-bold
         animate-fadeIn flex items-center"
    >
      <div class="bg-gradient-to-r from-violet-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
        Hello there!
      </div>
      <span class="text-black ml-2">👋</span>
    </h1>
    <p class="mt-4 text-4xl max-w-3xl">
      I'm <span class="text-primary font-">Ash! A physicist who applies science everywhere (even when it doesn't fit).</span> 
    </p>
  </div>
</section>

<!-- Animated section with floating items -->
<section class="py-20 px-4 text-center">
  <h2 class="text-3xl font-semibold mb-6">Technologies I Use</h2>
  <div class="align-middle flex flex-col items-center">
    <img src="https://skillicons.dev/icons?i=py,tensorflow,pytorch,sklearn,fastapi,flask,anaconda" alt="Technology icons part 1" class="mb-4"/>
    <img src="https://skillicons.dev/icons?i=js,ts,bun,html,css,tailwind,svelte,react,vite" alt="Technology icons part 2" class="mb-4"/>
    <img src="https://skillicons.dev/icons?i=cs,cpp" alt="Technology icons part 3" class="mb-4"/>
    <img src="https://skillicons.dev/icons?i=postgres,mysql,sqlite,redis,supabase" alt="Technology icons part 4" class="mb-4"/>
    <img src="https://skillicons.dev/icons?i=figma,gcp,azure,bash,ubuntu,git,github,blender,unity,docker" alt="Technology icons part 5" class="mb-4"/>
  </div>
  <div class="my-4">
    Icons added with <a href="https://skillicons.dev" target="_blank" rel="noopener noreferrer" class="text-blue-400">skillicons</a>
  </div>
  <div class="mt-8" >
    <a
      class="bg-primary px-6 py-3 text-black rounded-lg shadow hover:shadow-lg bg-cyan-300 
      transform hover:scale-105 hover:bg-cyan-400 transition-all duration-300" href="/projects"
    aria-label="View My Work">
      View My Work
    </a>
  </div>
</section>

<!-- Section with languages -->
<section class="py-20 px-4 text-center">
  <h2 class="text-3xl font-semibold mb-8">Languages</h2>
  <div class="flex flex-col items-center space-y-6">
    {#each languages as lang}
      <div class="flex items-center space-x-4 w-full max-w-lg">
        <span class="text-lg font-medium w-28 text-left">{lang.name}</span>
        <div class="flex space-x-1 flex-1">
          {#each Array(6).fill(0).map((_, i) => i) as i}
            <div class="w-12 h-6 rounded-md shadow-md transition-all duration-300 {i < lang.progress ? `bg-${lang.color}-500` : `bg-${lang.color}-300 shadow-inner`}">
            </div>
          {/each}
        </div>
        <span class="text-lg font-medium w-8 text-right">{lang.level}</span>
      </div>
    {/each}
  </div>
</section>