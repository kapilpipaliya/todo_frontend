<script lang="ts">
  // todo\ Make all project follow The A11Y Project https://a11yproject.com/
  import { onMount, onDestroy } from 'svelte';
  import { translation } from './translation';
  import { current_member } from './current_member';
  declare let $current_member;
  import { css_loading, css_count } from './css';
  declare let $css_loading;
  import TopLevelComps from './components/UI/TopLevelComps.svelte';
  import { is_production, ET, E, form_schema_evt } from './enums';
  declare let $is_production;
  import { Ws } from './ws_events_dispatcher';
  import TopMenu from './TopMenu.svelte';
  import LoadAwesome from './components/UI/LoadAwesome.svelte';
  import { Router } from './utils/svelte-router-spa/index.ts';
  import Notifications from './utils/svelte-notifications/src/index';
  import TreeSidebar from './components/UI/TreeSidebar.svelte';
  import { modifyRoutes } from './utils/process_routes';
  import { isSubDomain, guest_menu, subdomain_guest_menu, public_menu } from './utils/url_functions.ts';

  import Page from './components/Page.svelte';
  import FormWrapper from './components/FormWrapper.svelte';
  import Logout from './views/logout.svelte';
  import Confirm from './views/confirm.svelte';
  import Home from './views/home.svelte';
  import About from './views/about.svelte';
  import Contact from './views/contact.svelte';
  import PublicLayout from './views/public_layout.svelte';
  import AdminLayout from './views/admin_layout.svelte';
  import AdminIndex from './views/admin_index.svelte';
  import OrganizationLayout from './views/org_layout.svelte';
  import OrganizationIndex from './views/org_index.svelte';
  import ProjectLayout from './views/project_layout.svelte';
  import ProjectIndex from './views/project_index.svelte';
  import MyPage from './views/my_page.svelte';
  import AccountLayout from './views/account_layout.svelte';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }

  css_count.increase('all_menu');
  let css_loaded = false;
  $: {
    if (!css_loaded) {
      if (!$css_loading) {
        css_loaded = true;
      }
    }
  }
  onMount(() => {
    const loading_div = document.getElementsByClassName('loading-placeholder')[0];
    if (loading_div) loading_div.remove();
  });

  let email;
  $: email = $current_member?.email;

  let menu = isSubDomain() ? subdomain_guest_menu : guest_menu;
  let menuClass = isSubDomain() ? 'subdomain_guest' : 'guest';

  let routes = [];
  const Components = {
    PublicLayout: PublicLayout,
    Home: Home,
    Contact: Contact,
    About: About,
    Page: Page,
    Form: FormWrapper,
    Logout: Logout,
    Confirm: Confirm,
    AdminLayout: AdminLayout,
    AdminIndex: AdminIndex,
    OrganizationLayout: OrganizationLayout,
    OrganizationIndex: OrganizationIndex,
    ProjectLayout: ProjectLayout,
    ProjectIndex: ProjectIndex,
    MyPage: MyPage,
    AccountLayout: AccountLayout
  };
  const isLoggedIn = async () =>
    await new Promise((resolve, reject) => {
      Ws.bindT(
        [ET.get, E.is_logged_in, Ws.uid],
        (d: [[]]) => {
          resolve(d);
        },
        null
      );
    });
  const Guards = {
    userIsAdmin: () => true,
    isNotLoggedIn: async () => !(await isLoggedIn())[0],
    isLoggedIn: async () => (await isLoggedIn())[0]
  };

  onDestroy(
    Ws.bindT(
      form_schema_evt(Ws.uid),
      d => {
        if (d[0].routes) routes = modifyRoutes(d[0].routes, Components, Guards);
      },
      ['routes'],
      0
    )
  );
</script>

{#if process.env.NODE_ENV == 'development'}
  <button on:click={_ => ($is_production = !$is_production)}>Toogle Production</button>
{/if}

<Notifications>
  {#if css_loaded}
    <TopLevelComps />
    <TreeSidebar class="public" menu={public_menu} />
    {#if email}
      <TopMenu />
    {:else}
      <TreeSidebar class={menuClass} {menu} />
    {/if}
  {/if}
  {#if routes.length}
    <Router {routes} />
  {:else}
    <LoadAwesome />
  {/if}
</Notifications>
