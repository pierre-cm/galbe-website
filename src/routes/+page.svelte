<script lang="ts">
	import { Prompteur } from 'prompteur';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import Icon from '$lib/components/Icon.svelte';
	import Icon3D from '$lib/components/Icon3D.svelte';
	import Code from '$lib/components/Code.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Meta from '$lib/components/Meta.svelte';

	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('ts', typescript);

	const text = `<span class="dollar">$</span>bun create galbe app\n<span class="dollar">$</span>cd app\n<span class="dollar">$</span>bun install && bun dev`;
	const simplePre =
		`import { Galbe } from 'galbe'\n\n` +
		`const galbe = new Galbe()\n` +
		`galbe.get('/hello', () => 'Hello Mom!')\n\n` +
		`export default galbe`;

	let elt: Element | undefined = $state();
	let prevTextRunning = $state(false);

	let prompteur: Prompteur;

	const scrollPreview = () => {
		if (elt && prompteur?.state === 'stopped' && window.scrollY === 0) prompteur.start();
	};

	$effect(() => {
		prompteur = new Prompteur({
			text: text,
			speed: 50,
			elt: elt as Element,
			render: 'html'
		});
		prompteur.on('start', () => (prevTextRunning = true));
		prompteur.on('stop', () => (prevTextRunning = false));
		prompteur.start();
	});
</script>

<Meta
	title="Galbe - Versatile Javascript web framework"
	description="Galbe is a versatile JavaScript web framework built on Bun. Create fast, scalable, and adaptable backend servers effortlessly with Galbe's robust features and intuitive API."
/>

<svelte:window on:scroll={scrollPreview} />

