<script lang='ts'>
	import { onMount } from '../../../modules/index'
	import { Debug } from '../../debug'
	export let values = []
	export let disabled = false
	export let ar = false
	values = values ?? []
	let doms = []
	function handleAdd() {
		values.push("")	
		values = values
		setTimeout(function(){if(doms[values.length-1]) doms[values.length-1].focus() }, 50);
	    
	    //const itemSchema = (isFixedItems(schema) && allowAdditionalItems(schema)) ? schema.allowAdditionalItems : schema.items
	    //formData = [...formData, getDefaultFormState(itemSchema, undefined, definitions)]
	} 
	const handleDelete = (row) => (e) => {
		e.stopPropagation()
		values = values.filter((_, i) => i !== row);
	}

  const onReorder = (from, to) => (event) => {
    event.stopPropagation()

    values = values.map((item, i, array) => (
      (i === from)
        ? array[to]
        : (i === to)
          ? array[from]
          : item
    ))
  }
</script>

<Debug title=Array data={{$$props}} />

<table>
	<tbody>
		{#each values as v, i (i)}
			<tr>
				{#if false}<td><label></label></td>{/if}
				<td>
					<input type='text' bind:value={v} bind:this={doms[i]} required  {disabled} />
				</td>
				{#if ar}
					<td><button type="button" on:click={onReorder(i, i - 1)} disabled={disabled || (i == 0)} >˄</button></td>
					<td><button type="button" on:click={onReorder(i, i + 1)} disabled={disabled || (i == (values.length-1))} >˅</button></td>
				{/if}
				<td><button type="button" on:click={handleDelete(i)} {disabled} >x</button></td>
			</tr>
		{/each}
	</tbody>
</table>
<button type="button" on:click={handleAdd} {disabled}>Add</button>
