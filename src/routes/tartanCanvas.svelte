<script lang="ts">
	export let threadList: string[] = [];
	export let width: number = 640;
	export let height: number = 640;
	import { afterUpdate, onMount } from 'svelte';

	$: smallerDimension = width < height ? width : height;

	let canvas: HTMLCanvasElement;

	const step = 2;

	type Thread = {
		start: [number, number];
		end: [number, number];
		color: string;
	};

	const repaint = () => {
		const ctx = canvas.getContext('2d');

		if (ctx) {
			const topThreads: Thread[] = [];
			const bottomThreads: Thread[] = [];
			const multiplier = smallerDimension / threadList.length;
			const lineWidth = (smallerDimension / threadList.length) * 0.8;

			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			function generateVertSubthreads(color: string, index: number) {
				const x = index * multiplier + multiplier / 2;
				const topStartPoint = (index % 4) - 4;
				let rawY = topStartPoint;
				while (rawY < threadList.length) {
					const subthread: Thread = {
						start: [x, rawY * multiplier],
						end: [x, (rawY + step) * multiplier],
						color
					};
					(rawY - topStartPoint) % (step * 2) === 0
						? topThreads.push(subthread)
						: bottomThreads.push(subthread);
					rawY += step;
				}
			}

			function generateHorizSubthreads(color: string, index: number) {
				const y = index * multiplier + multiplier / 2;
				const leftStartPoint = (index % 4) - 3;
				let rawX = leftStartPoint;
				while (rawX < threadList.length) {
					const subthread: Thread = {
						start: [rawX * multiplier, y],
						end: [(rawX + step) * multiplier, y],
						color
					};
					(rawX - leftStartPoint) % (step * 2) === 0
						? topThreads.push(subthread)
						: bottomThreads.push(subthread);
					rawX += step;
				}
			}

			threadList.forEach(generateVertSubthreads);
			threadList.forEach(generateHorizSubthreads);

			bottomThreads.forEach(({ start, end, color }) => {
				ctx.beginPath();
				ctx.moveTo(...start);
				ctx.lineTo(...end);
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = `#${color}ee`;
				ctx.stroke();
			});

			topThreads.forEach(({ start, end, color }) => {
				ctx.beginPath();
				ctx.moveTo(...start);
				ctx.lineTo(...end);
				ctx.lineWidth = lineWidth;
				ctx.strokeStyle = `#${color}`;
				ctx.stroke();
			});
		}
	};

	onMount(() => {
		repaint();
	});

	afterUpdate(() => {
		repaint();
	});

	console.log('size', width, height);
</script>

<canvas bind:this={canvas} {width} {height} />

<style>
	canvas {
		background: black;
		border: 4px solid black;
	}
</style>
