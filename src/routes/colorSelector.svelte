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

<div class:used class="color-picker" title={label}>
	<div class="color-label">{code}</div>
	<div class="options">
		{#each options as color, i}
			<label
				for={color}
				class:disabled={options.length < 2}
				class:active={color === options[activeIndex]}
				style={`background: #${color};${
					color === options[activeIndex] &&
					['LR', 'R', 'DR', 'O', 'DO', 'LY', 'Y', 'DY'].indexOf(code) !== -1 &&
					'box-shadow: 0px 0px 0px 3px blue'
				}`}
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
		margin: 0;
		padding: 0.75rem 1rem 0.25rem 1rem;
		font-size: 12px;
		display: flex;
		color: #667;

		&.used {
			color: #000;

			& .color-label {
				font-weight: 700;
			}
		}
	}

	.color-label {
		display: block;
		font-size: 24px;
		font-weight: 300;
		line-height: 24px;
		min-width: 1.4em;
		max-width: 1.4em;
	}

	.options {
		display: flex;
		margin-left: 1.25rem;
		flex-wrap: wrap;

		& label {
			margin: 0 0.5em 0.5em 0;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 2rem;
			width: 2.5rem;
			border: 1pt solid black;

			&.active {
				box-shadow: 0px 0px 0px 3px orange;
			}

			&:not(.disabled) {
				cursor: pointer;

				&:hover:not(.active) {
					box-shadow: 0px 0px 0px 3px #bbb;
				}
			}

			& input[type='radio'] {
				position: absolute;
				left: -9999px;
			}
		}
	}
</style>
