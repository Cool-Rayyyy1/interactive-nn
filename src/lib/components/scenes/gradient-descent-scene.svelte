<script lang="ts">
	import { OrbitControls } from '@threlte/extras';
	import { PlaneGeometry } from 'three';
	import { SimplexNoise } from 'three/examples/jsm/Addons.js';
	import { T } from '@threlte/core';
	import Plane from './plane.svelte';

	let { autoRotate = false, flatness = 10 }: { autoRotate?: boolean; flatness?: number } = $props();

	const geometry = new PlaneGeometry(10, 10, 100, 100);
	const positions = geometry.getAttribute('position');

	const noise = new SimplexNoise();

	$effect(() => {
		for (let i = 0; i < positions.count; i += 1) {
			const x = positions.getX(i) / flatness;
			const y = positions.getY(i) / flatness;
			positions.setZ(i, noise.noise(x, y));
		}

		positions.needsUpdate = true;

		// needed for lighting
		geometry.computeVertexNormals();
	});
</script>

<T.DirectionalLight position={[10, 10, 10]} />

<T.PerspectiveCamera makeDefault position={25}>
	<OrbitControls {autoRotate} autoRotateSpeed={0.5} />
</T.PerspectiveCamera>

<Plane />
