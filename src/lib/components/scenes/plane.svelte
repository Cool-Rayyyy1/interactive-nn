<script lang="ts">
	import { T } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import { PlaneGeometry, Vector3 } from 'three';
	import { interactivity, useCursor } from '@threlte/extras';

	interactivity();

	const { onPointerEnter, onPointerLeave } = useCursor();

	const DEFAULT_COLOR = '#003eff';
	const HOVER_COLOR = '#3b82f6';

	const terrainSize = 30;
	const segments = 100;

	let cellSize = $state(1);
	let cellColor = $state('#cccccc');
	let cellThickness = $state(1);
	let sectionSize = $state(1);
	let sectionColor = $state('#ff3e00');
	let sectionThickness = $state(1);

	let gridSize: [number, number] = $state([20, 20]);

	const gridTypeOptions = {
		polar: 'polar',
		grid: 'grid',
		lines: 'lines',
		circular: 'circular'
	};
	let gridType: keyof typeof gridTypeOptions = $state('grid');

	let maxRadius = $state(10);
	let cellDividers = $state(6);
	let sectionDividers = $state(2);

	const planeOptions = {
		xz: 'xz',
		xy: 'xy',
		zy: 'zy'
	};

	let plane: keyof typeof planeOptions = $state('xz');
	let linesAxis = $state('x');

	let followCamera = $state(false);
	let infiniteGrid = $state(false);
	let useFadeOrigin = $state(false);
	let fadeOrigin = $state(new Vector3());
	let fadeDistance = $state(100);
	let backgroundColor = $state(DEFAULT_COLOR);
	let backgroundOpacity = $state(0);
	let fadeStrength = $state(1);

	const geometry = new PlaneGeometry(terrainSize, terrainSize, segments, segments);

	const positions = geometry.getAttribute('position');

	for (let i = 0; i < positions.count; i += 1) {
		const x = positions.getX(i);
		const y = positions.getY(i);
		const height = (x ** 2 + y ** 2) / 25;
		positions.setZ(i, height);
	}

	console.log(geometry);

	geometry.computeVertexNormals();
</script>

<Grid
	position.y={-10}
	{plane}
	{cellColor}
	{cellSize}
	{cellThickness}
	{sectionColor}
	{sectionSize}
	{sectionThickness}
	{followCamera}
	{infiniteGrid}
	{fadeDistance}
	{fadeStrength}
	fadeOrigin={useFadeOrigin ? fadeOrigin : undefined}
	{gridSize}
	{backgroundColor}
	{backgroundOpacity}
	type={gridType}
	axis={linesAxis}
	{maxRadius}
	{cellDividers}
	{sectionDividers}
	onpointer
>
	<T is={geometry} />
</Grid>
