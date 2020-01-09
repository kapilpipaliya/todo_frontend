<script lang='ts'>
	import { onMount, S, event_type as et, events as e } from '../../../modules/functions.ts'
	import {_cloneArray} from './clone.ts'
	import Options from './Options.svelte'
	export let display = "r[1]+' '+r[2]"
	export let keyIdx = 0
	export let values = []
	let data = []

	$: newAvailableOps = data.filter(x=> !values.includes(x[keyIdx]))
	function handleAdd() {
		if(newAvailableOps.length) {
			values = values.concat([newAvailableOps[0][keyIdx]])	
		}
	} 
		const handleDelete = (row) => () => {
		values = values.filter((_, i) => i !== row);
	}
	const getOptions = (valuesIdx) => {
		return _cloneArray(data, [], [], true).filter(x=>!values.includes(x[keyIdx]) || values[valuesIdx] == x[keyIdx])
	}
	const onChange = (v) => (e) => {
		// on selecting new value, remove it from all other select options
	}
	onMount(() => {
		//console.log($$props)
		let fetch_evt = [et.get, e.admin, e.member_list, 0]
		S.bind$(fetch_evt, onFetchGet, 1)
		S.trigger([[fetch_evt, []]])
	})
	function onFetchGet([d]){
		console.log(d.r.result)
		data = d.r.result
		values = values
	}
</script>

{#if values.length}
<table>
	<tbody>
		{#each values as v, i (v)}
			<tr>
				<td><label></label></td>
				<td>
					<select bind:value={v}  required on:change={onChange} disabled={i < values.length - 1} >
							<Options {keyIdx} options={getOptions(i)}/>
					</select>
				</td>
				<td><button type="button" on:click={handleDelete(i)} >delete</button></td>
			</tr>
		{/each}
	</tbody>
</table>
{/if}
<button type="button" on:click={handleAdd} disabled={!newAvailableOps.length}>Add</button>
<br>
data:
<br>
{JSON.stringify(data)}<br>
values:
<br>
{JSON.stringify(values)}
