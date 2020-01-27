<script lang='ts'>
	import { onMount, stringifyRawPattern } from '../../../modules/index.ts'
	export let options = []
	export let keyIdx = 0
	export let dp = [1, ' - ',2]
	function render(r){
		return stringifyRawPattern(dp, r)
	}
</script>

{#each options as r (r[0])}
	<option value={r[keyIdx]}>{render(r)}</option>
{/each}
