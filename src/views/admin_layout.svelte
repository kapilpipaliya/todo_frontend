<script lang="ts">
  import { Route } from '../utils/svelte-router-spa/index.ts';
  import { onMount, onDestroy } from 'svelte';
  import { ValueType, ET, E } from '../enums';
  import { Ws, ws_connected } from '../ws_events_dispatcher';
  declare let $ws_connected;
  import TreeSidebar from '../components/UI/TreeSidebar.svelte';
  import Skeleton from '../components/UI/Skeleton.svelte';
  export let currentRoute;

  let er = '';
  let fetch_data = false;
  let items = [];
  let admin_menu = [];

  const getMenuDataGet = d => {
    // if (isLoading) isLoading = false
    if (Array.isArray(d) && !d[0]) {
      //authorized = false
      //er = d
    }
    if (d.r) {
      items = d.r.result ?? [];
    } else if (d.n) {
    } else if (d.m) {
      d.m.result.forEach(mod => {
        const findIndex = items.findIndex(i => {
          return i._key == mod._key;
        });
        if (findIndex !== -1) {
          // start, ?deleteCount, ...items
          items.splice(findIndex, 1, mod);
        }
      });
      items = items;
    } else if (d.d) {
    }
  };
  const findIdx = name => {
    const findIndex = items.findIndex(i => {
      return i._key == name;
    });
    return findIndex;
  };
  $: {
    let idx = findIdx('admin');
    if (idx > -1) admin_menu = items[idx].menu;
  }

  onDestroy(
    Ws.bindT(
      [ET.subscribe, E.menu_list, Ws.uid],
      d => {
        getMenuDataGet(d);
        fetch_data = true; // not important on menu
      },
      [
        [`['admin']`],
        [],
        [0, 0, 0],
        {
          type: ValueType.Object
        }
      ],
      1
    )
  );
</script>

ADMIN LAYOUT
<div style="display: flex">
  <div>
    {#if admin_menu.length}
      <TreeSidebar menu={admin_menu} />
    {/if}
  </div>
  {#if fetch_data}
    <Route {currentRoute} />
  {:else}
    <Skeleton />
  {/if}
</div>
