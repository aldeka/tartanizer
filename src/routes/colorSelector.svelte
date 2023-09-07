<script lang="ts">
	export let used: boolean = false;
	export let code: string;
	export let label: string;
	export let options: string[];
	export let activeIndex: number;
	export let setPaletteColor: (colorCode: string, index: number) => void;

	function getNewPaletteColor(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			setPaletteColor(code, parseInt(target.value, 10));
		}
	}
</script>

<div class={used ? 'color-picker used' : 'color-picker unused'}>
	<div class="color-label" title={label}>{code}</div>
	<div class="options">
		{#each options as color, i}
			<label
				for={color}
				class:disabled={options.length < 2}
				class:active={color === options[activeIndex]}
				style={`background: #${color};`}
				title={`#${color}`}
			>
				<input
					type="radio"
					id={color}
					value={i}
					name={`${code}-hue`}
					checked={color === options[activeIndex]}
					on:change={getNewPaletteColor}
					disabled={options.length < 2}
				/>
			</label>
		{/each}
	</div>
</div>

<style>
	.color-picker {
		padding: 0.5rem 1rem 0 1rem;
		font-size: 12px;
		display: flex;

		&.used {
			color: #000;
			font-weight: 700;
			background-color: #eef;
		}

		&.unused {
			color: #667;
		}
	}

	.color-label {
		display: block;
		font-size: 24px;
		line-height: 24px;
		min-width: 1.2em;
		max-width: 1.2em;
	}

	.options {
		display: flex;
		margin-left: 1.25rem;
		flex-wrap: wrap;

		& label {
			margin: 0 0.25em 0.5em 0;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 2.75em;
			width: 4em;
			border: 1pt solid black;

			&.active {
				box-shadow: 0px 0px 0px 2px rgb(10, 90, 255);
			}

			&:not(.disabled) {
				cursor: pointer;

				&:hover:not(.active) {
					box-shadow: 0px 0px 0px 2px #bbb;
				}

				& input {
					cursor: pointer;
				}
			}

			& input {
				margin: 0;
			}
		}
	}
</style>
