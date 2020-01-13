<script lang='ts'>
import Checkboxes from './Checkboxes.svelte';
import TableForm from './tableform/TableForm.svelte'
export let form
export let form_disabled = true

export let labels = []
export let types: number[] = []
export let required = []
export let disabled = []
export let description = []
export let props = []

export let doms = {}

enum Type {
	button = 1,
	checkbox,
	color,
	date,
	datetime_local,
	email,
	file,
	hidden,
	image,
	month,
	number,
	password,
	radio,
	range,
	reset,
	search,
	submit,
	tel,
	text,
	time,
	url,
	week,
	multi_select
};

const isDisabled = (form_disabled_, i) =>{
	if(form_disabled_ === true) {
		return true
	} else {
		return disabled[i]
	}
}
</script>
{#each form as f, i}
	{#if types[i] === Type.color}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='color'
		 bind:value={f}
		 required={required[i]} 

		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.email}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='email'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.file}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='file'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.hidden}
	<input 
		 name={labels[i]}
		 type='hidden'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.number}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='number'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.password}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='password'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.range}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='range'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.search}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='search'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.text}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='text'
		 bind:value={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.checkbox && !Array.isArray(f)}
	<span>{labels[i]}</span>
	<input 
		 name={labels[i]}
		 type='checkbox'
		 bind:checked={f}
		 required={required[i]} 
		 autocomplete={false}
		 disabled={isDisabled(form_disabled, i)}
		 bind:this={doms[i]}
		 {...props[i]}
	/>
	{:else if types[i] === Type.checkbox}
		<span>{labels[i]}</span>
    	<Checkboxes 
			 name={labels[i]}
			 bind:value={f}
			 required={required[i]}
			 bind:this={doms[i]}
			 disabled={isDisabled(form_disabled, i)}
			 props={props[i]}
			/>
	{:else if types[i] === Type.radio}
		<span>{labels[i]}</span>
		{#each f as v}
			<input
				 name={labels[i]}
				 type='radio'
				 bind:group={f}
				 required={required[i]}
				 autocomplete={false}
				 disabled={isDisabled(form_disabled, i)}
				 bind:this={doms[i]}
				 props={props[i]}
			/>
			<label>{v}</label>
		{/each}
   {:else if types[i] === Type.textarea}
   	  <span>{labels[i]}</span>
      <textarea
				bind:value={f}
				bind:this={doms[i]}
        rows={10}
        cols={20}
        {...props[i]}
       />
    {:else if types[i] === Type.select}
      <span>{labels[i]}</span>
      <TableForm bind:this={doms[i]} {...props[i]} multiSelect={false} />
    {:else if types[i] === Type.radio}
      <span>{labels[i]}</span>
      <radio
      bind:this={doms[i]}
      {...props[i]}
       />
    {:else if types[i] === Type.multi_select}
    	<div>
     		<span>{labels[i]}</span>
     		<TableForm  bind:values={f} {...props[i]} multiSelect={true}/>
     	</div>
    {/if}
    <!-- Description -->
    {#if description[i]}
      {description[i]}
    {/if}
{/each}