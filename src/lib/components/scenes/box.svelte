<script lang="ts">
	import type { Config } from '$lib/types';
	import { T } from '@threlte/core';

	let { config }: { config: Config } = $props();
</script>

<T.Mesh
	position.x={config.coords.x}
	position.y={config.coords.y}
	position.z={config.coords.z}
	castShadow
>
	<T.BoxGeometry args={config.shape} />
	<T.MeshBasicMaterial color={config.color} />
	<T.MeshStandardMaterial color={config.color} />
</T.Mesh>
