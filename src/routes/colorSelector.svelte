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

<div>
	<label class={used ? 'used' : 'unused'}
		>{label} ({code}):
		<div
			class="color-preview"
			style={`
        background-color: #${options[activeIndex]}
      `}
		/>
		<select value={activeIndex} on:change={getNewPaletteColor} disabled={options.length < 2}>
			{#each options as color, i}
				<option value={i}>
					#{color}
				</option>
			{/each}
		</select>
	</label>
</div>

<style>
	label.unused {
		color: #888;
	}

	label.used {
		color: #000;
		font-weight: 700;
	}

	label {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	select {
		width: 6em;
		font-family: monospace;
	}

	.color-preview {
		height: 1em;
		width: 1em;
	}
</style>
