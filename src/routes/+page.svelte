<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;

  const blue = "042D51";
  const brown = "4D3101";
  const yellow = "E1B508";
  const red = "B90004";
  const green = "336B2B";
  const size = 480;
  const step = 2;

  function makeChunk(length: number, color: string): string[] {
    const chunk = new Array(length).fill(color);
    return chunk;
  }

  const colors = ([] as string[]).concat(
    makeChunk(6, blue),
    makeChunk(1, brown),
    makeChunk(1, yellow),
    makeChunk(1, brown),
    makeChunk(1, blue),
    makeChunk(5, brown),
    makeChunk(5, green),
    makeChunk(2, brown),
    makeChunk(6, green),
    makeChunk(5, brown),
    makeChunk(6, blue),
    makeChunk(1, red),
    makeChunk(1, yellow),
  );

  const multiplier = size / colors.length;
  const lineWidth = size / 40 - 1;

  type Thread = {
    start: [number, number];
    end: [number, number];
    color: string;
  };

  const topThreads: Thread[] = [];
  const bottomThreads: Thread[] = [];


  onMount(() => {
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      function generateVertThreads(color: string, index: number) {
        const x = index * multiplier + lineWidth / 2;
        const topStartPoint = index % 4 - 4;
        let rawY = topStartPoint;
        while (rawY < 40) {
          const subthread: Thread = {
            start: [x, rawY * multiplier],
            end: [x, (rawY + step) * multiplier],
            color,
          };
          (rawY - topStartPoint) % (step * 2) === 0 ? topThreads.push(subthread) : bottomThreads.push(subthread);
          rawY += step;
        }
      }

      function generateHorizThreads(color: string, index: number) {
        const y = index * multiplier + lineWidth / 2;
        const leftStartPoint = index % 4 - 3;
        let rawX = leftStartPoint;
        while (rawX < 40) {
          const subthread: Thread = {
            start: [rawX * multiplier, y],
            end: [(rawX + step) * multiplier, y],
            color,
          };
          (rawX - leftStartPoint) % (step * 2) === 0 ? topThreads.push(subthread) : bottomThreads.push(subthread);
          rawX += step;
        }
      };

      colors.forEach(generateVertThreads);
      // generateVertThreads(vertThreadColors[0], 0);
      // generateVertThreads(vertThreadColors[1], 1);
      // generateVertThreads(vertThreadColors[2], 2);
      // generateVertThreads(vertThreadColors[3], 3);
      colors.forEach(generateHorizThreads);

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
  });
</script>

<svelte:head>
  <title>Tartanizer</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h1>
    hi
  </h1>

  <canvas bind:this={canvas} height={size} width={size} />
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

  canvas {
    background: white;
  }
</style>
