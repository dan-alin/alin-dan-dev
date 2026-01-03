<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import ParticleScene from './ParticleScene.svelte';
</script>

<Canvas background="#020617">
	<T.PerspectiveCamera makeDefault position={[0, 0, 250]} fov={50}>
		<OrbitControls enableZoom enableRotate={false} />
	</T.PerspectiveCamera>
	<ParticleScene />
</Canvas>
