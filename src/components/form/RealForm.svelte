<script lang='ts'>
import { getContext, get } from '../../modules/index'
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
import JsonEditor from './input/JsonEditor.svelte'
import Flatpicker from './input/Flatpicker.svelte'
import CodeMirror from './input/codemirror/CodeMirror.svelte'
import DropZone from './input/DropZone.svelte'
import DateRange from './input/DateRange.svelte'

import TableForm from './tableform/TableForm.svelte'
import ArrayForm from './array/Array.svelte'
import Label from './_Label.svelte'
import * as RA from 'ramda-adjunct'
import * as RD from 'rambda'
//import * as RD from 'ramda'

export let form
export let key
export let form_disabled = true

export let labels = []
export let types: number[] = []
export let required = []
export let disabled = []
export let description = []
export let props = []

export let doms = {}

  enum FormType {
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
    inserted_time,
    updated_time,
    url,
    week,
    textarea,
    select,
    jsoneditor,
    internal_true_edge,
    multi_select,
    multi_select_hidden, // not added input yet
    text_array,
    multi_select_bool_properties,
    flatpicker,
    WYSIWYG,
    serial,
    codemirror,
    save_time,
    inserted,
    updated,
    dropzone,
    daterange
  };


const isDisabled = (form_disabled_, i) =>{
	if(form_disabled_ === true) {
		return true
	} else {
		return disabled[i]
	}
}
function isArray(val){
	return RA.isArray(val)
}

$: {
  if(!key) {
    if(Array.isArray(form)) {
      for(let i = 0; i < form.length ; i++){
        if(Array.isArray(form[i]) && form[i].length > 0){
          let e = form[i]
          if(Array.isArray(e) && e.length > 0){
            for(let j = 0; j < e.length ; j++){
              let f = e[j]
              console.log(f)
              if(typeof f[0] == 'string'){
                const func = f[0]
                if(func == 'fnSetContext'){
                  if(f.length > 1){
                    const key = f[1]
                    form[i] = get(getContext(key))
                    continue
                  }
                } else if(func == 'fnSetContextKey'){
                  if(f.length > 1){
                    const key = f[1]
                    let objKey
                    if(f.length > 2){
                      objKey = f[2]
                    } else {
                      objKey = "_key"
                    }
                    console.log(key)
                    console.log(getContext(key))
                    form[i] = get(getContext(key))[objKey]
                    continue
                  }
                } else if(func == 'fnSetContextKeyInArray'){
                  if(f.length > 1){
                    const key = f[1]
                    let objKey
                    if(f.length > 2){
                      objKey = f[2]
                    } else {
                      objKey = "_key"
                    }
                    console.log(key)
                    console.log(getContext(key))
                    form[i] = [get(getContext(key))[objKey]]
                    continue
                  }
                }

              }
            }
          }
        }
      }
    }
  }
}



</script>
{#each form as f, i}
	{#if types[i]}
	{#if types[i] === FormType.color}
		<Color bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.email}
		<Email bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.file}
		<File bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.hidden}
		<Hidden bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.number}
		<Number bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.password}
		<Password bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.range}
		<Range bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.search}
		<Search bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.text}
		<Text bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.checkbox && !isArray(f)}
		<Checkbox bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]} />
	{:else if types[i] === FormType.checkbox}
		<Label name={labels[i]} />
    	<Checkboxes  name={labels[i]} bind:value={f} required={required[i]} bind:this={doms[i]} disabled={isDisabled(form_disabled, i)} props={props[i]} />
	{:else if types[i] === FormType.radio}
		<Radio />
   {:else if types[i] === FormType.textarea}
   		<Textarea bind:value={f} name={labels[i]} required={required[i]} disabled={isDisabled(form_disabled, i)} bind:dom={doms[i]} {...props[i]}/>
    {:else if types[i] === FormType.select}
      <Label name={labels[i]} />
      <TableForm bind:values={f} bind:this={doms[i]} multiSelect={false} {...props[i]} />
    {:else if types[i] === FormType.radio}
      <Label name={labels[i]} />
      <radio bind:this={doms[i]}  {...props[i]} />
    {:else if types[i] === FormType.multi_select}
    	<div>
     		<Label name={labels[i]} />
     		<TableForm  bind:values={f} multiSelect={true} disabled={isDisabled(form_disabled, i)} {...props[i]} />
     	</div>
    {:else if types[i] === FormType.text_array}
    	<div>
     		<Label name={labels[i]} />
     		<ArrayForm  bind:values={f} disabled={isDisabled(form_disabled, i)} {...props[i]} />
     	</div>
    {:else if types[i] === FormType.multi_select_bool_properties}
    	<div>
     		<Label name={labels[i]} />
     		<TableForm  bind:values={f} multiSelect={true} disabled={isDisabled(form_disabled, i)} boolprop={true} {...props[i]} />
     	</div>
    {:else if types[i] === FormType.jsoneditor}
      <Label name={labels[i]} />
      <JsonEditor bind:value={f} disabled={isDisabled(form_disabled, i)} {...props[i]} />
    {:else if types[i] === FormType.codemirror}
      <Label name={labels[i]} />
      <CodeMirror bind:value={f} code={f} disabled={isDisabled(form_disabled, i)} {...props[i]} />
    {:else if types[i] === FormType.flatpicker}
      <Label name={labels[i]} />
      <Flatpicker bind:value={f} disabled={isDisabled(form_disabled, i)} {...props[i]} />
    {:else if types[i] === FormType.multi_select_hidden}
      <div></div>
    {:else if types[i] === FormType.save_time}
      <div></div>
    {:else if types[i] === FormType.dropzone}
      <DropZone/>
    {:else if types[i] === FormType.daterange}
      <DateRange/>
    {:else}
      Unknown Component
    {/if}
    <!-- Description -->
    {#if description[i]}
      {description[i]}
    {/if}
    {/if}
{/each}
