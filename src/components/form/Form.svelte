<script lang='ts'>
import { onMount, onDestroy } from '../../modules/index'
import RealForm from './RealForm.svelte'

import SubmitButton from './_SubmitButton.svelte'
import CancelButton from './_CancelButton.svelte'
export let key
export let isSaving
export let headers
export let form
export let form_disabled = true
export let save = ()=>0
export let buttonlabels = {save: "", cancel : ""}
export let showCancel = true
export let onReset
import { Debug, showDebug } from '../debug'

import { css_count } from '../../modules/global_stores/css'
declare let $css_count

let saveLabel = buttonlabels?.save ?? ""
let cancelLabel = buttonlabels?.cancel ?? ""
// export let options = {}

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
   $css_count.submit_buttons = ($css_count.submit_buttons || 0) + 1
})
onDestroy(() => {
  $css_count.submit_buttons = $css_count.submit_buttons - 1
})

</script>
<label>debug</label><input type=checkbox bind:checked={$showDebug} />
{#if form.length}
	<form on:submit|preventDefault={save}>
	  <RealForm
	  	{key}
	  	bind:form={form} {form_disabled}
	  	{labels} {types} {required} {disabled} {description} {props} bind:doms={doms}
	  />
	  <footer>
	    <SubmitButton isSaving={isSaving} label={saveLabel} />
	    {#if showCancel}
	    	<CancelButton isSaving={isSaving} {key} on:close label={cancelLabel} />
	    {/if}
	    {#if false}<button type='button' on:click={onReset}>Reset</button>{/if}
	  </footer>
	</form>
{/if}