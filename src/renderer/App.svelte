<script lang="ts">
  import Router from "svelte-spa-router";
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

<nav class="navbar navbar-expand-lg navbar-dark border-bottom-grey border-2">
  <div class="container-fluid">
    <a class="navbar-brand me-auto p-2" href="/">
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
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <div class="navbar-nav ms-auto mb-2 mb-lg-0 me-0 me-lg-2">
        <a class="nav-link" aria-current="page" href="/">
          <i class="bi bi-gear-wide-connected" />
          <span class="collapse" id="navbarSupportedContent">Settings</span>
        </a>
      </div>
      <div class="d-flex me-0 me-lg-5">
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
