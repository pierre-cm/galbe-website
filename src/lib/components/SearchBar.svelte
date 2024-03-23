<script lang="ts">
	import wordIndexJson from '$lib/wordIndex.json?raw';
	import content from '$lib/content';
	import Icon from './Icon.svelte';
	import { goto } from '$app/navigation';
	import { marked } from 'marked';

	type SearchRecord = Record<string, { start: number; end: number }[]>;

	const MATCH_WINDOW = 28;
	const META_RGX = /^---\n(.*)\n---/s;

	const textContent: Record<string, string> = {};

	(async () => {
		for (let c of Object.entries(content)) {
			textContent[c[0]] = (await marked.parse(c[1].replace(META_RGX, ''))).replace(
				/<[^>]*>?/gm,
				''
			);
		}
	})();
	const wordIndex: Record<string, SearchRecord> = JSON.parse(wordIndexJson);

	let isOpen = $state(false);
	let results = $state<[string, { start: number; end: number }[]][]>([]);
	let searchInput = $state<HTMLElement>();

	const open = () => {
		isOpen = true;
		setTimeout(() => {
			if (searchInput) {
				searchInput.focus();
			}
		}, 0);
	};
	const search = (req?: string) => {
		if (!req) {
			results = [];
			return;
		}
		let words = req
			.replace(/[\s_\-\/\.:,;?*"'`(){}<>\[\]@&=!#]/, ' ')
			.trim()
			.split(' ');

		let acc: Record<string, SearchRecord> = {};

		Object.entries(wordIndex).forEach(([w, v]) => {
			for (let kw of words) {
				let match = w.match(new RegExp(`.*(${kw.toLocaleLowerCase()}).*`));
				if (match) {
					for (let [f, occs] of Object.entries(v)) {
						if (!acc?.[kw]) acc[kw] = {};
						if (!acc?.[kw]?.[f]) {
							acc[kw][f] = [];
						}
						acc[kw][f].push(...occs);
					}
				}
			}
		});
		let intersection = Object.entries(acc).reduce((entries: any, current: any) => {
			if (Object.keys(entries).length === 0) {
				return current[1];
			} else {
				let inter = {};
				for (let [eK, eV] of Object.entries(current[1])) {
					if (eK in entries) {
						//@ts-ignore
						inter[eK] = [...entries[eK], ...eV];
					}
				}
				return inter;
			}
		}, {});

		results = Object.entries(intersection);
	};
	const exit = () => {
		results = [];
		isOpen = false;
	};
	const goToDoc = (file: string) => {
		goto(`/documentation/${file}`);
		exit();
	};
	const matchedPart = (file: string, m: { start: number; end: number }) => {
		let c = textContent[file];
		return `${c.substring(m.start - MATCH_WINDOW, m.start)}<span style='color:var(--primary)'>${c.substring(
			m.start,
			m.end
		)}</span>${c.substring(m.end, m.end + MATCH_WINDOW)}`;
	};
	const shortcut = (e: KeyboardEvent) => {
		if (e.ctrlKey && e.key === 'k') {
			e.preventDefault();
			if (isOpen) exit();
			else open();
		}
	};
</script>

<svelte:window on:keydown={shortcut} />

<button class="search" on:click={open}>
	<Icon name="magnifier" width="1.25rem" height="1.25rem" />
	Search
	<div class="shortcut">Ctrl K</div>
</button>
{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="result-background" on:click={exit}>
		<div class="result" on:click={(e) => e.stopPropagation()}>
			<div class="inputs">
				<input
					bind:this={searchInput}
					type="text"
					placeholder="Search in the doc"
					on:input={(e) => search((e?.target as HTMLInputElement)?.value)}
				/>
				<button class="close" on:click={exit}><Icon name="cross" /></button>
			</div>

			<div class="suggestions">
				{#if results?.length}
					{#each results as [file, matches]}
						<div class="match" on:click={() => goToDoc(file)}>
							<div class="matchedFile">
								{file[0].toUpperCase() + file.replace(/-/, ' ').slice(1)}
							</div>
							{#each matches.length > 3 ? matches.slice(0, 3) : matches as m}
								<span class="matchedPart">{@html matchedPart(file, m)}</span>
							{/each}
							{#if matches.length > 3}
								<div>+ {matches.length - 3} more result{matches.length - 3 === 1 ? '' : 's'}</div>
							{/if}
						</div>
					{/each}
				{:else}
					<span class="noMatch">No result</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.search {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5rem;
		height: 2rem;
		padding: 0.5rem 1rem 0.5rem 0.5rem;
		background-color: var(--background-v1);
		border: 1px solid var(--border-v1);
		color: var(--text);
		border-radius: 1rem;
		&:hover {
			cursor: pointer;
			border-color: var(--primary);
			background-color: var(--background);
		}
		.shortcut {
			padding: 0.2rem;
			line-height: 0.8rem;
			font-size: 0.8rem;
			border: 1px solid var(--border-v1);
			background-color: var(--background-v1);
			border-radius: 0.2rem;
		}
	}
	.result-background {
		z-index: 10;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #0008;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		padding-top: 4rem;
		.result {
			width: min(35rem, calc(100vw - 4rem));
			height: fit-content;
			max-height: calc(100vh - 8rem);
			left: 50%;
			top: 5rem;
			background-color: var(--background);
			padding: 1rem;
			border-radius: 1rem;
			border: 1px solid var(--border-v1);
			display: flex;
			flex-direction: column;
			gap: 1rem;
			.inputs {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 0.5rem;
				input {
					flex-grow: 1;
					border: 1px solid var(--border-v1);
					border-radius: 0.5rem;
					padding: 0.5rem;
					height: 1rem;
					font-size: 1.1rem;
					color: var(--color);
					background-color: var(--background);
					outline: none;
					&:hover {
						border-color: var(--primary);
						background-color: var(--background);
					}
					&:focus-visible {
						border: 1px solid var(--text);
					}
				}
				.close {
					border: none;
					background-color: transparent;
					color: var(--text-v1);
					padding: 0;
					width: 2rem;
					height: 2rem;
					&:hover {
						cursor: pointer;
						color: var(--text);
					}
				}
			}

			.suggestions {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				padding-right: 1rem;
				overflow-y: auto;
				color: var(--text-v1);
				.match {
					display: flex;
					flex-direction: column;
					gap: 0.25rem;
					border: 1px solid var(--border);
					border-radius: 0.25rem;
					padding: 0.5rem 1rem 0.5rem 1rem;
					background-color: var(--background-v1);
					&:hover {
						text-decoration: none;
						color: var(--text);
						cursor: pointer;
						border: 1px solid var(--primary);
						background-color: var(--background);
					}
					.matchedFile {
						font-weight: 600;
						color: var(--text);
					}
					.matchedPart {
						display: inline-block;
						font-family: FiraCode;
						color: #bcbcbc;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				.noMatch {
					align-self: center;
				}
			}
		}
	}
</style>
