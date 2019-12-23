<script>
  import qs from "qs";
  import {Table} from './components/index.js'
  import {getTableOptions} from './modules/table_options.js'
  export let currentRoute
  //export let location;
  
  let queryParams;
  let options = {}
  $: {
	//queryParams = qs.parse(location.search.substr(1));
  queryParams = currentRoute.namedParams.table
  options = getTableOptions(queryParams)
  }
  /*
  export let accountFilter = {};
  let customFilter = {
  1 : accountFilter
  };
  */
</script>

<svelte:head>
  <title>{options.title}</title>
</svelte:head>


  <h1>{options.title}</h1>
  <Table
    {...options.table} />

