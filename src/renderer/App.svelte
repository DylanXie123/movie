<script lang="ts">
  import Router, { link } from "svelte-spa-router";
  import Home from "./home/index.svelte";
  import Detail from "./detail/index.svelte";
  import Ignore from "./ignore/index.svelte";
  import Settings from "./settings/index.svelte";

  const routes = {
    "/": Home,
    "/detail/:id": Detail,
    "/ignore": Ignore,
    "/settings": Settings,
  };
</script>

<nav
  class="navbar navbar-expand-lg navbar-dark sticky-top bg-dark navbar-border"
>
  <div class="container-fluid">
    <a class="navbar-brand me-auto p-2" href="/" use:link>
      <i class="bi bi-film" />
      <span>MovieDB</span>
    </a>
    <button
      class="navbar-toggler m-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div
      class="collapse navbar-collapse px-2 px-lg-0"
      id="navbarSupportedContent"
    >
      <div class="navbar-nav ms-auto mb-2 mb-lg-0 me-0 me-lg-2">
        <a class="nav-link" aria-current="page" href="/" use:link>
          <i class="bi bi-gear-wide-connected" />
          <span class="collapse" id="navbarSupportedContent">Settings</span>
        </a>
      </div>
      <div class="d-flex me-0 me-lg-5 mb-2 mb-lg-0">
        <input
          class="input rounded-pill form-control form-control-sm"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
      </div>
    </div>
  </div>
</nav>

<Router {routes} />

<style lang="scss">
  .navbar-border {
    border-bottom: 1px solid;
    border-color: rgba($color: #adb5bd, $alpha: 0.3);
  }
</style>
