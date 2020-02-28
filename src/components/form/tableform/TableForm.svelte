<script lang='ts'>
	import { onMount, S, Unique } from '../../../modules/index'
	import * as RD from 'rambda'
	import {_cloneArray} from './clone'
	import Options from './Options.svelte'
	import BoolProperties from './BoolProperties.svelte'
	export let dp = "r[1]+' - '+r[2]" // display pattern
	export let keyIdx = 0
	export let value = []
	export let e = []
	export let disabled;
	//export let args = [ [filter], [], []]
	export let multiSelect = false
	export let boolprop = false
	export let bi = 1 // boolPropIndex
	
	export let data = []

	//$: newAvailableOps = data.filter(x=> !value.includes(x[keyIdx]))
	let newAvailableOps = []
	$: {
		if (boolprop){
			const keys = value.map(x=>x[0])
			newAvailableOps = data.filter(x=> !keys.includes(x[keyIdx]))
		} else {
			newAvailableOps = data.filter(x=> !value.includes(x[keyIdx]))//return false if includes
		}
	}
	function handleAdd() {
		if (boolprop){
			if(newAvailableOps.length) {
				value.push([newAvailableOps[0][keyIdx], {}])
				value=value
			}
		} else {
			if(newAvailableOps.length) {
				// note concat return new array:
				value = value.concat([newAvailableOps[0][keyIdx]])	
			}
		}
	} 
	const handleDelete = (row) => () => {
		value = value.filter((_, i) => i !== row);
	}
	const getOptions = (valueIdx) => {
		if (boolprop){
			const keys = value.map(x=>x[0])
			return _cloneArray(data, [], [], true).filter(x=> {
				// [['abc',{}],['def',{}]]
				return !keys.includes(x[keyIdx]) || keys[valueIdx] == x[keyIdx]
			})
		} else {
			// ['abc','def']
			return _cloneArray(data, [], [], true).filter(x=>!value.includes(x[keyIdx]) || value[valueIdx] == x[keyIdx])
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
			console.warn('cant get fetch_evt')
		}

		// set single select first value if empty:
		if(!multiSelect){
			if(data.length){
				if(!value){
					value = data[0]?.[0]  ?? ""
				}
			}
		}
	})
	function onFetchGet(all){
		const [[h, d]] = all
		const getData = d?.r?.result ?? false
		if(getData === false){
			console.warn('returned data is not proper', all)
		} else {
			data = getData
		}
		if(!multiSelect){
			if(!value) {
				if(data.length){
					value = data[0] // Is this correct?? it should be data[0][0]
				}
			}
		} else {
		  	value = value
		}
	}
</script>

{#if multiSelect}
	{#if value.length}
	<table>
		<tbody>
			{#each value as v, i (v)}
				<tr>
					<td><label></label></td>
					{#if boolprop}
						{#if data.length}
							<BoolProperties 
								disabled={disabled || i < value.length - 1}
								bind:value={v}
								options={getOptions(i)}
								{keyIdx}
								{dp}
								{bi}
							/>
						{/if}
					{:else}
						<td>
							<select bind:value={v} required disabled={disabled || i < value.length - 1} on:change={onChange}>
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
	<button type="button" on:click={handleAdd} disabled={disabled || !newAvailableOps.length} >Add</button>
{:else}
	<select bind:value={value}  required on:change={onChangeSingle} on:change >
		<Options {keyIdx} options={data} {dp} />
	</select>
{/if}
