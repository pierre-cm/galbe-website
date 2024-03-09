<script lang="ts">
	import Lifecycle from '$lib/assets/lifecycle.svg.svelte';
</script>

<div>
	<h1>Lifecycle</h1>
	<p>
		This section presents the lifecycle of an incoming request. It outlines the sequential steps
		involved, from when a client initiates a request to when the framework delivers the response.
		Understanding this lifecycle is essential for effectively building a Galbe application.
	</p>
	<h2>Request Flowchart</h2>
	<p>
		Clicking on any element of the following chart will redirect you to the corresponding section of
		the documentation, providing a more detailed explanation of each stage in the lifecycle.
	</p>
	<Lifecycle />
</div>

<style>
	h1,
	h2 {
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}
</style>
