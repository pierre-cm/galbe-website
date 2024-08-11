<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import Markdown from '$lib/components/Markdown.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import plugins_json from '$lib/contents/plugins.json';
	import yaml from 'js-yaml';

	const META_RGX = /^---\n(.*)\n---/s;

	let plugins = $state(plugins_json);
	let mdPage: string = $state('');
	let currentPage = $state('');
	let content = $state('');
	let meta: Record<string, any> = $state({});

	$effect(() => {
		const url = $page.url;
		const loc = url.pathname.replace(/^\/plugins\/?/, '') || '';
		if (loc !== currentPage) currentPage = loc;
	});

	$effect(() => {
		if (!(currentPage in plugins)) {
			currentPage = '';
			content = '';
			meta = {};
			mdPage = '';
		}
		//@ts-ignore
		let c = plugins[currentPage]?.readme || '';
		content = c;

		let mdMetaMatch = content.match(META_RGX);
		meta = mdMetaMatch ? (yaml.load(mdMetaMatch[1]) as Record<string, any>) : {};
		mdPage = content.replace(META_RGX, '');
	});
</script>

<Meta
	title="Plugins | Galbe"
	description="Enhance your web development experience and unlock new features by exploring Galbe plugins collection. Improve productivity and create versatile applications with ease."
/>

<div class="page">
	{#if mdPage?.trim()}
		<div class="content">
			<Markdown input={mdPage} />
			<div class="action">
				<a href="/plugins">
					<Icon name="arrow" width="3rem" height="3rem" />
				</a>
			</div>
		</div>
	{:else}
		<h1>Plugins</h1>
		<div class="plugins">
			{#each Object.entries(plugins) as [pluginId, plugin]}
				<div class="plugin">
					<a class="content" href="/plugins/{pluginId}">
						<div class="header">
							<span class="title">{plugin.name}</span>
						</div>
						<p>
							{plugin.description}
						</p>
					</a>
					<div class="footer">
						<div class="social">
							{#if plugin.github}
								<a href={plugin.github} target="_blank" rel="noopener noreferrer">
									<Icon name="github" />
								</a>
							{/if}
							{#if plugin.npm}
								<a href={plugin.npm} target="_blank" rel="noopener noreferrer">
									<Icon name="npm" />
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<div>
		Want to propose a new plugin? Follow <a href="/documentation/plugins#create-a-plugin"
			>these instructions</a
		>.
	</div>
	<slot />
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0rem 2rem 0rem 2rem;
		& > .content {
			min-width: 10rem;
			max-width: min(100vw, 55rem);
			padding: 0 1.5rem 2rem 1.5rem;
			display: flex;
			// gap: 1rem;
			.action {
				padding-top: 1.25rem;
				margin-left: -3rem;
				a {
					color: var(--text);
					&:hover {
						cursor: pointer;
						color: var(--text-v1);
					}
				}
			}
		}
	}

	.plugins {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 3rem;
		max-width: min(100vw, 55rem);
		.plugin {
			.content {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				color: var(--text);
				text-decoration: none;
				width: 15rem;
				height: 9rem;
				padding: 0.75rem 1rem 0.75rem 1rem;
				background-color: var(--background-v2);
				border: 1px solid var(--border);
				border-radius: 0.5rem;
				&:hover {
					border-color: var(--primary);
					cursor: pointer;
					.header .title {
						color: var(--primary);
					}
				}
				.header {
					display: flex;
					justify-content: space-between;
					span.title {
						display: flex;
						width: 100%;
						align-items: center;
						font-size: 1.5rem;
						font-weight: 600;
					}
					.logo {
						max-width: 64px;
						max-height: 64px;
						min-width: 64px;
						min-height: 64px;
						img {
							width: 100%;
							height: 100%;
						}
					}
				}
				p {
					margin: 0;
					max-height: 5rem;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					// white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
			.footer {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				margin-top: -3rem;
				padding-bottom: 3rem;
				padding-left: 1rem;
				width: fit-content;
				.social {
					a {
						color: var(--text);
						&:hover {
							color: var(--primary);
						}
					}
				}
			}
		}
	}
</style>
