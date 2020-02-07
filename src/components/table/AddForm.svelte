<script lang='ts'>
  export let toogleAddForm
  export let doms
  export let addnewform
  export let quickcomponent
  export let schema_key
  export let successSave
  export let addnew_type
  export let addnew_labels

  // let saveLabel = addnew_labels?.save ?? "Save Changes"
  // let cancelLabel = addnew_labels?.cancel ?? "Cancel"

</script>
{#if addnew_type == "button"}
  <button
    name="table_add"
    on:click={toogleAddForm}
    bind:this={doms.addbutton}
    class={addnewform ? 'pressed' : ''}>
    {!addnewform ? 'Add New' : 'Close'}
  </button>
  {#if addnewform}
    <svelte:component
      this={quickcomponent}
      key={null}
      {schema_key}
      on:close={toogleAddForm}
      on:successSave={successSave} 
      buttonlabels={addnew_labels}/>
  {/if}
{:else}
    <svelte:component
      this={quickcomponent}
      key={null}
      {schema_key}
      on:close={toogleAddForm}
      on:successSave={successSave} 
      buttonlabels={addnew_labels}/>
{/if}