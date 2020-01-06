<script lang='ts'>
	export let options = []
	export let keyIdx = 0
	export let display = "r[1]+' '+r[2]"
	function render(r){
		return eval(display)
	}
</script>

{#each options as r (r[0])}
	<option value={r[keyIdx]}>{render(r)}</option>
{/each}
