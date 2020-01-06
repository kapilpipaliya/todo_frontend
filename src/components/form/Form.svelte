<script lang='ts'>
import { onMount } from '../../modules/functions.ts'
import Checkboxes from './Checkboxes.svelte';
import SubmitButton from '../_SubmitButton.svelte'
import CancelButton from '../_CancelButton.svelte'
import TableForm from './tableform/TableForm.svelte'
export let key
export let isSaving
export let headers
export let form
export let form_disabled = true
export let save = ()=>0

let labels = []
let types = []
let required = []

let disabled = []
let description = []
let props = []

let doms = {}
let mounted = false
let once = true

$: {
	labels = headers[0] ?? []
	types = headers[1] ?? []
	required = headers[2] ?? []

	disabled = headers[3] ?? []
	description = headers[4] ?? []
	props = headers[5] ?? []
}

$: {
	if(mounted && once){
		let index = -1
		let i = -1
	    for (i = 0; i < disabled.length; i++) {
	      if (!disabled[i]) {
	        index = i
	        break
	      }
	    }
	    if(index > -1) {
	      setTimeout(function(){ if(doms[index]) doms[index].focus() }, 200);
		  once = false
	    }
	}
}

onMount(()=> {
   mounted = true
})
</script>
<form on:submit|preventDefault={save}>
{#each form as f, i}
  <label>
				{#if types[i] === 'color'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='color'
					 bind:value={form[i]}
					 required={required[i]} 

					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'email'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='email'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'file'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='file'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'hidden'}
    			<input 
					 name={labels[i]}
					 type='hidden'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'number'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='number'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'password'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='password'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'range'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='range'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'search'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='search'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'text'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='text'
					 bind:value={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'checkbox' && !Array.isArray(form[i])}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='checkbox'
					 bind:checked={form[i]}
					 required={required[i]} 
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 bind:this={doms[i]}
					 {...props[i]}
				/>
				{:else if types[i] === 'checkbox'}
				<span>{labels[i]}</span>
		    	<Checkboxes 
							 
					 name={labels[i]}
					 bind:value={form[i]}
					 required={required[i]} 
					 bind:this={doms[i]}
					 disabled={form_disabled ? true : disabled[i]}
					 props={props[i]}						 
					/>
				{:else if types[i] === 'radio'}
				<span>{labels[i]}</span>
				{#each form[i] as v}
					<label>
		    			<input 
							 name={labels[i]}
							 type='radio'
							 bind:group={form[i]}
							 required={required[i]} 
							 autocomplete={false}
							 disabled={form_disabled ? true : disabled[i]}
							 bind:this={doms[i]}
							 {...props[i]}
						/>
						{v}
					</label>
				{/each}
   {:else if types[i] === 'textarea'}
   	  <span>{labels[i]}</span>
      <textarea
				bind:value={form[i]}
				bind:this={doms[i]}
        rows={10}
        cols={20}
        {...props[i]}
       />
    {:else if types[i] === 'select'}
      <span>{labels[i]}</span>
      <select
					bind:this={doms[i]}		
      {...props[i]}
       />
    {:else if types[i] === 'radio'}
      <span>{labels[i]}</span>
      <radio
      bind:this={doms[i]}
      {...props[i]}
       />
     {:else if types[i] = 'multi-select'}
     	<span>{labels[i]}</span>
     	<TableForm {...props[i]} />
    {/if}
    <!-- Description -->
    {#if description[i]}
      {description[i]}
    {/if}		
  </label>
{/each}
  <footer>
    <SubmitButton isSaving={isSaving} />
    <CancelButton isSaving={isSaving} {key} on:close />
  </footer>
</form>