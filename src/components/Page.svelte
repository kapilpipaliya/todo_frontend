<script lang='ts'>
  import { tick } from '../modules/index'
  import Title from './UI/Title.svelte'
  import Table from './table/Table.svelte'
  import GeneralForm from './form/Index.svelte'
  export let currentRoute
  let schema_key = ''
  $: {
  	// get schema_key From Route params or namedParams
    if(currentRoute?.params && currentRoute?.params?.schema_key) {
      schema_key = currentRoute.params.schema_key
    } else {
      schema_key = currentRoute?.namedParams?.schema_key ?? ''
    }
  }
  /*  export let accountFilter = {};
  let customFilter = {
  1 : accountFilter
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
  class A {isFirst = true}
  const a = new A
  async function remount1(){
    show = false
    await tick()
    show = true
  }
  $: {
    (currentRoute)
    if(!a.isFirst){ remount1()} else {a.isFirst = false}
  }
</script>
<Title {currentRoute}/>
{#if show}
  <div>
    <Table {...options} {pass} />
  </div>
{/if}