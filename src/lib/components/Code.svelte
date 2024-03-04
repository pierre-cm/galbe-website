<script lang="ts">
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import json from 'highlight.js/lib/languages/json';
	import shell from 'highlight.js/lib/languages/shell';
	import bash from 'highlight.js/lib/languages/bash';
	import CopyButton from './CopyButton.svelte';

	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('typescript', typescript);
	hljs.registerLanguage('ts', typescript);
	hljs.registerLanguage('json', json);
	hljs.registerLanguage('shell', shell);
	hljs.registerLanguage('bash', bash);

	let { content = '', lang = '', copiable = true } = $props();
	let lineBylineCopy = lang === 'bash' || lang === 'shell';
	let highlightedContent = $derived(
		lang && hljs.getLanguage(lang) ? hljs?.highlight(content, { language: lang })?.value : content
	);
	let shellCommands = content.split('\n');
</script>

<div class="code">
	{#if lineBylineCopy}
		<div class="shell-pre">
			{#each shellCommands as line}
				<div class="line">
					{#if line.startsWith('#')}
						<pre>{@html hljs?.highlight(line, { language: lang })?.value}</pre>
					{:else}
						<pre class="command">{@html hljs?.highlight(line, { language: lang })?.value}</pre>
						<div class="copy"><CopyButton text={line} width="1.25rem" height="1.25rem" /></div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<pre>{@html highlightedContent}</pre>
		{#if copiable}
			<div class="copy"><CopyButton text={content} /></div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.code {
		position: relative;
		margin-top: 0.5rem;
		pre {
			margin: 0;
			tab-size: 2;
			background-color: var(--background-v2);
			color: var(--text);
			border-radius: 1rem;
			padding: 1rem;
			overflow: auto;
			min-width: 0px;
		}
		.copy {
			position: absolute;
			top: 0.75rem;
			right: 0.75rem;
			color: var(--text-v1);
			&:hover {
				color: var(--text);
			}
		}
		.shell-pre {
			.line {
				position: relative;
				display: flex;
				padding: 0rem 1rem 0rem 1rem;
				background-color: var(--background-v2);
				align-items: center;
				pre {
					padding: 0;
					border-radius: 0;
					flex-grow: 1;
					overflow: hidden;

					&.command {
						&::before {
							content: '$ ';
						}
					}
				}
				.copy {
					top: -0.25rem;
				}
			}
			.line:first-child {
				padding-top: 1rem;
				border-top-left-radius: 1rem;
				border-top-right-radius: 1rem;
				.copy {
					top: 0.75rem;
				}
			}
			.line:last-child {
				padding-bottom: 1rem;
				border-bottom-left-radius: 1rem;
				border-bottom-right-radius: 1rem;
			}
		}
	}
</style>
