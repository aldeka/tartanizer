<script lang="ts">
	let innerWidth = window.innerWidth;
	let innerHeight = window.innerHeight;

	import ColorSelector from './colorSelector.svelte';
	import TartanCanvas from './tartanCanvas.svelte';

	let defaultCanvasSize = 640;
	$: size = innerWidth < defaultCanvasSize ? innerWidth : defaultCanvasSize;

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
		R: ['A00048', 'DC0000', 'C80000', 'C82828', 'C8002C', 'B03000', 'FA4B00', 'FF0000'],
		DR: ['A00000', '960000', '880000', '800028', '781C38', '4C0000', '901C38', '680028'],
		O: ['EC8048', 'E86000', 'FF5000', 'DC943C', 'D87C00'],
		DO: ['BE7832'],
		LY: ['F9F5C8', 'F8E38C'],
		Y: ['FFFF00', 'FFE600', 'FFD700', 'FCCC00', 'E0A126', 'E8C000', 'D8B000'],
		DY: ['BC8C00', 'C89800', 'C88C00'],
		LG: ['789484', '649848', '86C67C', 'ACD74A', 'C4BC68', '9C9C00'],
		G: [
			'008B00',
			'289C18',
			'408060',
			'006400',
			'007800',
			'3F5642',
			'00643C',
			'146400',
			'006818',
			'004C00',
			'285800',
			'005020',
			'005448',
			'767E52',
			'5C6428'
		],
		DG: ['003C14', '003820', '004028', '002814'],
		LB: ['98C8E8', 'BCC3D2', '82CFFD', '00FCFC'],
		B: [
			'2C4084',
			'1870A4',
			'1474B4',
			'0596FA',
			'2474E8',
			'788CB4',
			'5F749C',
			'0000CD',
			'0000FF',
			'3850C8',
			'2888C4',
			'048888',
			'3C82AF',
			'5C8CA8',
			'48A4C0'
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
		P: ['9058D8', '64008C', '5A008C', 'AA00FF', 'B458AC', '6C0070', '780078'],
		DP: ['440044', '1E0948'],
		W: ['FFFFFF', 'FCFCFC', 'F8F8F8', 'E5DDD1', 'E8CCB8', 'F0E0C8'],
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

	type Stripe = {
		colorCode: string; // Color of this block of threads
		threadCount: number; // Number of threads of this color in this block
		isHalfPivot: boolean;
		isFullStartPivot: boolean;
		isFullEndPivot: boolean;
	};

	const colorRe = new RegExp(`^(/?)(${validColorCodes.join('|')})(/?)(\\d+)(/?)$`);
	function parseStripe(c: string): Stripe | undefined {
		const m = c.match(colorRe);
		if (m) {
			const isFullStartPivot = m[1] !== '';
			const colorCode = m[2];
			const isHalfPivot = m[3] !== '';
			const threadCount = parseInt(m[4], 10);
			const isFullEndPivot = m[5] !== '';
			return {
				colorCode,
				threadCount,
				isHalfPivot,
				isFullStartPivot,
				isFullEndPivot
			};
		}
	}

	function makeThreadList(colorsText: string, activePalette: { [key: string]: number }): string[] {
		const segments = colorsText.trim().split(' ');
		let retval: string[] = [];
		for (const segment of segments) {
			const stripe = parseStripe(segment);
			if (stripe !== undefined) {
				const { colorCode, threadCount } = stripe;
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
		let prevCode = '';

		const codes = Object.keys(palette);

		while (patternSize < maxPatternSize) {
			const newCode = codes[Math.round(Math.random() * (codes.length - 1))];
			// don't have adjacent blocks of the same color
			if (newCode !== prevCode) {
				let newNumber = Math.round(Math.random() * maxChunkSize) + 1; // don't want a zero
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
				prevCode = newCode;
			}
		}

		colorString = pattern.trim();
	}

	$: usedColorCodes = validColorCodes.filter(
		(code) => threadList.indexOf(palette[code][activePaletteIndices[code]]) !== -1
	);
	$: unusedColorCodes = validColorCodes.filter((code) => !usedColorCodes.includes(code));
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<svelte:head>
	<title>Tartanizer</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<h1>tartan simulator</h1>

<section id="pattern-spec">
	<div class="pattern-input">
		<label for="pattern"
			>pattern <a href="https://www.tartanregister.gov.uk/threadcount" target="_blank" class="help"
				>(color code, then thread count)</a
			></label
		>
		<input id="pattern" name="pattern" type="text" bind:value={colorString} />
	</div>
	<button
		class="stripey-button"
		title="generate a random tartan pattern"
		on:click={randomizePattern}>i'm feeling lucky</button
	>
</section>

<div id="canvas-and-palette">
	<div>
		<TartanCanvas {threadList} width={size} height={size} />
		<footer>
			<a href="https://github.com/aldeka/tartanizer" target="_blank">made with {'<3'}</a> by
			<a href="https://github.com/aldeka" target="_blank">aldeka</a>
			and <a href="https://github.com/zarvox" target="_blank">zarvox</a>
		</footer>
	</div>
	<section id="palette">
		<h3>Palette</h3>
		{#if usedColorCodes.length > 0}
			<div class="used-colors">
				{#each usedColorCodes as colorCode}
					<ColorSelector
						used={threadList.indexOf(palette[colorCode][activePaletteIndices[colorCode]]) !== -1}
						code={colorCode}
						label={paletteLabels[colorCode]}
						options={palette[colorCode]}
						activeIndex={activePaletteIndices[colorCode]}
						{setPaletteColor}
					/>
				{/each}
				<hr />
			</div>
		{/if}
		<div class="unused-colors">
			{#each unusedColorCodes as colorCode}
				<ColorSelector
					used={threadList.indexOf(palette[colorCode][activePaletteIndices[colorCode]]) !== -1}
					code={colorCode}
					label={paletteLabels[colorCode]}
					options={palette[colorCode]}
					activeIndex={activePaletteIndices[colorCode]}
					{setPaletteColor}
				/>
			{/each}
		</div>
	</section>
</div>

<style>
	.help {
		font-size: 12px;
	}

	h1 {
		width: 100%;
		font-size: 2em;
		color: #111119;
		font-weight: 900;
	}

	section#pattern-spec {
		flex: 0;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 2rem;
		font-size: 18px;

		& input,
		& button {
			max-height: 3em;
			min-height: 3em;
			font-size: 24px;
		}
	}

	.pattern-input {
		text-align: left;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin: 0;

		& input {
			padding: 0 0.5em;
			border-color: #111119;
			border-radius: 0.25em;
		}
	}

	.stripey-button {
		cursor: pointer;
		display: block;
		flex: 0;
		min-width: 240px;
		margin-left: 2rem;
		border-radius: 0.25em;
		border-color: #111119;
		color: black;
		font-weight: 900;
		text-shadow: -2px 2px 0 #fff, -3px 0 0 #fff, 3px 0 0 #fff, 2px 2px 0 #fff, 2px -2px 0 #fff,
			-2px -2px 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff;

		background: #fff
			repeating-linear-gradient(
				120deg,
				#bcc3d2bb,
				#2c4084bb 2px,
				#505050bb 2px,
				#5a008cbb 4px,
				#98c8e8bb 4px,
				#a00000bb 6px,
				#781c38bb 6px,
				#408060bb 8px,
				#be7832bb 8px,
				#98481cbb 10px,
				#440044bb 10px,
				#e0a126bb 12px,
				#789484bb 12px,
				#c8c8c8bb 14px,
				#005448bb 14px,
				#101010bb 16px,
				#a0a0a0bb 16px,
				#4c3428bb 18px
			);

		background-size: 400% 100%;
		animation-name: slider;
		animation-duration: 30s;
		animation-timing-function: linear;
		animation-delay: 0s;
		animation-iteration-count: infinite;
		animation-direction: normal;
		animation-play-state: paused;

		&:hover {
			animation-play-state: running;
			box-shadow: 1px 2px 8px #00000033, -1px -3px 16px #00000011, 0 0 4px #ddddff33;
		}
	}

	@keyframes slider {
		0% {
			background-position: 100% 0%;
		}
	}

	#canvas-and-palette {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: space-between;
		max-height: 640px;
	}

	label {
		font-weight: 400;
		margin: 0;
		margin-bottom: 0.25em;
		font-size: 18px;
	}

	section#palette {
		flex: 1;
		margin: 1rem 1.5rem 0 2rem;
		min-width: 220px;
		height: 616px;
		overflow-y: auto;

		padding: 0.5em 0 1.5em 0;
		background: #ffffff99;
		border-radius: 0.25em;

		& h3 {
			margin: 0 0 0.25rem 1rem;
			font-weight: 400;
		}

		& .used-colors {
			background: white;
		}
	}

	@media (max-width: 1023px) {
		#canvas-and-palette {
			flex: 1;
			flex-direction: column;
			align-items: center;
			max-height: none;
		}

		section#palette {
			margin-right: 0;
			margin-left: 0;
			margin-bottom: 2rem;
			max-width: 100%;
		}
	}
</style>
