<script lang="ts">
  /**
   * Table wrapper to re render table. its not possible to use same table component without re rendering it.
   *
   */

  import { tick } from 'svelte';
  import Title from './UI/Title.svelte';
  import Table from './UI/Table.svelte';
  import GeneralForm from './form/Index.svelte';
  export let currentRoute;
  let schema_key = '';
  let fetchConfig = {}
  // get schema_key From Route params or namedParams
  $: {
    if (currentRoute?.params && currentRoute?.params?.schema_key) {
      schema_key = currentRoute.params.schema_key;
      fetchConfig = currentRoute.params.fetchConfig;
    } else {
      schema_key = currentRoute?.namedParams?.schema_key ?? '';
    }
  }
  let options;
  $: options = {
    modelcomponent: GeneralForm,
    quickcomponent: GeneralForm,
    schema_key,
    pass: currentRoute?.params?.pass ?? [], // [["context", "org_data", "_key", "org"]]
    query: currentRoute?.queryParams ?? {}
  };
  let show = true;
  async function remount() {
    show = false;
    await tick();
    show = true;
  }
  let isFirst = true;
  $: {
    currentRoute;
    if (!isFirst) {
      remount();
    } else {
      isFirst = false;
    }
  }
</script>

<Title {currentRoute} />
{#if show}
  <div>
    <Table {...options} {fetchConfig}/>
  </div>
{/if}
