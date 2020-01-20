<script lang='ts'>
  import {  event_type as et,events as e, Unique } from '../modules/functions.ts'

  import {translation} from '../modules/global_stores/translation.ts'
  import * as R from 'ramda'

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

  $: title    = R.view(R.lensPath([schema_key, 'title']), $translation);
  $: subtitle = R.view(R.lensPath([schema_key, 'subtitle']), $translation);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if currentRoute.queryParams.message}
  <span class={currentRoute.queryParams.type}>{currentRoute.queryParams.message}</span>
{/if}

{#if title}
  <div>
    <div>
      <h1>{title}</h1>
    </div>

    {#if subtitle}
    <div>
      <h2>{subtitle}</h2>
    </div>
    {/if}
  </div>
{/if}