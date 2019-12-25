<script>
  import qs from "qs";
  import {Table} from './components/index.js'
  import {getTableOptions} from './modules/table_options.js'
  import {translation} from './modules/global_stores/translation.js'
  import * as R from 'ramda'

  export let currentRoute
  //export let location;
  
  let options = {}
  let schema_key = ''
  $: {
	//queryParams = qs.parse(location.search.substr(1));
  if(currentRoute.params && currentRoute.params.table) {
    schema_key = currentRoute.params.table
    options = getTableOptions(schema_key)
  } else {
    schema_key = currentRoute.namedParams.table || ''
    options = getTableOptions(schema_key)
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

<svelte:head>
  <title>{R.view(R.lensPath([schema_key, 'title']), $translation)}</title>
</svelte:head>
  <div>
  <div>
    <h1>{R.view(R.lensPath([schema_key, 'title']), $translation)}</h1>
  </div>
  <div>
    <h2>{R.view(R.lensPath([schema_key, 'subtitle']), $translation)}</h2>
  </div>
  <Table
    {...options.table} />
  </div>