<div class="main">
	<div class="hero">
		<div class="description">
			<div class="header">
				<Icon name="logo" width="10rem" height="10rem" />
				<h1>Galbe</h1>
			</div>
			<h2>Versatile by design, simple by default.</h2>
			<p>
				Galbe is a fast, lightweight and highly customizable JavaScript web framework based on
				<a href="https://bun.sh" target="_blank" rel="noopener noreferrer">Bun</a>.
			</p>
			<div class="buttons">
				<a class="button fancy" href="/documentation/getting-started" title="Get Started">
					Get started
				</a>
				<a
					class="button bordered"
					target="_blank"
					href="https://github.com/pierre-cm/galbe"
					title="Github"
				>
					Github
				</a>
			</div>
		</div>
		<div class="preview">
			<div class="terminal">
				<div class="statusbar">
					<div class="red dot" />
					<div class="yellow dot" />
					<div class="green dot" />
				</div>
				<div class="frame">
					<pre bind:this={elt}></pre>
					<div class="buttons" class:hidden={prevTextRunning}>
						<div class="copyBtn"><CopyButton text="bun create galbe app" /></div>
						<div class="copyBtn"><CopyButton text="cd app" /></div>
						<div class="copyBtn"><CopyButton text="bun install && bun dev" /></div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="whychoose"><span>Speedup your API development ! 💫</span></div>
	<div class="features">
		<div class="feature-item">
			<Icon3D
				name="bulb"
				cameraP={{ pos: { z: 4.5 } }}
				initP={{ rot: { z: 0.4 } }}
				updateP={{ rot: { y: 0.01 } }}
			/>
			<div class="feature-description">
				<h2>Simple</h2>
				<Code content={simplePre} lang="js" copiable />
			</div>
		</div>
		<div class="feature-item stag">
			<Icon3D
				name="chameleon"
				speed={1 / 2}
				cameraP={{ pos: { z: 3.7 } }}
				initP={{ rot: { y: 1.8 } }}
				updateP={{ rot: { y: 0.005 } }}
			/>
			<div class="feature-description">
				<h2>Versatile</h2>
				<p>
					A clear, concise, and feature-rich API that is easy to use and highly configurable. Every
					feature is optional and can be easily customized to meet your specific needs.
				</p>
				<p>Structure your API project in a way that works best for you and your team.</p>
			</div>
		</div>
		<div class="feature-item">
			<Icon3D
				name="rocket"
				speed={1 / 8}
				cameraP={{ pos: { z: 3 } }}
				initP={{ rot: { z: -0.4 } }}
			/>
			<div class="feature-description">
				<h2>Fast</h2>
				<div class="benchmark">
					<div>
						<div class="label">Galbe</div>
						<Icon name="bun" />
						<ProgressBar value={86981} max={86981} variant="fancy" title="86981 req/s" />
					</div>
					<div>
						<div class="label">Fastify</div>
						<Icon name="bun" />
						<ProgressBar value={73370} max={86981} variant="pale" title="73370 req/s" />
					</div>
					<div>
						<div class="label">Oak</div>
						<Icon name="deno" />
						<ProgressBar value={37274} max={86981} variant="pale" title="37274 req/s" />
					</div>
					<div>
						<div class="label">Express</div>
						<Icon name="node" />
						<ProgressBar value={16868} max={86981} variant="pale" title="16868 req/s" />
					</div>
				</div>
			</div>
		</div>
		<div class="feature-item stag">
			<Icon3D
				name="ts"
				speed={1 / 10}
				cameraP={{ pos: { z: 2 } }}
				initP={{ rot: { y: 4.25 } }}
				updateP={{ rot: { y: 0.01 } }}
			/>
			<div class="feature-description">
				<h2>Type safe</h2>
				<p>
					Take advantage of TypeScript's static type inference to ensure type safety and catch
					errors early in the development process.
				</p>
				<p>
					Use schema type definitions for fast and automatic request parsing and validation,
					ensuring that your API always receives valid data.
				</p>
			</div>
		</div>
		<div class="feature-item">
			<Icon3D
				name="puzzle"
				speed={1 / 5}
				cameraP={{ pos: { z: 6 } }}
				initP={{ rot: { y: 1.8 } }}
				updateP={{ rot: { y: 0.0 } }}
			/>
			<div class="feature-description">
				<h2>Extensible</h2>
				<p>
					Extend the features and capabilities of Galbe by choosing from our
					<a href="plugins">plugin list</a>.
				</p>
				<p>
					Can't find what you're looking for? No problem - you can easily <a href="plugins"
						>create your own plugin</a
					> to meet your specific needs.
				</p>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5rem;
		padding-bottom: 2rem;
		.hero {
			display: flex;
			padding-top: 3rem;
			gap: 1rem;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			.description {
				padding: 0rem 1rem 0rem 1rem;
				.header {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 1rem;
					h1 {
						margin: 0;
						font-size: 3rem;
					}
				}
				h2 {
					font-weight: 500;
					font-size: 1.75rem;
				}
				p {
					font-size: 1.25rem;
				}
				.buttons {
					display: flex;
					justify-content: flex-start;
					gap: 0.5rem;
					a.button {
						text-decoration: none;
						&.primary:hover {
							text-decoration: none;
							background-color: var(--primary-dark);
						}
						&.bordered:hover {
							text-decoration: none;
							color: var(--text);
						}
					}
				}
			}
			.preview {
				.terminal {
					padding-top: 1rem;
					animation: float 5s ease-in-out infinite;
					display: flex;
					flex-direction: column;
					min-width: min(24rem, calc(100vw - 1rem));
					max-width: calc(100vw - 1rem);
					margin-left: -2rem;
					.statusbar {
						display: inline-flex;
						align-items: center;
						gap: 0.5rem;
						padding: 0 0.8rem 0 0.8rem;
						background-color: var(--border);
						border-top-left-radius: 1rem;
						border-top-right-radius: 1rem;
						height: 1.5rem;
						.dot {
							width: 0.8rem;
							height: 0.8rem;
							border-radius: 50%;
							&.red {
								background-color: var(--danger);
							}
							&.yellow {
								background-color: var(--warning);
							}
							&.green {
								background-color: var(--success);
							}
						}
					}
					.frame {
						height: 6rem;
						background-color: var(--background-v2);
						color: var(--text);
						border-bottom-left-radius: 1rem;
						border-bottom-right-radius: 1rem;
						padding: 1rem;
						overflow: hidden;
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 0.5rem;
						&:hover .buttons {
							display: block;
						}
						pre {
							align-self: flex-start;
							margin: 0;
							filter: drop-shadow(6px 1px 1px #00000025);
							font-size: 1.25rem;
							line-height: 2rem;
						}
						.buttons {
							display: none;
							color: var(--text-v1);
							.copyBtn:hover {
								color: var(--text);
							}
							&.hidden {
								opacity: 0;
							}
						}
					}
				}
			}
		}
		.whychoose {
			display: flex;
			justify-content: center;
			width: 60rem;
			max-width: calc(100vw - 4rem);
			border-bottom: 2px solid var(--border);
			& > span {
				background-color: var(--background);
				padding: 0 1.5rem 0 1.5rem;
				margin-bottom: -0.5rem;
			}
		}
		.features {
			display: flex;
			flex-wrap: wrap;
			max-width: 60rem;
			justify-content: center;
			gap: 1rem;
			.feature-item {
				display: flex;
				justify-content: center;
				align-items: center;
				max-width: 37rem;
				min-width: 0;
				gap: 1rem;
				.feature-description {
					min-width: 0;
					max-width: calc(100vw - 100px - 4rem);
				}
			}
		}
		.benchmark {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			width: min(24rem, calc(100vw - 100px - 4rem));
			& > div {
				display: inline-flex;
				align-items: center;
				gap: 0.5rem;
			}
			.label {
				min-width: 6ch;
			}
		}
		@keyframes float {
			0% {
				filter: drop-shadow(1rem 0.5rem 0.75rem #00000025);
				transform: translate(0, 0px) perspective(100em) rotateY(-20deg);
			}
			50% {
				filter: drop-shadow(0rem 0.5rem 0.5rem #00000040);
				transform: translate(1rem, -1rem) perspective(100em) rotateY(-20deg);
			}
			100% {
				filter: drop-shadow(1rem 0.5rem 0.75rem #00000025);
				transform: translate(0, 0px) perspective(100em) rotateY(-20deg);
			}
		}
	}
	:global(.dollar) {
		user-select: none;
		margin-right: 0.8rem;
	}

	@media (min-width: 1024px) {
		.hero {
			padding-top: 10rem;
			.description {
				max-width: 30rem;
			}
			.preview {
				.terminal {
					min-width: 25.5rem !important;
				}
			}
		}
		.features {
			justify-content: flex-start !important;
			.feature-item {
				max-width: 60rem !important;
				&.stag {
					padding-left: 20rem;
				}
			}
		}
	}
</style>
