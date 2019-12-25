<script context="module">
  import { S as S_, ws_todo, domainName } from '../_modules/functions.js'
  export async function preload(page, session) {
    // let S; if (typeof S_ == "function") { S = new S_(ws_todo, this.req, this.res); } else { S = S_; }
    // let user = session.user; if(!!user){ this.redirect(302, '/confirmation') }

    //const isAuth = await new Promise((resolve, reject) => { S.bind_( ["user", `is_logged_in`, 0], ([d]) => { resolve(d); }, [[]] ); });
    //if(isAuth){ this.redirect(302, redirect_url) }
    const isAuth = false

    // i found logic from: https://github.com/vemarav/subdomains/blob/master/plugin/index.js
    let hostNameArray = page.host.split('.')
    const sliceLength = domainName ? domainName.split('.').length : 2
    hostNameArray = hostNameArray.slice(0, hostNameArray.length - sliceLength)

    if (hostNameArray.length)
      this.redirect(302, 'http://' + domainName + '/account/register')

    const redirect_url = '/'
    const categories = {} // top menu
    const footerData = {}
    const headerData = { company: 'SCE Project Management' }
    return { isAuth, redirect_url, query: page.query, headerData }
  }
</script>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte'
  import { goto } from '@sapper/app'
  const dp = createEventDispatcher()
  import { S } from '../_modules/functions.js'

  export let isAuth = false
  export let redirect_url = '/'
  export let query = {}
  export let headerData = {}

  let isSaving = false
  let er = ''
  let form = { email: '', pass: '' }
  let countries
  let formSave = false
  let email = null // to focus
  const fns = [['account', 'register', 0]]
  //let S;

  $: isAuth = formSave
  $: {
    if (isAuth) {
      goto(redirect_url)
    }
  }
  function saveCookie(d) {
    // read more: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    document.cookie = `time=${d.cookie}; path=/; max-age=${d.max_age}`
    document.cookie = `server=${d.server}; path=/; max-age=${d.max_age}`
  }

  onMount(async () => {
    //{categories} {isAuth} {footerData} {headerData} -> store
    //const { Server: S_ } = await import("../../_modules/ws_user.js");
    //if (typeof S_ == "function") { S = new S_(); } else { S = S_; }

    S.bind$(
      fns[0],
      ([d]) => {
        isSaving = false
        if (d.ok) {
          er = ''
          saveCookie(d)
          formSave = true
          dp('successSave', { d })
        } else {
          er = d.error
        }
      },
      1
    )
    //fns.push(["auth", "set_cookie", 0]); S.bind$(fns.i(-1), ([d]) => { document.cookie = `user=${d.user}; path=/`; getCookie = true; }, 1)

    // check it already logged in
    // isAuth = await isLoggedIn(S)

    setTimeout(function() {
      email.focus()
    }, 100)
  })
  onDestroy(() => {
    S.unbind_(fns)
  })

  const save = async () => {
    isSaving = true
    S.trigger([[fns[0], form]])
  }
  const clearError = () => {
    er = ''
  }

  // Todo: When login on subdomain, server field do not show.
</script>

<style>

</style>

<svelte:head>
  <title>{headerData.company} - Register</title>
</svelte:head>

{#if query.message}
  <span class={query.type}>{query.message}</span>
{/if}
{#if !isAuth}
  <div class="container">
    <div class="row">
      <div class="box">

        <h3>Registration</h3>
        <form on:submit|preventDefault={save}>
          <table>
            <tbody>
              <tr>
                <td>Email</td>
                <td>
                  <input
                    type="email"
                    bind:value={form.email}
                    bind:this={email} />
                </td>
              </tr>
              <tr>
                <td>Password</td>
                <td>
                  <input type="password" bind:value={form.pass} />
                </td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center;">
                  <button
                    type="submit"
                    class="registerbtn"
                    disabled={!form.email || !form.pass}>
                    Register
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <p>
            By creating an account you agree to our
            <a href="page/privacy">Terms & Privacy</a>
            .
          </p>
        </form>

      </div>

    </div>
  </div>

  <div>{er}</div>

  <div class="signin">
    <p>
      Already have an account?
      <a href="account/login">Sign in</a>
      .
    </p>
    <p>An account is needed to purchase a product</p>
  </div>
{:else}
  {#if false}
    <a href="account/logout">Logout</a>
  {/if}
  <div class="header">
    <a href="./">
      <h1>Logged in successfully</h1>
    </a>
    <p>Now you can visit and explore website with aditional features</p>
  </div>

  <div class="content" />
{/if}
