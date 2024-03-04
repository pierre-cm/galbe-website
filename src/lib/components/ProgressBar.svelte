<script lang="ts">
	const {
		value,
		max,
		title,
		variant = 'primary'
	} = $props<{ value: number; max: number; title?: string; variant?: string }>();
</script>

<div class="progress-bg" {title}>
	<div class={`progress-value ${variant}`} style:width={`${(value / max) * 100}%`}></div>
</div>

<style lang="scss">
	.progress-bg {
		display: flex;
		height: 0.5rem;
		border-radius: 0.5rem;
		width: 100%;
		background-color: var(--background-v1);
		.progress-value {
			border-radius: 0.5rem;
			height: 100%;
			&.fancy {
				background: var(--fancy-primary-bg);
			}
			&.primary {
				background-color: var(--primary);
			}
			&.pale {
				background-color: var(--grey);
			}
		}
	}
</style>
