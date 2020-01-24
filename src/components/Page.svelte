<script lang='ts'>
  import Title from './Title.svelte'
  import {Table} from './index.ts'
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

  /*
  export let accountFilter = {};
  let customFilter = {
  1 : accountFilter
  };
  */
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

  let pass = currentRoute?.params?.pass ?? [] // [["context", "org_data", "_key", "org"]]
</script>

<Title {currentRoute}/>

<div>
  <Table {...options} {pass} />
</div>
