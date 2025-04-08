<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';

	interactivity();
	const scale = new Spring(3);

	let rotation = 0;
	useTask((delta) => {
		rotation += delta;
	});

	let { shape, x, y }: { shape: [number, number, number]; x: number; y: number } = $props();
</script>

<T.Mesh
	position.x={x}
	position.y={y}
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 4;
	}}
	onpointerleave={() => {
		scale.target = 3;
	}}
	castShadow
>
	<T.BoxGeometry args={shape} />
	<T.MeshBasicMaterial color="blue" />
	<T.MeshStandardMaterial color="blue" />
</T.Mesh>
