<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	// import md from '$lib/assets/imported/home.md?raw';
</script>

<svelte:head>
	<title>Galbe | Plugins</title>
</svelte:head>

<div class="page">
	<h1>Plugins</h1>
	<div class="content">
		<!-- <Markdown input={md} /> -->
	</div>
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0rem 2rem 0rem 2rem;
	}
	.content {
		display: flex;
		flex-direction: column;
		max-width: 60rem;
	}
</style>
