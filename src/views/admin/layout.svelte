<script>
  import { Route } from "svelte-router-spa";

  export let currentRoute;
</script>

<div>
  <h1>Admin Layout</h1>
  <Route {currentRoute} {params} />
</div>