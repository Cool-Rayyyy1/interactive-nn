<script>
	import { T } from '@threlte/core';
	import Box from './box.svelte';
</script>

<T.PerspectiveCamera
	makeDefault
	position={[10, 10, 10]}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
/>

<Box x={-5} y={0} shape={[1, 2, 1]} />
<Box x={0} y={0} shape={[1, 2, 1]} />
<Box x={5} y={0} shape={[1, 2, 1]} />

<T.DirectionalLight position={[0, 10, 10]} castShadow />
<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[10, 80]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
