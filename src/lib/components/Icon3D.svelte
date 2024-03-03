<script lang="ts">
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { onMount } from 'svelte';

	type Vec3d = {
		x?: number;
		y?: number;
		z?: number;
	};
	type Props = {
		name: string;
		speed?: number;
		cameraP?: { pos?: Vec3d; rot?: Vec3d };
		initP?: { pos?: Vec3d; rot?: Vec3d };
		updateP?: { pos?: Vec3d; rot?: Vec3d };
	};

	const DEFAULT_PARAM: { pos?: Vec3d; rot?: Vec3d } = {
		pos: { x: 0, y: 0, z: 0 },
		rot: { x: 0, y: 0, z: 0 }
	};

	let elt: Element | undefined = $state();
	let {
		name,
		speed = 1,
		cameraP = DEFAULT_PARAM,
		initP = DEFAULT_PARAM,
		updateP = DEFAULT_PARAM
	} = $props<Props>();

	onMount(() => {
		if (elt) elt.appendChild(renderer.domElement);
	});

	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;
	// let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
	let loader: GLTFLoader;
	let mixer: THREE.AnimationMixer;

	let model: THREE.Group<THREE.Object3DEventMap>;

	if (browser) {
		const init = () => {
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(75, 120 / 120, 0.1, 1000);
			renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			loader = new GLTFLoader();

			renderer.setSize(120, 120);

			const light = new THREE.AmbientLight(0xffffff, 3.0); // soft white light
			const dirLight = new THREE.DirectionalLight(0xffffff, 3);
			scene.add(light);
			scene.add(dirLight);

			camera.position.z = 8;
			camera.position.x = cameraP.pos?.x || 0;
			camera.position.y = cameraP.pos?.y || 0;
			camera.position.z = cameraP.pos?.z || 0;
			loader.load(
				`models/${name}.glb`,
				function (gltf) {
					model = gltf.scene;
					mixer = new THREE.AnimationMixer(model);

					for (const anim of gltf.animations) mixer.clipAction(anim).play();

					scene.add(model);
					// bulbGltf.rotation.z += 0.25;
					model.rotation.x = initP.rot?.x || 0;
					model.rotation.y = initP.rot?.y || 0; // 1.8
					model.rotation.z = initP.rot?.z || 0;
				},
				undefined,
				function (error) {
					console.error(error);
				}
			);
		};

		const render = () => {
			renderer.clear();
			renderer.render(scene, camera);
		};

		let pT = 0;
		let delta = 0;
		const animate = () => {
			requestAnimationFrame(animate);
			let cT = performance.now();
			delta = cT - pT;

			if (mixer) mixer.update(speed / delta);
			if (model) {
				model.rotation.x += updateP.rot?.x || 0;
				model.rotation.y += updateP.rot?.y || 0; // 0.005
				model.rotation.z += updateP.rot?.z || 0;
			}

			pT = cT;
			render();
		};

		init();
		animate();
	}
</script>

<div class="icon3d" bind:this={elt} />

<style lang="scss">
	.icon3d {
		// display: flex;
		// justify-content: center;
		// align-items: center;
		filter: drop-shadow(24px 12px 7px #00000025);
	}
</style>
