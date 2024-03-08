<script lang="ts">
	import { page } from '$app/stores';

	const {
		title = 'Galbe',
		description = "Galbe is a versatile JavaScript web framework built on Bun. Create fast, scalable, and adaptable backend servers effortlessly with Galbe's robust features and intuitive API.",
		image = 'http://galbe.dev/galbe-title.png'
	} = $props<{ title?: string; description?: string; image?: string }>();

	$effect(() => {
		console.log(title, description);
	});

	const href = $derived(`https://galbe.dev${$page.url.pathname}`);
</script>

<svelte:head>
	<meta property="og:url" content={href} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:type" content="website" />

	{#if title}
		<title>{title}</title>
		<meta itemprop="name" content={title} />
		<meta property="og:title" content={title} />
		<meta name="twitter:title" content={title} />
	{/if}

	{#if description}
		<meta name="description" content={description} />
		<meta itemprop="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}

	{#if image}
		<meta itemprop="image" content={image} />
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
	{/if}
</svelte:head>
