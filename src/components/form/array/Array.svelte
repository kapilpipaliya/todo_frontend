<script lang='ts'>
	import { onMount } from '../../../modules/index'
	export let values = []
	export let disabled = false
	values = values ?? []
	let doms = []
	function handleAdd() {
		values.push("")	
		values = values
		setTimeout(function(){if(doms[values.length-1]) doms[values.length-1].focus() }, 50);
	} 
	const handleDelete = (row) => () => {
		values = values.filter((_, i) => i !== row);
	}
</script>

<table>
	<tbody>
		{#each values as v, i (i)}
			<tr>
				<td><label></label></td>
				<td>
					<input type='text' bind:value={v} bind:this={doms[i]} required  {disabled} />
				</td>
				<td><button type="button" on:click={handleDelete(i)} {disabled} >delete</button></td>
			</tr>
		{/each}
	</tbody>
</table>
<button type="button" on:click={handleAdd} {disabled}>Add</button>
