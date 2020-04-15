<script lang="ts">
  /**
   * Wrap everything inside Notification Component
   * display routes when loaded else show load awesome circles(but its not displayed because of lagging css)
   *
   * Internal:
   * remove template.html's loading svg
   * fetch routes
   * replace routes component(Heart of the app)

   * todo\ Make all project follow The A11Y Project https://a11yproject.com/
   */
  import { onMount, onDestroy } from 'svelte';
  import { curry, pipe } from 'ramda';
  import { map } from 'rambda';
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
  import { Router } from '../thirdparty/svelte-router-spa/index';
  import Notifications from '../thirdparty/svelte-notifications/src/index';
  import TreeSidebar from './components/UI/TreeSidebar.svelte';

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

  let email;
  $: email = $current_member?.email;
  const isSubdmomain = window.location.hostname.split('.').length > 2;
  let guest_menu = [
    {
      name: 'Register',
      path: '/super_register'
    },
    {
      name: 'Login',
      path: '/super_login'
    }
  ];
  let subdomain_guest_menu = [
    {
      name: 'Register',
      path: '/register'
    },
    {
      name: 'Login',
      path: '/login'
    }
  ];
  let public_menu = [
    {
      name: 'Contact',
      path: '/contact'
    },
    {
      name: 'About',
      path: '/about'
    }
  ];
  css_count.increase('all_menu');

  let routes = [];

  onMount(() => {
    const loading_div = document.getElementsByClassName('loading-placeholder')[0];
    if (loading_div) loading_div.remove();
  });

  onDestroy(
    Ws.bindT(
      form_schema_evt(Ws.uid),
      d => {
        if (d[0].routes) routes = map(x => modifyObj(x), d[0].routes);
      },
      ['routes'],
      0
    )
  );
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

  const modifyObj = o => {
    const C = {
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
    const Guards = {
      userIsAdmin: () => true,
      isNotLoggedIn: async () => !(await isLoggedIn())[0],
      isLoggedIn: async () => (await isLoggedIn())[0]
    };
    const get_component = k => {
      if (k == '' || k == undefined) return;
      const c = C[k];
      if (!c) console.error('No Component Found For key: ', k);
      return c;
    };
    const get_guard = k => {
      const c = Guards[k];
      if (!c) console.error('No Guard Found For key: ', k);
      return c;
    };
    const modify_component = curry((k, o) => {
      let c = get_component(o[k]);
      if (c) o[k] = c;
      return o;
    });
    const modify_guard = o => {
      if (o.onlyIf) {
        let g = get_guard(o.onlyIf.guard);
        if (g) o.onlyIf.guard = g;
      }
      return o;
    };
    const modify_nested = o => {
      if (o.nestedRoutes) o.nestedRoutes = map(x => modifyObj(x), o.nestedRoutes);
      return o;
    };
    o = pipe(modify_component('component'), modify_component('layout'), modify_guard, modify_nested)(o);
    return o;
  };
  let css_loaded = false;
  $: {
    if (!css_loaded) {
      if (!$css_loading) {
        css_loaded = true;
      }
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>

{#if process.env.NODE_ENV == 'development'}
  <button on:click={_ => ($is_production = !$is_production)}>Toogle Production</button>
{/if}

<Notifications>
  {#if css_loaded}
    <TopLevelComps />
    {#if public_menu.length}
      <TreeSidebar class="public" menu={public_menu} />
    {/if}
    {#if email}
      <TopMenu />
    {:else if isSubdmomain}
      <TreeSidebar class="subdomain_guest" menu={subdomain_guest_menu} />
    {:else}
      <TreeSidebar class="guest" menu={guest_menu} />
    {/if}
  {/if}
  {#if routes.length}
    <Router {routes} />
  {:else}
    <LoadAwesome />
  {/if}
</Notifications>
