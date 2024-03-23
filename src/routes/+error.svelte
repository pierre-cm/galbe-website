<div class="errorPage">
	<div class="message">
		<h1>404</h1>
		<p>Oops! The page you're looking for doesn't exist.</p>
	</div>
</div>

<style lang="scss">
	.errorPage {
		width: 100%;
		height: calc(100vh - 4rem);
		display: flex;
		justify-content: center;
		align-items: center;
		.message {
			display: flex;
			align-items: center;
			width: min(33rem, calc(100vw - 2rem));

			h1 {
				font-size: 3rem;
				font-weight: 400;
				width: fit-content;
				border-right: 1px solid var(--border-v1);
				padding: 0.5rem 1rem 0.5rem 1rem;
			}
			p {
				padding: 0.5rem 1rem 0.5rem 1rem;
			}
		}
	}
</style>
