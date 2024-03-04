<script lang="ts">
	import Icon from './Icon.svelte';

	let { text = '', width = '1.33rem', height = '1.33rem' } = $props();
	let icon = $state('copy');

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			icon = 'tick';
		} catch (e) {
			console.error(e);
			icon = 'cross';
		}
		setTimeout(() => {
			icon = 'copy';
		}, 1000);
	};
</script>

<button
	class="copy"
	class:green={icon === 'tick'}
	class:red={icon === 'cross'}
	on:click={copy}
	type="button"
	title="Copy"
>
	<Icon name={icon} {width} {height} />
</button>

<style lang="scss">
	.copy {
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.25rem;
		border-radius: 0.5rem;
		background-color: transparent;
		color: inherit;
		&.green {
			color: var(--success);
		}
		&.red {
			color: var(--danger);
		}
	}
</style>
