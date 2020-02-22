<script lang='ts'>
import { FormType } from '../../modules/enums'

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

export let value
export let type = FormType.text
export let label = ''
export let required = false
export let disabled = false
export let description = ''
export let props = {}
export let doms = {}


const extraProps = {}
if(type === FormType.select) {
  extraProps.multiSelect = false
} else if(type === FormType.multi_select) {
  extraProps.multiSelect= true
} else if(type === FormType.multi_select_bool_properties) {
  extraProps.multiSelect = true
  extraProps.boolprop = true
}

function getComponent(){
    if(type === FormType.color) {
      return Color
    } else if (type === FormType.email) {
      return Email
    } else if (type === FormType.file) {
      return File
    } else if(type === FormType.hidden) {
      return Hidden 
    } else if(type === FormType.number) {
      return Number 
    } else if(type === FormType.password) {
      return Password 
    } else if(type === FormType.range) {
      return Range 
    } else if(type === FormType.search) {
      return Search 
    } else if(type === FormType.text) {
      return Text 
    } else if(type === FormType.checkbox) {
      return Checkbox 
    } else if(type === FormType.checkboxes) {
      return Checkboxes  
    } else if(type === FormType.radio) {
      return Radio
    } else if(type === FormType.textarea) {
      return Textarea 
    } else if(type === FormType.select) {
      return TableForm
    } else if(type === FormType.radio) {
      //return radio 
    } else if(type === FormType.multi_select) {
      return TableForm
    } else if(type === FormType.text_array) {
      return ArrayForm  
    } else if(type === FormType.multi_select_bool_properties) {
      return TableForm
    } else if(type === FormType.jsoneditor) {
      return JsonEditor
    } else if(type === FormType.codemirror) {
      //return CodeMirror
      return Textarea
    } else if(type === FormType.flatpicker) {
      return Flatpicker
    } else if(type === FormType.multi_select_hidden || type === FormType.save_time) {
      //return Empty
    } else if(type === FormType.dropzone) {
      return DropZone
    } else if(type === FormType.daterange) {
      return DateRange
    } else if(type === FormType.prosemirror) {
      //return Prosemirror
    } else if(type === FormType.cleditor) {
      //reutn CLEditor
    } else {
      console.warn('Unknown Component type: ', type)
      return Hidden 
    }
}
let comp = getComponent()
</script>
  <svelte:component
    this={comp}
    bind:value={value}
    name={label}
    {required}
    {disabled}
    bind:dom={doms}
    {...props}
    {...extraProps}
  />
  {#if description}
    {description}
  {/if}