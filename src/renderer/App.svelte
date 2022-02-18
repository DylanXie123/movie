<script lang="ts">
  import Router, { link } from "svelte-spa-router";
  import Home from "./pages/HomePage/HomePage.svelte";
  import viewState, { View } from "./pages/HomePage/store/viewState";
  import Manage from "./pages/ManagePage/ManagePage.svelte";
  import Settings from "./pages/SettingsPage/SettingsPage.svelte";

  const routes = {
    "/": Home,
    "/settings": Settings,
    "/manage": Manage,
  };

  const toggleView = () =>
    viewState.update((v) => (v === View.Grid ? View.Column : View.Grid));
</script>

<div class="h-screen flex flex-col bg-slate-900">
  <nav class="flex flex-row border-b-[1px] border-gray-500">
    <a class="m-2" href="/" use:link>
      <i class="bi bi-film text-2xl" />
      <h1 class="text-2xl inline">MovieDB</h1>
    </a>
    <div class="grow flex flex-row justify-end">
      <span class="self-center mr-4" role="button" on:click={toggleView}>
        <i class="bi bi-shuffle" />
      </span>
      <a class="self-center mr-4" href="/settings" use:link>
        <i class="bi bi-gear-wide-connected" />
      </a>
    </div>
  </nav>

  <div class="grow overflow-hidden">
    <Router {routes} />
  </div>
</div>
