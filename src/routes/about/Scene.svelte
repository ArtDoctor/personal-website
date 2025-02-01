<script lang="ts">
    import { OrbitControls } from '@threlte/extras'
    import { T } from '@threlte/core'
  
    type SceneProps = { autoRotate: boolean }
  
    let { autoRotate = true }: SceneProps = $props()
  </script>
  
  <T.DirectionalLight position={5} />
  
  <T.PerspectiveCamera
    makeDefault
    position.z={2}
    rotation.y={Math.PI / 2}
  >
    <OrbitControls {autoRotate} />
  </T.PerspectiveCamera>
  
  <T.Mesh>
    <T.MeshNormalMaterial />
    <T.TorusGeometry />
  </T.Mesh>
  