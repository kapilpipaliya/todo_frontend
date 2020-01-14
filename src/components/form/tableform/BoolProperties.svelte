<script lang='ts'>
	import { onMount } from '../../../modules/functions.ts'
	import * as RD from 'rambda'
	import Options from './Options.svelte'
	export let value = []
	export let options = []
	export let disabled = false
	export let keyIdx
	export let display
	export let boolPropIndex
	export let form_disabled = false
	

	value = value ?? [null,{}]

	let boolkeys = []
	const onChange = () => {
		const b = RD.find(x=>x[keyIdx]==value[0], options)
		value[1]={}
		console.log(b)
		if(b){
			boolkeys = b[boolPropIndex]
		}
	}
	onMount(()=>{
		onChange()
	})
</script>


<td>
	<select bind:value={value[0]} required on:change={onChange} disabled={disabled || form_disabled} >
		<Options {keyIdx} {options} {display} />
	</select>
</td>
<td>
	{#each boolkeys as r }
		<label><input type="checkbox" bind:checked={value[1][r]} disabled={form_disabled} />{r}</label>
	{/each}
</td>
