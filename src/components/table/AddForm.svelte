<script lang='ts'>
  export let toogleAddForm
  export let doms
  export let addnewform
  export let quickcomponent
  export let schema_key
  export let successSave
  export let addnew_type
  export let addnew_labels
  let showButton = false
  let showComponent = false
  $: {
    showButton = false
    showComponent = false
    if(addnew_type == "button"){
      showButton = true
      if(addnewform){
       showComponent = true 
      }
    } else {
      showComponent = true
    }
  }
</script>
{#if showButton}
  <button
    name="table_add"
    class={addnewform ? 'pressed' : ''}
    bind:this={doms.addbutton}
    on:click={toogleAddForm}
    >
    {!addnewform ? 'Add New' : 'Close'}
  </button>
{/if}
{#if showComponent}
  <svelte:component
    this={quickcomponent}
    key={null}
    {schema_key}
    buttonlabels={addnew_labels}
    on:close={toogleAddForm}
    on:successSave={successSave} 
    />
{/if}
