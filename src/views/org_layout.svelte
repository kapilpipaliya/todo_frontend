<script lang="ts">
  import { onMount, onDestroy, getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { Ws, ws_connected } from '../ws_events_dispatcher';
  import { is_production, ET, E, ValueType } from '../enums';
  declare let $ws_connected;
  declare let $is_production;
  import { clone } from 'rambda';
  import { Route } from '../../thirdparty/svelte-router-spa/index';
  import TreeSidebar from '../components/UI/TreeSidebar.svelte';
  import UrlPattern from 'url-pattern';
  import Skeleton from '../components/UI/Skeleton.svelte';
  export let currentRoute;
  const org_id = currentRoute.namedParams.org;
  const org_id_ctx = writable(org_id);
  const org_data_ctx = writable({});
  declare let $org_data_ctx;
  setContext('org_id', org_id_ctx);
  setContext('org_data', org_data_ctx);
  const project_ctx = writable([]);
  declare let $project_ctx;
  setContext('project', project_ctx);
  let mounted = false;
  let er = '';
  let org_fetch_evt = [ET.get, E.organization_list, Ws.uid];
  let items = [];
  let organization_menu = [];
  let fetch_data = false;
  onMount(() => {
    mounted = true;
  });
  onDestroy(() => {
    // be very careful: top level component unmount first.
    $project_ctx.pop();
  });
  Ws.bind$(
    org_fetch_evt,
    d => {
      const result = d[1].r.result;
      if (result.length == 0) {
        er = 'no organization found';
      } else if (result[0]) {
        const org_data = result[0];
        $org_data_ctx = org_data;
        $project_ctx = [org_data]; // assume that first subscribed to ws_connected trigger first.
        fetch_data = true;
        return;
      }
      er = 'cant set organization data';
    },
    1
  );

  let OldMenu;

  const getMenuDataGet = all => {
    // if (isLoading) isLoading = false
    const [h, d] = all;
    if (h === false) {
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
    let idx = findIdx('organization');
    if (idx > -1) {
      OldMenu = items[idx].menu;
      organization_menu = processMenu(clone(OldMenu), org_id);
    }
  }

  onDestroy(
    Ws.bindT(
      [ET.subscribe, E.menu_list, Ws.uid],
      d => {
        getMenuDataGet(d);
        fetch_data = true; // not important on menu
      },
      [
        [`['organization']`],
        [],
        [0, 0, 0],
        {
          type: ValueType.Object
        }
      ],
      1
    )
  );

  $: if (mounted) {
    if ($ws_connected) {
      er = '';
      if (org_id) {
        const args = [
          [null, `="${org_id}"`],
          [],
          [0, 0, 1],
          { type: ValueType.Object }
        ];
        Ws.trigger([[org_fetch_evt, args]]);
      } else {
        er = 'Please Select Organization';
      }
    } else {
      er = 'Reconnecting...';
    }
  }

  function processMenu(menu_, org) {
    if (!org) {
      er = 'org key must not be empty when processing menu';
      return [];
    }
    for (let x of menu_) {
      x.path = new UrlPattern(x.path).stringify({ org });
      if (x.children) {
        x.children = processMenu(x.children, org);
      }
    }
    return menu_;
  }
  // enable this when need:
  //$: {menus = processMenu(R.clone(Oldmenu), org_id) }
</script>

{#if !$is_production}ORGANIZATION LAYOUT{/if}
<div style="display: flex">
  <h4>Selected Organization:&nbsp</h4>
  <h3>{org_id}</h3>
</div>
<div style="display: flex">
  <div>
    {#if organization_menu.length}
      <TreeSidebar menu={organization_menu} />
    {/if}
  </div>
  {#if fetch_data}
    <Route {currentRoute} />
  {:else}
    <Skeleton />
  {/if}
</div>
