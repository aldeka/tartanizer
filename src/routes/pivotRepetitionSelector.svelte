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
		<label for="none" class:active={pivotFormat === 'none'}
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
		<label for="half" class:active={pivotFormat === 'half'}
			><input
				id="half"
				type="radio"
				checked={pivotFormat === 'half'}
				on:change={() => {
					setPivot('half');
				}}
			/>half-pivot</label
		>
		<label for="full" class:active={pivotFormat === 'full'}
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
		<label for="one" class:active={repetitions === 1}
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
		<label for="two" class:active={repetitions === 2}
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
		<label for="three" class:active={repetitions === 3}
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
			align-items: center;
			margin-right: 1rem;

			& label {
				line-height: 14px;
				padding: 0.25rem 0.25rem;
				background: #f0f0f0;
				margin-left: 6px;
				border-radius: 0.25rem;
				border: 1px solid black;

				&.active {
					background: white;
					box-shadow: 0px 0px 0px 3px orange;
				}

				&:not(.disabled) {
					cursor: pointer;

					&:hover:not(.active) {
						box-shadow: 0px 0px 0px 3px #bbb;
					}
				}
			}

			& input[type='radio'] {
				position: absolute;
				left: -9999px;
			}
		}
	}
</style>
