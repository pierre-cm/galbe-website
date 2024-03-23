<script setup>
	import '../app.css';
	import Icon from '$lib/components/Icon.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let innerWidth = $state();
	let menuOpen = $state(false);
	const triggerMenu = () => (menuOpen = !menuOpen);

	$effect(() => {
		menuOpen = innerWidth > 1024;
	});

	let { data } = $props();
</script>

<svelte:head>
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Galbe",
		"alternateName": "Galbe",
		"url": "https://galbe.dev"
	}
	</script>
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Galbe",
		"url": "https://galbe.dev",
		"logo": "https://galve.dev/logo.png",
		"alternateName": "Galbe",

		"description": "A fast and versatile JavaScript web framework"
	}
	</script>
</svelte:head>

<svelte:window bind:innerWidth />

<div id="app">
	<header>
		<div class="logo">
			<a href="/"><img src="/galbe.svg" alt="logo" /></a>
		</div>
		<div class="title"><a href="/">Galbe</a></div>
		<SearchBar />
		<div class="menu" class:open={menuOpen}>
			<button class="burger" on:click={triggerMenu}>
				<Icon name={menuOpen ? 'cross' : 'burger'} />
			</button>
			<nav>
				<a href="/documentation/getting-started" class:active={data.rootSlug === `documentation`}>
					Documentation
				</a>
				<a href="/plugins" class:active={data.rootSlug === `plugins`}>Plugins</a>
			</nav>
			<ThemeSwitch width="1.75rem" height="1.75rem" />
			<div class="social">
				<a href="https://github.com/pierre-cm/galbe" target="_blank" rel="noopener noreferrer">
					<Icon name="github" />
				</a>
			</div>
		</div>
	</header>
	<main>
		<div>
			<slot />
		</div>
	</main>
</div>

<style lang="scss">
	#app {
		display: flex;
		flex-direction: column;
	}
	header {
		position: fixed;
		flex-wrap: wrap;
		z-index: 10;
		padding: 0.5rem 1rem 0.5rem 1rem;
		display: flex;
		gap: 0rem;
		align-items: center;
		width: calc(100% - 2rem);
		background-color: var(--background-transparent);
		backdrop-filter: blur(4px);
		.logo {
			margin-right: 1rem;
			img {
				width: 2.5rem;
				height: 2.5rem;
			}
		}
		.title a {
			padding-right: 1rem;
			text-decoration: none;
			color: var(--text);
			font-size: 1.5rem;
			font-weight: 500;
		}
		.burger {
			position: absolute;
			top: 1rem;
			right: 1rem;
			display: flex;
			background: transparent;
			border: none;
			color: var(--text);
			&:hover {
				cursor: pointer;
			}
		}
		.menu {
			display: flex;
			width: 100%;
			flex-direction: column;
			overflow: hidden;
			align-items: center;
			justify-content: flex-end;
			gap: 2rem;
			flex-grow: 1;
			&:not(.open) {
				max-height: 0;
			}
			nav {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 1rem;
				a {
					text-decoration: none;
					color: var(--text);
					&:hover:not(.active) {
						color: var(--primary);
					}
					&.active {
						border-bottom: 1px solid var(--text);
					}
				}
			}
			.social {
				display: flex;
				gap: 0.5rem;
				a {
					color: var(--text);
					width: 1.75rem;
					height: 1.75rem;
					&:hover {
						color: var(--primary);
					}
				}
			}
		}
	}
	main {
		margin-top: 4rem;
		min-height: calc(100vh - 5rem);
		display: flex;
		flex-direction: column;
	}
	@media (min-width: 1024px) {
		header {
			flex-direction: row;
			gap: 1rem;
			.logo {
				margin-right: 0rem;
			}
			.title a {
				padding-right: 0rem;
			}
			.menu {
				width: fit-content;
				flex-direction: row;
				nav {
					flex-direction: row;
				}
				.burger {
					display: none;
				}
			}
		}
		main {
			padding-bottom: 0;
		}
	}
</style>
