<script lang="ts">
	import type { PivotFormat } from './types';

	export let setRepeat: (x: number) => void;
	export let setPivot: (pivot: PivotFormat) => void;
	export let pivotFormat: string;
	export let repetitions: number;
</script>

<div id="pivot-and-repetition" class="help">
	<div id="pivot-options" class="display-options">
		pivot:
		<label for="none"
			><input
				id="none"
				type="radio"
				checked={pivotFormat === 'none'}
				on:change={() => {
					setPivot('none');
				}}
			/>
			asymmetric</label
		>
		<label for="half"
			><input
				id="half"
				type="radio"
				checked={pivotFormat === 'half'}
				on:change={() => {
					setPivot('half');
				}}
			/>half-pivot</label
		>
		<label for="full"
			><input
				id="full"
				type="radio"
				checked={pivotFormat === 'full'}
				on:change={() => {
					setPivot('full');
				}}
			/>
			full-pivot</label
		>
	</div>

	<div id="repetitions" class="display-options">
		repetitions:
		<label for="one"
			><input
				id="one"
				type="radio"
				checked={repetitions === 1}
				on:change={() => {
					setRepeat(1);
				}}
			/>
			1x</label
		>
		<label for="two"
			><input
				id="two"
				type="radio"
				checked={repetitions === 2}
				on:change={() => {
					setRepeat(2);
				}}
			/>
			2x</label
		>
		<label for="three"
			><input
				id="three"
				type="radio"
				checked={repetitions === 3}
				on:change={() => {
					setRepeat(3);
				}}
			/>
			3x</label
		>
	</div>
</div>

<style>
	#pivot-and-repetition {
		margin-top: 0.25rem;
		display: flex;
		align-items: flex-start;

		& .display-options {
			display: flex;
			align-items: flex-start;
			margin-right: 1rem;

			& label {
				line-height: 14px;
				padding: 1px 4px;
				background: white;
			}
		}
	}
</style>
