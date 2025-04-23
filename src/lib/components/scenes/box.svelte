<script lang="ts">
	import type { Config } from '$lib/types';
	import { T } from '@threlte/core';
	import { Outlines } from '@threlte/extras';

	let { config }: { config: Config } = $props();
</script>

<!--
@component
A box in a 3d Neural Network output scene.$$render(

A Config can be passed as a prop to control its:
  - x, y, z values
  - Color
  - Shape
)
-->
<T.Mesh
	position.x={config.coords.x}
	position.y={config.coords.y}
	position.z={config.coords.z}
	castShadow
>
	<T.BoxGeometry args={config.shape} />
	<T.MeshBasicMaterial color={config.color} />
	<T.MeshStandardMaterial color={config.color} />
	<Outlines color="black" />
</T.Mesh>
