<script lang="ts">
  import Scene from '../about/Scene.svelte'
  import type { AsciiEffectOptions } from 'three/examples/jsm/Addons.js'
  import { AsciiRenderer } from '@threlte/extras'
  import { Canvas } from '@threlte/core'

  let fgColor = $state('#54c9d6')
  let bgColor = $state('#100c0c')

  const defaultCharacters = ' .:-+*=%@#'
  let characters = $state(defaultCharacters)

  let alpha = $state(1)
  let block = $state(false)
  let color = $state(false)
  let invert = $state(true)
  let resolution = $state(0.1)
  let scale = $state(1)

  const options: AsciiEffectOptions = $derived({
    alpha,
    block,
    color,
    invert,
    resolution,
    scale
  })

  let autoRotate = $state(true)
</script>
  
<div class="h-72">
  <Canvas>
    <AsciiRenderer
      {bgColor}
      {characters}
      {fgColor}
      {options}
    />
    <Scene {autoRotate} />
  </Canvas>
</div>

<section class="py-20 px-4 max-w-3xl mx-auto text-center md:text-left">
  <h1 class="text-5xl font-bold mb-6">About Me</h1>
  <div class="text-3xl">
    <p class="mb-4">
      Hey, I'm Artem — a computational physicist, data scientist, and startup enthusiast who loves solving problems.
    </p>
    <p class="mb-4">
      My dream is to bring cutting-edge technologies to the world. From reading sci-fi to working on state-of-art AI projects, I'm amazed by the potential humanity holds.
    </p>
    <p>
      Let's build something incredible. 🚀
    </p>
  </div>
</section>
  