<script lang="ts">
  /**
    * This Component does 2 thigs:
    * 1. Wait for confirmation to be done and redirect to /
    * 2. show the confirmation status. user can request reconfirmation email

    /todo if member is already confirmed and visit this page, it should say that email is alreay verified.
    /todo add confirmation page in menu if not confirmed, to resend verification email.
    */

  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { ET, E } from '../enums';
  import { Ws, ws_connected } from '../ws_events_dispatcher';
  import Error from '../components/UI/Error.svelte';
  export let currentRoute;

  let er = '';
  let header = '';
  let subtitle = '';
  let confirming = true;
  let result_title = '';

  const uid = Ws.uid;
  onDestroy(
    Ws.bindT(
      [ET.subscribe, E.confirm_email_status, uid],
      d => {
        if (d[0]) {
          confirming = false;
          result_title = 'Confirmed';
          er = 'Email Successfully confirmed.';
        } else {
          result_title = 'Error';
          er = d.error;
        }
      },
      null,
      0
    )
  );
  onDestroy(_ =>
    Ws.trigger([[[ET.unsubscribe, E.confirm_email_status, uid], {}]])
  );

  /** try to confirm email */
  if (currentRoute.queryParams.token) {
    onDestroy(
      Ws.bindT(
        [ET.insert, E.confirm_email, Ws.uid],
        d => {
          if (d[0]) {
            confirming = false;
            header = 'Confirmed';
            er = 'Email Successfully confirmed';
          }
        },
        currentRoute.queryParams,
        0
      )
    );
  }

  if (currentRoute.queryParams.token) {
    header = 'Confirming';
    subtitle = 'Please wait ...';
  } else {
    header = 'Email Verification';
    subtitle = 'Please check your inbox to verify email.';
  }
</script>

{#if confirming}
  <div class="header">
    <h1>{header}</h1>
    <p>{subtitle}</p>
  </div>
{:else}
  <div class="header">
    <h1>{result_title}</h1>
    <Error {er} />
  </div>

  <div class="signin">
    <p>
      Sign in
      <a href="account/login">Sign in</a>
      .
    </p>
  </div>
{/if}
