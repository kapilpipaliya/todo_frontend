<script lang='ts'>
  export let toogleAddForm
  export let doms
  export let addnewform
  export let quickcomponent
  export let schema_key
  export let successSave

</script>

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
      on:successSave={successSave} />
  {/if}