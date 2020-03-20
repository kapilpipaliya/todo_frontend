<script lang="ts">
  import { tick } from 'svelte'
  import Title from './UI/Title.svelte'
  import Table from './table/Table.svelte'
  import GeneralForm from './form/Index.svelte'
  export let currentRoute
  let schema_key = ''
  $: {
    // get schema_key From Route params or namedParams
    if (currentRoute?.params && currentRoute?.params?.schema_key) {
      schema_key = currentRoute.params.schema_key
    } else {
      schema_key = currentRoute?.namedParams?.schema_key ?? ''
    }
  }
  /*let customFilter = {
    1 : {}
  };*/
  let options = {}
  $: {
    options = {
      customFilter: {},
      modelcomponent: GeneralForm,
      quickcomponent: GeneralForm,
      schema_key,
      query: currentRoute?.queryParams ?? {}
    }
  }
  let pass
  $: pass = currentRoute?.params?.pass ?? [] // [["context", "org_data", "_key", "org"]]
  let show = true
  async function remount() {
    show = false
    await tick()
    show = true
  }
  let isFirst = true
  $: {
    currentRoute
    if (!isFirst) {
      remount()
    } else {
      isFirst = false
    }
  }
</script>

<Title {currentRoute} />
{#if show}
  <div>
    <Table {...options} {pass} />
  </div>
{/if}
