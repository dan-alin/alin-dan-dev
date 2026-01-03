<script lang="ts">
	import * as THREE from 'three';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';

	// =====================
	// Constants
	// =====================
	const maxParticleCount = 500;
	const r = 800;
	const rHalf = r / 2;
	const mouseInfluenceRadius = 0.1; // In normalized screen space (0-2 range)

	// =====================
	// State (Svelte 5 runes)
	// =====================
	let particleCount = 500;

	let effectController = {
		minDistance: 150,
		limitConnections: false,
		maxConnections: 20
	};

	// =====================
	// Three.js objects
	// =====================
	let group: THREE.Group | undefined = $state();
	let pointCloud: THREE.Points | undefined = $state();
	let linesMesh: THREE.LineSegments | undefined = $state();

	// =====================
	// Mouse tracking (2D screen space)
	// =====================
	const { camera, renderer } = useThrelte();
	const mouse = new THREE.Vector2(10, 10); // Start off-screen

	onMount(() => {
		const handleMouseMove = (event: MouseEvent) => {
			const canvas = renderer.domElement;
			const rect = canvas.getBoundingClientRect();
			// Normalized device coordinates (-1 to +1)
			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	});

	// =====================
	// Particle data
	// =====================
	const particlesData: {
		velocity: THREE.Vector3;
		numConnections: number;
	}[] = [];

	// =====================
	// Buffers
	// =====================
	const particlePositions = new Float32Array(maxParticleCount * 3);

	const segments = maxParticleCount * maxParticleCount;
	const positions = new Float32Array(segments * 3);
	const colors = new Float32Array(segments * 3);
	// Initialize colors to white
	for (let i = 0; i < colors.length; i++) {
		colors[i] = 1.0;
	}

	// =====================
	// Geometries
	// =====================
	const particleGeometry = new THREE.BufferGeometry();
	const lineGeometry = new THREE.BufferGeometry();

	// =====================
	// Init
	// =====================
	for (let i = 0; i < maxParticleCount; i++) {
		// Use a wider spread in X and Y, shallower in Z for better screen coverage
		const x = (Math.random() * 2 - 1) * rHalf;
		const y = (Math.random() * 2 - 1) * rHalf;
		const z = (Math.random() * 2 - 1) * rHalf;

		particlePositions.set([x, y, z], i * 3);

		particlesData.push({
			velocity: new THREE.Vector3(
				(-1 + Math.random() * 2) * 0.1,
				(-1 + Math.random() * 2) * 0.1,
				(-1 + Math.random() * 2) * 0.1
			),
			numConnections: 0
		});
	}

	particleGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage)
	);

	// Use a getter to access particleCount reactively
	function getParticleCount() {
		return particleCount;
	}

	particleGeometry.setDrawRange(0, getParticleCount());

	lineGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
	);
	lineGeometry.setAttribute(
		'color',
		new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage)
	);
	lineGeometry.setDrawRange(0, 0);

	// =====================
	// Frame loop
	// =====================
	useTask(() => {
		if (!group) return;

		const count = particleCount;
		let vertexPos = 0;
		let colorPos = 0;
		let numConnected = 0;

		for (let i = 0; i < count; i++) {
			if (!particlesData[i]) continue;
			particlesData[i].numConnections = 0;
		}

		for (let i = 0; i < count; i++) {
			const p = particlesData[i];
			const i3 = i * 3;
			if (!p) continue;
			particlePositions[i3] += p.velocity.x;
			particlePositions[i3 + 1] += p.velocity.y;
			particlePositions[i3 + 2] += p.velocity.z;

			if (particlePositions[i3] < -rHalf || particlePositions[i3] > rHalf) p.velocity.x *= -1;
			if (particlePositions[i3 + 1] < -rHalf || particlePositions[i3 + 1] > rHalf)
				p.velocity.y *= -1;
			if (particlePositions[i3 + 2] < -rHalf || particlePositions[i3 + 2] > rHalf)
				p.velocity.z *= -1;

			if (effectController.limitConnections && p.numConnections >= effectController.maxConnections)
				continue;

			for (let j = i + 1; j < count; j++) {
				const pb = particlesData[j];
				if (
					effectController.limitConnections &&
					pb.numConnections >= effectController.maxConnections
				)
					continue;

				const j3 = j * 3;

				const dx = particlePositions[i3] - particlePositions[j3];
				const dy = particlePositions[i3 + 1] - particlePositions[j3 + 1];
				const dz = particlePositions[i3 + 2] - particlePositions[j3 + 2];
				const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (dist < effectController.minDistance) {
					p.numConnections++;
					pb.numConnections++;

					// Calculate distance to mouse in 2D screen space
					const midX = (particlePositions[i3] + particlePositions[j3]) / 2;
					const midY = (particlePositions[i3 + 1] + particlePositions[j3 + 1]) / 2;
					const midZ = (particlePositions[i3 + 2] + particlePositions[j3 + 2]) / 2;

					// Project 3D midpoint to 2D screen coordinates
					const screenPos = new THREE.Vector3(midX, midY, midZ);
					screenPos.applyMatrix4(group.matrixWorld);
					screenPos.project(camera.current);

					// Calculate 2D distance on screen
					const distToMouse = Math.sqrt(
						Math.pow(screenPos.x - mouse.x, 2) + Math.pow(screenPos.y - mouse.y, 2)
					);

					const mouseInfluence =
						distToMouse < mouseInfluenceRadius ? 1 - distToMouse / mouseInfluenceRadius : 0;
					// Base alpha is very low (0.05), but near mouse it goes up to 1.0
					const alpha = (1 - dist / effectController.minDistance) * (0.05 + mouseInfluence * 0.95);

					positions.set(
						[
							particlePositions[i3],
							particlePositions[i3 + 1],
							particlePositions[i3 + 2],
							particlePositions[j3],
							particlePositions[j3 + 1],
							particlePositions[j3 + 2]
						],
						vertexPos
					);
					vertexPos += 6;

					// Set white color with alpha controlling brightness
					colors.set([alpha, alpha, alpha, alpha, alpha, alpha], colorPos);
					colorPos += 6;

					numConnected++;
				}
			}
		}
		if (!lineGeometry.attributes.position || !lineGeometry.attributes.color) return;

		lineGeometry.setDrawRange(0, numConnected * 2);
		lineGeometry.attributes.position.needsUpdate = true;
		lineGeometry.attributes.color.needsUpdate = true;
		particleGeometry.attributes.position.needsUpdate = true;

		group.rotation.y += 0.0001;

		// Animate camera zoom
		const time = performance.now() * 0.0001;
		const zoomAmount = Math.sin(time) * 100;
		camera.current.position.z = 500 + zoomAmount;
	});
</script>

<T.Group bind:ref={group}>
	<!-- Particles -->
	<T.Points bind:ref={pointCloud} geometry={particleGeometry}>
		<T.PointsMaterial
			size={1}
			transparent
			vertexColors
			blending={THREE.AdditiveBlending}
			sizeAttenuation={false}
		/>
	</T.Points>

	<!-- Lines -->
	<T.LineSegments bind:ref={linesMesh} geometry={lineGeometry}>
		<T.LineBasicMaterial
			vertexColors
			transparent
			blending={THREE.AdditiveBlending}
			linewidth={0.5}
		/>
	</T.LineSegments>
</T.Group>
