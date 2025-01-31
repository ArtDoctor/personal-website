<script>
    let projects = [
      {
        title: "Awesome Project",
        description: "A fancy project that does awesome things.",
        link: "https://example.com",
        image: "/images/project1.jpg",
      },
      {
        title: "Another Project",
        description: "This one is even cooler!",
        link: "https://example.com",
        image: "/images/project1.jpg",
      },
    ];
  </script>
  
  <section class="py-20 px-4 max-w-5xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-10">My Projects</h1>
    <div class="grid gap-8 md:grid-cols-2">
      {#each projects as project}
        <div
          class="bg-gray-800 rounded-lg shadow hover:shadow-lg overflow-hidden transition-shadow duration-300"
        >
          <img src={project.image} alt={project.title} class="w-full h-48 object-cover" />
          <div class="p-4">
            <h2 class="text-2xl font-semibold">{project.title}</h2>
            <p class="mt-2 text-gray-300">{project.description}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-pink-600 transition-colors duration-300"
              >View Project</a
            >
          </div>
        </div>
      {/each}
    </div>
  </section>
  