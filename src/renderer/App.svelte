<script lang="ts">
  import Router, { link } from "svelte-spa-router";
  import Home from "./home/index.svelte";
  import viewState, { View } from "./home/viewState";
  import Settings from "./settings/index.svelte";

  const routes = {
    "/": Home,
    "/settings": Settings,
  };

  const toggleView = () =>
    viewState.update((v) => (v === View.Grid ? View.Column : View.Grid));
</script>

<div class="d-flex flex-column vh-100">
  <nav
    class="navbar navbar-expand-lg navbar-dark sticky-top bg-dark border-bottom border-light"
  >
    <a class="navbar-brand me-auto p-2" href="/" use:link>
      <i class="bi bi-film" />
      <span>MovieDB</span>
    </a>
    <span class="nav-link" role="button" on:click={toggleView}>
      <i class="bi bi-shuffle" />
    </span>
    <a class="nav-link" href="/settings" use:link>
      <i class="bi bi-gear-wide-connected" />
    </a>
  </nav>

  <div class="flex-grow-1 overflow-hidden">
    <Router {routes} />
  </div>
</div>
