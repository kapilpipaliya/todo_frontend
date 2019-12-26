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
  $: title    = R.view(R.lensPath([schema_key, 'title']), $translation);
  $: subtitle = R.view(R.lensPath([schema_key, 'subtitle']), $translation);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
  <div>
  <div>
    <h1>{title}</h1>
  </div>
  {#if subtitle}
  <div>
    <h2>{subtitle}</h2>
  </div>
  {/if}
  <Table
    {...options.table} />
  </div>
