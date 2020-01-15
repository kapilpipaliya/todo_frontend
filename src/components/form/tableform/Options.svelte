<script lang='ts'>
	import { onMount, stringifyRawPattern } from '../../../modules/functions.ts'
	export let options = []
	export let keyIdx = 0
	export let display = [1, ' - ',2]
	function render(r){
		return stringifyRawPattern(display, r)
	}
</script>

{#each options as r (r[0])}
	<option value={r[keyIdx]}>{render(r)}</option>
{/each}
