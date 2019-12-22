<script>
  import qs from "qs";
  import {Table} from './components/index.js'
  import {getTableOptions} from './modules/table_options.js'
  export let table;
  export let location;
  
  let queryParams;
  let options = {}
  $: {
	//queryParams = qs.parse(location.search.substr(1));
  queryParams = table
  options = getTableOptions(queryParams)
  console.log(options)
  }
</script>

<svelte:head>
  <title>{options.title}</title>
</svelte:head>


  <h1>{options.title}</h1>
  <Table
    {...options.table} />

