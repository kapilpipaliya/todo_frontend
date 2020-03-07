<script lang='ts'>
	import { onMount } from '../../../modules/index'
	import { find } from 'rambda'
	import Options from './Options.svelte'
	export let value = []
	export let options = []
	export let disabled = false
	export let keyIdx
	export let dp
	export let bi // boolPropIndex
	export let form_disabled = false
	

	value = value ?? [null,{}]

	let boolkeys = []
	const onChange = () => {
		// value = ["backlog", {…}]
 		// options = [ ["backlog", "BackLog", Array(7)] ]
		const b = find(x=>x[keyIdx]==value[0], options)
		if(!value[1]) { // this will not happen, parent component take care of it
			value[1]= value[1] ?? {}
		}
		if(b){
			if(Array.isArray(b) && b.length > bi && Array.isArray(b[bi])){
				boolkeys = b[bi]
			} else {
				value[1] = {}
				boolkeys = []
			}
		}
	}
	onMount(()=>{
		onChange()
	})
</script>


<td>
	{#if options.length}
		<select bind:value={value[0]} required on:change={onChange} disabled={disabled || form_disabled} >
			<Options {keyIdx} {options} {dp} />
		</select>
	{/if}
</td>
<td>
	{#each boolkeys as r }
		<label><input type="checkbox" bind:checked={value[1][r]} disabled={form_disabled} />{r}</label>
	{/each}
</td>
