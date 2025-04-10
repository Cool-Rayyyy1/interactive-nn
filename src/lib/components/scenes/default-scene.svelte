<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import Box from './box.svelte';
	import { Grid } from '@threlte/extras';
	import { range } from '$lib/utils';
	import type CC from 'camera-controls';
	import type { Config } from '$lib/types';
	import { PerspectiveCamera, type ColorRepresentation, type Mesh } from 'three';
	import CameraControls from '$lib/shared/CameraControls';
	import { randomInteger } from '@layerstack/utils';

	let {
		color = '#ff3e00',
		controls = $bindable(),
		mesh = $bindable()
	}: {
		color?: ColorRepresentation;
		controls: CC | undefined;
		mesh?: Mesh;
	} = $props();

	const { dom, invalidate } = useThrelte();

	const camera = new PerspectiveCamera();
	controls = new CameraControls(dom, camera);

	const configs: Config[][] = range(0, 10, 1).map((val, idx) => {
		return range(0, 10, 1).map((ival, iidx) => {
			const shape: [number, number, number] = [1, randomInteger(1, 10), 1];
			const color = (idx + iidx) % 2 === 0 ? 'white' : 'black';
			return <Config>{
				coords: { x: val + 0.5, y: 0.5 * shape[1], z: ival + 0.5 },
				shape,
				color
			};
		});
	});

	$effect(() => {
		return () => {
			controls.dispose();
		};
	});

	controls.setPosition(20, 20, 20);

	useTask(
		(delta) => {
			if (controls.update(delta)) {
				invalidate();
			}
		},
		{ autoInvalidate: false }
	);
</script>

<T.PerspectiveCamera
	makeDefault
	position={[10, 10, 10]}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
/>

{#each configs as oconfig}
	{#each oconfig as config}
		<Box {config} />
	{/each}
{/each}

<T is={camera} makeDefault />

<T.Mesh
	oncreate={(ref) => {
		mesh = ref;
	}}
	position.y={0.5}
>
	<T.BoxGeometry />
	<T.MeshBasicMaterial {color} wireframe />
</T.Mesh>

<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#33334d"
	backgroundColor="#ffffff"
	backgroundOpacity={100}
	gridSize={[20, 20]}
	position={[10, 0, 10]}
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[20, 10]}
	axis="x"
	plane="zy"
	position={[0, 5, 10]}
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[20, 10]}
	axis="x"
	plane="xy"
	position={[10, 5, 0]}
/>

<T.DirectionalLight position={[10, 10, 10]} castShadow />
