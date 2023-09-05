<script lang="ts">
	import TartanCanvas from './tartanCanvas.svelte';

	const paletteLabels: { [key: string]: string } = {
		LR: 'light red',
		R: 'red',
		DR: 'dark red',
		O: 'orange',
		DO: 'dark orange',
		LY: 'light yellow',
		Y: 'yellow',
		DY: 'dark yellow',
		LG: 'light green',
		G: 'green',
		DG: 'dark green',
		LB: 'light blue',
		B: 'blue',
		DB: 'dark blue',
		LP: 'light purple',
		P: 'purple',
		DP: 'dark purple',
		W: 'white',
		LN: 'light grey',
		N: 'grey',
		DN: 'dark grey',
		K: 'black',
		LT: 'light brown',
		T: 'brown',
		DT: 'dark brown'
	};

	const palette: { [key: string]: string[] } = {
		// Selected from among the many options at https://www.tartanregister.gov.uk/docs/Colour_shades.pdf
		// See paletteLabels for names
		LR: ['F4CCCC', 'E87878', 'F04DB0'],
		R: ['A00048', 'FA4B00', 'FF0000', 'DC0000', 'C80000', 'C82828', 'C8002C', 'B03000'],
		DR: ['A00000', '960000', '960000', '880000', '800028', '781C38', '4C0000', '901C38', '680028'],
		O: ['EC8048', 'E86000', 'FF5000', 'DC943C', 'D87C00'],
		DO: ['BE7832'],
		LY: ['F9F5C8', 'F8E38C'],
		Y: ['FFFF00', 'FFE600', 'FFD700', 'FCCC00', 'E0A126', 'E8C000', 'D8B000'],
		DY: ['BC8C00', 'C89800', 'C88C00'],
		LG: ['789484', 'C4BC68', '9C9C00', 'ACD74A', '86C67C', '649848'],
		G: [
			'008B00',
			'408060',
			'289C18',
			'006400',
			'007800',
			'3F5642',
			'767E52',
			'5C6428',
			'00643C',
			'146400',
			'006818',
			'004C00',
			'285800',
			'005020',
			'005448'
		],
		DG: ['003C14', '003820', '004028', '002814'],
		LB: ['BCC3D2', '98C8E8', '82CFFD', '00FCFC'],
		B: [
			'2C4084',
			'1870A4',
			'1474B4',
			'048888',
			'3C82AF',
			'5C8CA8',
			'2888C4',
			'48A4C0',
			'2474E8',
			'0596FA',
			'0000FF',
			'3850C8',
			'788CB4',
			'5F749C',
			'0000CD'
		],
		DB: [
			'055183',
			'003C64',
			'00008C',
			'2C2C80',
			'1C0070',
			'000064',
			'202060',
			'000048',
			'141E46',
			'1C1C50'
		],
		LP: ['A8ACE8', 'C49CD8', '806D84', '9C68A4'],
		P: ['9058D8', 'AA00FF', 'B458AC', '6C0070', '5A008C', '64008C', '780078'],
		DP: ['440044', '1E0948'],
		W: ['FFFFFF', 'E5DDD1', 'E8CCB8', 'F0E0C8', 'FCFCFC', 'F8F8F8'],
		LN: ['E0E0E0'],
		N: ['C8C8C8', 'C0C0C0', 'B0B0B0', 'A0A0A0', '808080', '888888', '646464'],
		DN: ['505050', '555A64', '1C1714', '14283C', '1C1C1C'],
		K: ['101010', '000000'],
		LT: ['A08858', '8C7038', 'A07C58', 'B07430'],
		T: ['98481C', '603800', '604000', '503C14'],
		DT: ['4C3428', '441800', '230D00']
	};

	function makeChunk(length: number, colorHex: string): string[] {
		const chunk = new Array(length).fill(colorHex);
		return chunk;
	}

	const validColorCodes: string[] = Object.keys(palette);

	const activePaletteIndices: { [key: string]: number } = {};
	for (const color of validColorCodes) {
		activePaletteIndices[color] = 0;
	}

	const colorRe = new RegExp(`(${validColorCodes.join('|')})(\\d+)`);
	function makeColor(c: string): [number, string] | undefined {
		const m = c.match(colorRe);
		if (m) {
			return [parseInt(m[2], 10), m[1]];
		}
	}

	function makeThreadList(colorsText: string, activePalette: { [key: string]: number }): string[] {
		const segments = colorsText.split(' ');
		let retval: string[] = [];
		for (const segment of segments) {
			const color = makeColor(segment);
			if (color !== undefined) {
				const [threadCount, colorCode] = color;
				retval = retval.concat(
					makeChunk(threadCount, palette[colorCode][activePalette[colorCode]])
				);
			}
		}
		return retval;
	}

	// Demo is the standard Black Watch pattern
	let colorString = 'B24 K4 B4 K4 B4 K20 G24 K6 G24 K20 B22 K4 B4';
	$: threadList = makeThreadList(colorString, activePaletteIndices);

	function setPaletteColor(e: Event, colorCode: string) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			activePaletteIndices[colorCode] = parseInt(target.value, 10);
		}
	}
</script>

<svelte:head>
	<title>Tartanizer</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Tartan simulator</h1>

	<label
		>pattern
		<input type="text" bind:value={colorString} />
	</label>

	<div id="main">
		<div id="palette">
			<h2>Palette</h2>
			{#each Object.keys(palette) as colorCode}
				<div>
					<label
						class={threadList.indexOf(palette[colorCode][activePaletteIndices[colorCode]]) !== -1
							? 'used'
							: 'unused'}
						>{paletteLabels[colorCode]} ({colorCode}):
						<div
							class="color-preview"
							style={`
								background-color: #${palette[colorCode][activePaletteIndices[colorCode]]}
							`}
						/>
						<select
							value={activePaletteIndices[colorCode]}
							on:change={(e) => setPaletteColor(e, colorCode)}
						>
							{#each palette[colorCode] as color, i}
								<option value={i}>
									#{color}
								</option>
							{/each}
						</select>
					</label>
				</div>
			{/each}
		</div>

		<TartanCanvas {threadList} />
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	label {
		text-align: left;
		width: 100%;
	}

	label input {
		width: 100%;
	}

	label.unused {
		color: #888;
	}

	label.used {
		color: #000;
		font-weight: 700;
	}

	h2 {
		font-size: 24px;
		margin: 0;
	}

	#main {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	#palette label {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}
	#palette select {
		width: 6em;
		font-family: monospace;
	}

	.color-preview {
		height: 1em;
		width: 1em;
	}
</style>
