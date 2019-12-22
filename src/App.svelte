<script>
	import { Router, Route, Link } from "svelte-routing";
	
</script>

<main>

</main>


<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
  </nav>
  <div class="app">
    <Route path="/about">About</Route>
    <Route path="/">Home</Route>
  </div>
</Router>
