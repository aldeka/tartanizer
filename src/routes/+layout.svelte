<script>
	import './styles.css';
</script>

<main id="wrapper">
	<slot />
</main>

<style>
	#wrapper {
		min-height: 100vh;
		max-width: 1024px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		font-size: 16px;

		margin: 0 auto;

		box-sizing: border-box;
		padding: 0 16px;

		& * {
			box-sizing: border-box;
		}
	}

	@media (max-width: 1023px) {
		#wrapper {
			min-width: calc(100vw - 32px);
			max-width: calc(100vw - 32px);
			min-height: 100vh;
			max-height: fit-content;
			margin: 0 16px;
		}
	}
</style>
