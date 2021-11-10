<script lang="ts">
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import Router, { link } from "svelte-spa-router";
  import Home from "./home/index.svelte";
  import Detail from "./detail/index.svelte";
  import Ignore from "./ignore/index.svelte";

  const routes = {
    "/": Home,
    "/detail/:id": Detail,
    "/ignore": Ignore,
  };
</script>

<nav>
  <a href="/" use:link>Home</a>
  <a href="/ignore" use:link>Ignore</a>
</nav>
<Router {routes} />
