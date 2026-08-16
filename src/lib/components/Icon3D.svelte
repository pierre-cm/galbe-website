<script lang="ts">
	import type * as ThreeTypes from 'three';
	import { onMount } from 'svelte';
	import { addFrame, type Frame } from '$lib/render-loop';

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

	const SIZE = 120;

	let elt: HTMLDivElement | undefined = $state();
	let {
		name,
		speed = 1,
		cameraP = DEFAULT_PARAM,
		initP = DEFAULT_PARAM,
		updateP = DEFAULT_PARAM
	}: Props = $props();

	onMount(() => {
		let destroyed = false;
		let visible = false;
		let booting = false;
		let frame: Frame | undefined;
		let unregister: (() => void) | undefined;
		let renderer: ThreeTypes.WebGLRenderer | undefined;
		let scene: ThreeTypes.Scene | undefined;

		// Only draw while the icon is on screen; the shared loop handles tab visibility.
		const sync = () => {
			if (destroyed) return;
			if (visible && frame && !unregister) unregister = addFrame(frame);
			else if ((!visible || !frame) && unregister) {
				unregister();
				unregister = undefined;
			}
		};

		// three.js is a large dependency, so it is fetched only once an icon is
		// about to become visible rather than upfront with the rest of the page.
		const boot = async () => {
			const [THREE, { GLTFLoader }] = await Promise.all([
				import('three'),
				import('three/addons/loaders/GLTFLoader.js')
			]);
			if (destroyed) return;

			scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
			renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			renderer.setSize(SIZE, SIZE);
			elt?.appendChild(renderer.domElement);

			scene.add(new THREE.AmbientLight(0xffffff, 3.0));
			scene.add(new THREE.DirectionalLight(0xffffff, 3));

			camera.position.z = 8;
			camera.position.x = cameraP.pos?.x || 0;
			camera.position.y = cameraP.pos?.y || 0;
			camera.position.z = cameraP.pos?.z || 0;

			let mixer: ThreeTypes.AnimationMixer | undefined;
			let model: ThreeTypes.Group | undefined;

			new GLTFLoader().load(
				`models/${name}.glb`,
				(gltf) => {
					if (destroyed) return;
					model = gltf.scene;
					mixer = new THREE.AnimationMixer(model);

					for (const anim of gltf.animations) mixer.clipAction(anim).play();

					scene?.add(model);
					model.rotation.x = initP.rot?.x || 0;
					model.rotation.y = initP.rot?.y || 0;
					model.rotation.z = initP.rot?.z || 0;
				},
				undefined,
				(error) => console.error(error)
			);

			frame = (delta) => {
				if (mixer) mixer.update(speed / delta);
				if (model) {
					model.rotation.x += updateP.rot?.x || 0;
					model.rotation.y += updateP.rot?.y || 0;
					model.rotation.z += updateP.rot?.z || 0;
				}
				if (renderer && scene) {
					renderer.clear();
					renderer.render(scene, camera);
				}
			};
			sync();
		};

		const observer = new IntersectionObserver(
			(entries) => {
				visible = entries.some((e) => e.isIntersecting);
				if (visible && !booting) {
					booting = true;
					boot();
				}
				sync();
			},
			{ rootMargin: '200px' }
		);
		if (elt) observer.observe(elt);

		return () => {
			destroyed = true;
			observer.disconnect();
			unregister?.();
			unregister = undefined;

			// Without this the WebGL context and its buffers survive client-side
			// navigation, and the browser starts dropping the oldest contexts.
			scene?.traverse((obj) => {
				const mesh = obj as Partial<ThreeTypes.Mesh>;
				mesh.geometry?.dispose();
				const material = mesh.material;
				if (Array.isArray(material)) material.forEach((m) => m.dispose());
				else material?.dispose();
			});
			renderer?.dispose();
			renderer?.forceContextLoss();
			renderer?.domElement.remove();
			renderer = undefined;
			scene = undefined;
		};
	});
</script>

<div class="icon3d" bind:this={elt}></div>

<style lang="scss">
	.icon3d {
		// Reserved upfront so lazily-created canvases do not shift the layout.
		width: 120px;
		height: 120px;
		filter: drop-shadow(24px 12px 7px #00000025);
	}
</style>
