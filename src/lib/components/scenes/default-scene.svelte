<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import Box from './box.svelte';
	import { Grid } from '@threlte/extras';
	import type CC from 'camera-controls';
	import type { Config, Input } from '$lib/types';
	import { PerspectiveCamera, type ColorRepresentation, type Mesh } from 'three';
	import CameraControls from '$lib/shared/CameraControls';

	let {
		color = '#ff3e00',
		controls = $bindable(),
		mesh = $bindable(),
		data = $bindable()
	}: {
		color?: ColorRepresentation;
		controls: CC | undefined;
		mesh?: Mesh;
		data: Input[];
	} = $props();

	const { dom, invalidate } = useThrelte();

	const camera = new PerspectiveCamera();
	controls = new CameraControls(dom, camera);

	const configs: Config[][] = data.map((val) => {
		return data.map((ival) => {
			const shape: [number, number, number] = [val.input, val.output, ival.input];
			const color = val.output < 0.5 ? 'white' : 'black';
			return <Config>{
				coords: { x: val.input + 0.5, y: 0.5 * shape[1], z: ival.input + 0.5 },
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
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[20, 10]}
	axis="x"
	plane="zy"
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[20, 10]}
	axis="x"
	plane="xy"
/>

<T.DirectionalLight position={[10, 10, 10]} castShadow />
