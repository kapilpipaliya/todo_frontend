

<script>
import { onMount } from 'svelte'
import clsx from "clsx";
import Checkboxes from './Checkboxes.svelte';
import SubmitButton from '../_SubmitButton.svelte'
import CancelButton from '../_CancelButton.svelte'
export let key
export let isSaving
export let headers
export let form
export let form_disabled = true
export let save = ()=>0

let labels = []
let types = []
let required = []
let placeholder = []
let disabled = []
let readonly = []
let title = []
let style = []
let classe = []
let description = []
let props = []
let doms = {}
let mounted = false
let once = true

$: {
	labels = headers[0] || []
	types = headers[1] || []
	required = headers[2] || []
	placeholder = headers[3] || []
	disabled = headers[4] || []
	readonly = headers[5] || []
	title = headers[6] || []
	style = headers[7] || []
	classe = headers[8] || []
	description = headers[9] || []
	props = headers[10] || []
}

$: {
	if(mounted && once){
		let index = -1
		let i = -1
	    for (i = 0; i < disabled.length; i++) {
	      if (!disabled[i] && !readonly[i]) {
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
			{#if types[i] === 'button'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='button'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'color'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='color'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'date'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='date'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'datetime-local'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='datetime-local'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'email'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='email'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'file'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='file'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'hidden'}
    			<input 
					 name={labels[i]}
					 type='hidden'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'image'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='image'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
					 alt='image'
				/>
				{:else if types[i] === 'month'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='month'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'number'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='number'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'password'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='password'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'range'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='range'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'reset'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='reset'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'search'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='search'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'submit'}
    			<input 
					 name={labels[i]}
					 type='submit'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'tel'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='tel'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'text'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='text'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'time'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='time'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'url'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='url'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'week'}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='week'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'checkbox' && !Array.isArray(form[i])}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='checkbox'
					 bind:checked={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]+'a'}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
					 {...props[i]}
				/>
				{:else if types[i] === 'radio' && !Array.isArray(form[i])}
				<span>{labels[i]}</span>
    			<input 
					 name={labels[i]}
					 type='radio'
					 bind:value={form[i]}
					 required={required[i]} 
					 placeholder={placeholder[i]}
					 autocomplete={false}
					 disabled={form_disabled ? true : disabled[i]}
					 readonly={readonly[i]}
					 title={title[i]}
					 bind:this={doms[i]}
					 style={style[i]} 
					 class={clsx(classe[i])}
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
					 readonly={readonly[i]}
					 title={title[i]}
					 
					 style={style[i]} 
					 classe={clsx(classe[i])} 
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
							 placeholder={placeholder[i]}
							 autocomplete={false}
							 disabled={form_disabled ? true : disabled[i]}
							 readonly={readonly[i]}
							 title={title[i]}
							 bind:this={doms[i]}
							 style={style[i]} 
							 class={clsx(classe[i])}
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