<script lang='ts'>
  import qs from "qs";
  import {Table} from './components/index.ts'
  import Title from './components/Title.svelte'
  import * as R from 'ramda'

  import GeneralForm from './components/form/Index.svelte'

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
  //console.log($$props) // very helpful.
  /*
  export let accountFilter = {};
  let customFilter = {
  1 : accountFilter
  };
  */
</script>

<Title {currentRoute}/>

<div>
  <Table {...options} />
</div>
