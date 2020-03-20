<script lang="ts">
  import { tick } from 'svelte'
  import Title from './UI/Title.svelte'
  import Table from './UI/Table.svelte'
  import GeneralForm from './form/Index.svelte'
  export let currentRoute
  let schema_key = ''
  // get schema_key From Route params or namedParams
  $: {
    if (currentRoute?.params && currentRoute?.params?.schema_key) {
      schema_key = currentRoute.params.schema_key
    } else {
      schema_key = currentRoute?.namedParams?.schema_key ?? ''
    }
  }
  let options
  $: options = {
    modelcomponent: GeneralForm,
    quickcomponent: GeneralForm,
    schema_key,
    pass: currentRoute?.params?.pass ?? [], // [["context", "org_data", "_key", "org"]]
    query: currentRoute?.queryParams ?? {}
  }
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
    <Table {...options} />
  </div>
{/if}
