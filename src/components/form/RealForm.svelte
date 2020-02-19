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
//import CodeMirror from './input/codemirror/CodeMirror.svelte'
import DropZone from './input/DropZone.svelte'
import DateRange from './input/DateRange.svelte'
//import Prosemirror from './input/Prosemirror.svelte'
// import CLEditor from './input/CLEditor.svelte'

import TableForm from './tableform/TableForm.svelte'
import ArrayForm from './array/Array.svelte'

import {FormType} from '../../modules/enums'
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

function getComponent(t){
    if(t === FormType.color) {
      return Color
    } else if (t === FormType.email) {
      return Email
    } else if (t === FormType.file) {
      return File
    } else if(t === FormType.hidden) {
      return Hidden 
    } else if(t === FormType.number) {
      return Number 
    } else if(t === FormType.password) {
      return Password 
    } else if(t === FormType.range) {
      return Range 
    } else if(t === FormType.search) {
      return Search 
    } else if(t === FormType.text) {
      return Text 
    } else if(t === FormType.checkbox) {
      return Checkbox 
    } else if(t === FormType.checkboxes) {
      return Checkboxes  
    } else if(t === FormType.radio) {
      return Radio
    } else if(t === FormType.textarea) {
      return Textarea 
    } else if(t === FormType.select) {
      return TableForm  //multiSelect={false}
    } else if(t === FormType.radio) {
      //return radio 
    } else if(t === FormType.multi_select) {
      return TableForm //multiSelect={true}
    } else if(t === FormType.text_array) {
      return ArrayForm  
    } else if(t === FormType.multi_select_bool_properties) {
      return TableForm // multiSelect={true} // boolprop={true}
    } else if(t === FormType.jsoneditor) {
      return JsonEditor
    } else if(t === FormType.codemirror) {
      //return CodeMirror
      return Textarea
    } else if(t === FormType.flatpicker) {
      return Flatpicker
    } else if(t === FormType.multi_select_hidden || t === FormType.save_time) {
      //return Empty
    } else if(t === FormType.dropzone) {
      return DropZone
    } else if(t === FormType.daterange) {
      return DateRange
    } else if(t === FormType.prosemirror) {
      //return Prosemirror
    } else if(t === FormType.cleditor) {
      //reutn CLEditor
    } else {
      return 'Unknown Component'
    }
}

</script>
{#each form as f, i}
  {#if types[i]}
    <svelte:component
      this={getComponent(types[i])}
      bind:value={f}
      name={labels[i]}
      required={required[i]}
      disabled={isDisabled(form_disabled, i)}
      bind:dom={doms[i]}
      {...props[i]}
    />

    {#if description[i]}
      {description[i]}
    {/if}
  {/if}
{/each}
