<script lang='ts'>
import { onMount } from '../../modules/functions.ts'
import RealForm from './RealForm.svelte'

import SubmitButton from '../_SubmitButton.svelte'
import CancelButton from '../_CancelButton.svelte'
export let key
export let isSaving
export let headers
export let form
export let form_disabled = true
export let save = ()=>0
export let options = {}

let labels = []
let types: number[] = []
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
	      setTimeout(function(){if(doms[index]) doms[index].focus() }, 200);
		  once = false
	    }
	}
}
onMount(()=> {
   mounted = true
})
</script>

<form on:submit|preventDefault={save}>
  <RealForm
  	bind:form={form} {form_disabled}
  	{labels} {types} {required} {disabled} {description} {props} bind:doms={doms}
  />
  <footer>
    <SubmitButton isSaving={isSaving} />
    <CancelButton isSaving={isSaving} {key} on:close />
  </footer>
</form>