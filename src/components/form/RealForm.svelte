<script lang='ts'>
import Checkboxes from './input/Checkboxes.svelte';
import Color from './input/Color.svelte'
import Email from './input/Email.svelte'
import File from './input/File.svelte'
import Hidden from './input/Hidden.svelte'
import Number from './input/Number.svelte'
import Password from './input/Password.svelte'
import Range from './input/Range.svelte'
import Search from './input/Search.svelte'
import Text from './input/Text.svelte'
import Checkbox from './input/Checkbox.svelte'
import Radio from './input/Radio.svelte'
import Textarea from './input/Textarea.svelte'

import TableForm from './tableform/TableForm.svelte'
import Array from './array/Array.svelte'

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
	multi_select,
	text_array
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
		<Color bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.email}
		<Email bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.file}
		<File bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.hidden}
		<Hidden bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.number}
		<Number bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.password}
		<Password bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.range}
		<Range bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.search}
		<Search bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.text}
		<Text bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.checkbox && !Array.isArray(f)}
		<Checkbox bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === Type.checkbox}
		<span>{labels[i]}</span>
    	<Checkboxes  name={labels[i]} bind:value={f} required={required[i]} bind:this={doms[i]} disabled={isDisabled(form_disabled, i)} props={props[i]} />
	{:else if types[i] === Type.radio}
		<Radio />
   {:else if types[i] === Type.textarea}
   		<Textarea />
    {:else if types[i] === Type.select}
      <span>{labels[i]}</span>
      <TableForm bind:this={doms[i]} multiSelect={false} {...props[i]} />
    {:else if types[i] === Type.radio}
      <span>{labels[i]}</span>
      <radio
      bind:this={doms[i]}
      {...props[i]}
       />
    {:else if types[i] === Type.multi_select}
    	<div>
     		<span>{labels[i]}</span>
     		<TableForm  bind:values={f} multiSelect={true} {...props[i]} />
     	</div>
    {:else if types[i] === Type.text_array}
    	<div>
     		<span>{labels[i]}</span>
     		<Array  bind:values={f} disabled={isDisabled(form_disabled, i)} {...props[i]} />
     	</div>
    {/if}
    <!-- Description -->
    {#if description[i]}
      {description[i]}
    {/if}
{/each}