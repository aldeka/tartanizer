<script lang="ts">
	export let url: string;

	import { copy } from 'svelte-copy';

	let notifEl: HTMLSpanElement;
	let justCopied: boolean = false;
	let openNotif: boolean = false;
	let copyTimeout: number;
	let openTimeout: number;

	function onClick(e: Event) {
		if (e.target !== notifEl) {
			justCopied = true;
			openNotif = true;
			if (copyTimeout) {
				clearTimeout(copyTimeout);
			}
			if (openTimeout) {
				clearTimeout(openTimeout);
			}
			openTimeout = setTimeout(() => {
				openNotif = false;
			}, 2000);
			copyTimeout = setTimeout(() => {
				justCopied = false;
			}, 2500);
		}
	}

	$: {
		// when url changes;
		openNotif = false;
	}
</script>

<button use:copy={url} title="copy link to pattern" on:click={onClick}>
	<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
		<path
			d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"
		/>
		<path
			d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"
		/>
	</svg>
	<span bind:this={notifEl} class:show={justCopied} class:open={openNotif}>✨link copied!✨</span>
</button>

<style>
	button {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 3rem;
		padding: 1rem 0.5rem;
		border: none;
		background: none;
		cursor: pointer;

		& svg {
			fill: #55555f;
			width: 100%;
		}

		&:hover svg {
			fill: blue;
		}
	}

	span {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, 0);
		width: max-content;
		color: white;
		background: blue;
		border: 3px solid blue;
		border-radius: 0.25rem;
		padding: 0.125rem;
		opacity: 0;
		transition: opacity 0.33s ease-out, transform 0.25s;

		&.show {
			opacity: 1;
			transform: translate(-50%, -1rem);
		}

		&:not(.open) {
			opacity: 0;
			transition: opacity 0.5s ease-out;
		}
	}
</style>
