<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import Box from './box.svelte';
	import { Grid } from '@threlte/extras';
	import type CC from 'camera-controls';
	import type { Config, Input3d } from '$lib/types';
	import { PerspectiveCamera, type ColorRepresentation, type Mesh } from 'three';
	import CameraControls from '$lib/shared/CameraControls';
	import { HTML } from '@threlte/extras';

	let {
		color = '#ff3e00',
		controls = $bindable(),
		mesh = $bindable(),
		data = $bindable()
	}: {
		color?: ColorRepresentation;
		controls: CC | undefined;
		mesh?: Mesh;
		data: Input3d[];
	} = $props();

	const { dom, invalidate } = useThrelte();

	const camera = new PerspectiveCamera();
	controls = new CameraControls(dom, camera);

	const shape: [number, number, number] = [1, 0.1, 1];

	let configs: Config[] = $derived(
		data.map((val) => {
			const color = val.output < 0.5 ? 'white' : 'blue';
			return <Config>{
				coords: { x: val.input_x1 + 0.5, y: val.output, z: val.input_x2 + 0.5 },
				shape,
				color
			};
		})
	);

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
		ref.lookAt(0, 2, 0);
	}}
/>

{#each configs as config}
	<Box {config} />
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
	backgroundOpacity={0}
	gridSize={[10, 10]}
	position={[0, 0, 0]}
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[10, 2]}
	axis="x"
	plane="zy"
	position={[0, 0, 0]}
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[10, 2]}
	axis="x"
	plane="xy"
	position={[0, 0, 0]}
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[10, 4]}
	axis="x"
	plane="xy"
	position={[0, 0, -5]}
	cellSize={0.5}
	sectionSize={1}
/>
<Grid
	sectionColor={color}
	sectionThickness={1}
	cellColor="#cccccc"
	gridSize={[10, 4]}
	axis="x"
	plane="zy"
	position={[-5, 0, 0]}
	cellSize={0.5}
	sectionSize={1}
/>

<T.DirectionalLight position={[10, 10, 10]} castShadow />

<HTML position.z={5.1} position.x={5} occlude>
	<h1>-5</h1>
</HTML>

<HTML position.z={5.1} position.x={4} occlude>
	<h1>-4</h1>
</HTML>

<HTML position.z={5.1} position.x={3} occlude>
	<h1>-3</h1>
</HTML>

<HTML position.z={5.1} position.x={2} occlude>
	<h1>-2</h1>
</HTML>

<HTML position.z={5.1} position.x={1} occlude>
	<h1>-1</h1>
</HTML>

<HTML position.z={5.1} occlude>
	<h1>0</h1>
</HTML>

<HTML position.z={5.1} position.x={-1} occlude>
	<h1>1</h1>
</HTML>

<HTML position.z={5.1} position.x={-2} occlude>
	<h1>2</h1>
</HTML>

<HTML position.z={5.1} position.x={-3} occlude>
	<h1>3</h1>
</HTML>

<HTML position.z={5.1} position.x={-4} occlude>
	<h1>4</h1>
</HTML>

<HTML position.z={5.1} position.x={-5} occlude>
	<h1>5</h1>
</HTML>

<HTML position.x={5.1} position.z={4} occlude>
	<h1>-4</h1>
</HTML>

<HTML position.x={5.1} position.z={3} occlude>
	<h1>-3</h1>
</HTML>

<HTML position.x={5.1} position.z={2} occlude>
	<h1>-2</h1>
</HTML>

<HTML position.x={5.1} position.z={1} occlude>
	<h1>-1</h1>
</HTML>

<HTML position.x={5.1} occlude>
	<h1>0</h1>
</HTML>

<HTML position.x={5.1} position.z={-1} occlude>
	<h1>1</h1>
</HTML>

<HTML position.x={5.1} position.z={-2} occlude>
	<h1>2</h1>
</HTML>

<HTML position.x={5.1} position.z={-3} occlude>
	<h1>3</h1>
</HTML>

<HTML position.x={5.1} position.z={-4} occlude>
	<h1>4</h1>
</HTML>

<HTML position.x={5.1} position.z={-5} occlude>
	<h1>5</h1>
</HTML>

<HTML position.x={5.1} position.z={-5} position.y={1.1} occlude>
	<h1>1</h1>
</HTML>

<HTML position.x={5.1} position.z={-5} position.y={2.1} occlude>
	<h1>2</h1>
</HTML>

<HTML position.x={-5} position.z={5.1} position.y={1.1} occlude>
	<h1>1</h1>
</HTML>

<HTML position.x={-5} position.z={5.1} position.y={2.1} occlude>
	<h1>2</h1>
</HTML>
