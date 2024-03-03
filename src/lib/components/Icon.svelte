<script lang="ts">
	import type { SvelteComponent } from 'svelte/legacy';
	import github from '$lib/assets/icons/github.svg.svelte';
	import logo from '$lib/assets/icons/logo.svg.svelte';
	import npm from '$lib/assets/icons/npm.svg.svelte';
	import play from '$lib/assets/icons/play.svg.svelte';
	import pause from '$lib/assets/icons/pause.svg.svelte';
	import copy from '$lib/assets/icons/copy.svg.svelte';
	import tick from '$lib/assets/icons/tick.svg.svelte';
	import burger from '$lib/assets/icons/burger.svg.svelte';
	import cross from '$lib/assets/icons/cross.svg.svelte';
	import node from '$lib/assets/icons/node.svg.svelte';
	import bun from '$lib/assets/icons/bun.svg.svelte';
	import deno from '$lib/assets/icons/deno.svg.svelte';

	const ICON_MAP: Record<string, any> = {
		default: logo,
		github: github,
		npm: npm,
		play: play,
		pause: pause,
		copy: copy,
		tick: tick,
		burger: burger,
		cross: cross,
		node: node,
		bun: bun,
		deno: deno
	};

	const {
		name,
		width = '1.75rem',
		height = '1.75rem'
	} = $props<{ name: string; width?: string; height?: string }>();

	let icon = $state<typeof SvelteComponent>();

	$effect(() => {
		icon = ICON_MAP[name in ICON_MAP ? name : 'default'];
	});
</script>

{#if icon}
	<svelte:component this={icon} {width} {height} />
{/if}

<style>
	:global(svg) {
		/* width: 1.75rem;
		height: 1.75rem; */
		pointer-events: none;
	}
</style>
