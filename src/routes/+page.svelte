<script lang="ts">
	import ColorSelector from './colorSelector.svelte';
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
		const segments = colorsText.trim().split(' ');
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

	function setPaletteColor(colorCode: string, index: number) {
		activePaletteIndices[colorCode] = index;
	}

	function randomizePattern() {
		const maxChunkSize = 60;
		const maxPatternSize = 160;

		let pattern = '';
		let patternSize = 0;

		const codes = Object.keys(palette);

		while (patternSize < maxPatternSize) {
			const newCode = codes[Math.round(Math.random() * (codes.length - 1))];
			let newNumber = Math.round(Math.random() * maxChunkSize);
			if (newNumber < 40 && newNumber > 6) {
				// thumb on the scale makes stripes more likely to be large or small,
				// rather than a bunch of same-width stripes
				newNumber = Math.round(newNumber / 2);
			}
			if (patternSize + newNumber > maxPatternSize) {
				newNumber = maxPatternSize - patternSize;
			}
			pattern += ` ${newCode}${newNumber}`;
			patternSize += newNumber;
		}

		colorString = pattern;
	}
</script>

<svelte:head>
	<title>Tartanizer</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section id="wrapper">
	<h1>Tartan simulator</h1>

	<section id="pattern-spec">
		<label
			>pattern
			<input type="text" bind:value={colorString} />
		</label>
		<button on:click={randomizePattern}>I'm feeling lucky</button>
	</section>

	<main>
		<section id="palette">
			<h2>Palette</h2>
			{#each Object.keys(palette) as colorCode}
				<ColorSelector
					used={threadList.indexOf(palette[colorCode][activePaletteIndices[colorCode]]) !== -1}
					code={colorCode}
					label={paletteLabels[colorCode]}
					options={palette[colorCode]}
					activeIndex={activePaletteIndices[colorCode]}
					{setPaletteColor}
				/>
			{/each}
		</section>

		<TartanCanvas {threadList} />
	</main>
</section>

<style>
	section#wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		font-size: 16px;
	}

	section#wrapper * {
		box-sizing: border-box;
	}

	h1 {
		width: 100%;
	}

	section#pattern-spec {
		display: flex;
		align-items: flex-end;
		margin-bottom: 0.5em;
	}

	label {
		text-align: left;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin-right: 1em;
	}

	input,
	button {
		max-height: 3em;
		min-height: 3em;
	}

	label input {
		padding: 0 0.5em;
	}

	button {
		cursor: pointer;
		display: block;
		flex: 0;
		min-width: 180px;
		border-radius: 0.25em;
		font-weight: 900;
		color: white;
		border-color: black;

		background: #000
			repeating-linear-gradient(
				120deg,
				#bcc3d299,
				#2c408499 2px,
				#50505099 2px,
				#5a008c99 4px,
				#98c8e899 4px,
				#a0000099 6px,
				#781c3899 6px,
				#40806099 8px,
				#be783299 8px,
				#98481c99 10px,
				#44004499 10px,
				#e0a12699 12px,
				#78948499 12px,
				#c8c8c899 14px,
				#00544899 14px,
				#10101099 16px,
				#a0a0a099 16px,
				#4c342899 18px
			);
	}

	h2 {
		font-size: 24px;
		margin: 0;
	}

	main {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}
</style>
