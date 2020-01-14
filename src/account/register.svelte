<script>
  import { onMount, S, domainName, event_type as et, events as e, Unique } from '../modules/functions.ts'
  import GeneralForm from '../components/form/Index.svelte'
  import { navigateTo } from '../components/svelte-router-spa/src/index.ts'
  export let query = {}
  //let form = { email: '', pass: '' }
  export const registerMutateEvents = (id=0) => {
    return [
      null,
      null,
      [et.mutate, e.account, e.register_user, Unique.id],
    ]
  }
  onMount(()=> {
    // 1. If subdomain open this page move to main page:
    // i found logic from: https://github.com/vemarav/subdomains/blob/master/plugin/index.js
    /*
    let hostNameArray = page.host.split('.')
    const sliceLength = domainName ? domainName.split('.').length : 2
    hostNameArray = hostNameArray.slice(0, hostNameArray.length - sliceLength)
    if (hostNameArray.length)
      navigateTo('http://' + domainName + '/account/register')
    */
  })
</script>

{#if query.message}
  <span class={query.type}>{query.message}</span>
{/if}

<GeneralForm eventsFn={registerMutateEvents} key={null} schema_key={'register'} />
<p>
  By creating an account you agree to our
  <a href="page/privacy">Terms & Privacy</a>
  .
</p>

<div class="signin">
  <p>
    Already have an account?
    <a href="account/login">Sign in</a>
    .
  </p>
  <p>An account is needed to purchase a product</p>
</div>
