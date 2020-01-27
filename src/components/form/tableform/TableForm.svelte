<script lang='ts'>
	import { onMount, S, Unique } from '../../../modules/index.ts'
	import * as RD from 'rambda'
	import {_cloneArray} from './clone.ts'
	import Options from './Options.svelte'
	import BoolProperties from './BoolProperties.svelte'
	export let dp = "r[1]+' - '+r[2]" // display pattern
	export let keyIdx = 0
	export let values = []
	export let e = []
	export let disabled;
	//export let args = [ [filter], [], []]
	export let multiSelect = false
	export let boolprop = false
	export let bi = 1 // boolPropIndex
	
	let data = []

	//$: newAvailableOps = data.filter(x=> !values.includes(x[keyIdx]))
	let newAvailableOps = []
	$: {
		if (boolprop){
			const keys = values.map(x=>x[0])
			newAvailableOps = data.filter(x=> !keys.includes(x[keyIdx]))
		} else {
			newAvailableOps = data.filter(x=> !values.includes(x[keyIdx]))//return false if includes
		}
	}
	function handleAdd() {
		if (boolprop){
			if(newAvailableOps.length) {
				values.push([newAvailableOps[0][keyIdx], {}])
				values=values
			}
		} else {
			if(newAvailableOps.length) {
				// note concat return new array:
				values = values.concat([newAvailableOps[0][keyIdx]])	
			}
		}
	} 
	const handleDelete = (row) => () => {
		values = values.filter((_, i) => i !== row);
	}
	const getOptions = (valuesIdx) => {
		if (boolprop){
			const keys = values.map(x=>x[0])
			return _cloneArray(data, [], [], true).filter(x=> {
				// [['abc',{}],['def',{}]]
				return !keys.includes(x[keyIdx]) || keys[valuesIdx] == x[keyIdx]
			})
		} else {
			// ['abc','def']
			return _cloneArray(data, [], [], true).filter(x=>!values.includes(x[keyIdx]) || values[valuesIdx] == x[keyIdx])
		}
	}
	const onChange = (v) => (e) => {
		// on selecting new value, remove it from all other select options
	}
	const onChangeSingle = (v) => (e) => {
		// on selecting new value, remove it from all other select options
	}
	onMount(() => {
		let fetch_evt = e[0] ?? []
		if(fetch_evt.length){
			fetch_evt.push(Unique.id)
			S.bind$(fetch_evt, onFetchGet, 1)
			S.trigger([[fetch_evt, []]])
		} else {
			console.log('cant get fetch_evt')
		}
	})
	function onFetchGet(all){
		const [[h, d]] = all
		data = d.r.result
		if(!multiSelect){
			if(!values) {
				if(data.length){
					values = data[0]
				}
			}
		} else {
		  	values = values
		}
	}
// <br>
// data:
// <br>
// {JSON.stringify(data)}<br>
// values:
// <br>
// {JSON.stringify(values)}
</script>

{#if multiSelect}
	{#if values.length}
	<table>
		<tbody>
			{#each values as v, i (v)}
				<tr>
					<td><label></label></td>
					{#if boolprop}
						{#if data.length}
							<BoolProperties 
								disabled={disabled || i < values.length - 1}
								bind:value={v}
								options={getOptions(i)}
								{keyIdx}
								{dp}
								{bi}
							/>
						{/if}
					{:else}
						<td>
							<select bind:value={v} required disabled={disabled || i < values.length - 1} on:change={onChange}>
									<Options {keyIdx} options={getOptions(i)} {dp} />
							</select>
						</td>
					{/if}
					<td><button type="button" on:click={handleDelete(i)} {disabled}>delete</button></td>
				</tr>
			{/each}
		</tbody>
	</table>
	{/if}
	<button type="button" on:click={handleAdd} disabled={!newAvailableOps.length} {disabled}>Add</button>
{:else}
	<select bind:value={values}  required on:change={onChangeSingle} on:change >
		<Options {keyIdx} options={data} {dp} />
	</select>
{/if}