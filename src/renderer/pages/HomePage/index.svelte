<script lang="ts">
  import ColumnView from "./views/ColumnView.svelte";
  import GridView from "./views/GridView.svelte";
  import DetailSidebar from "./views/DetailView.svelte";
  import viewState, { View } from "./viewState";
  import selectedStore from "renderer/store/selectStore";
  import SideNotification from "./components/SideNotification.svelte";
  import ErrorBoundary from "renderer/components/ErrorBoundary/ErrorBoundary.svelte";
</script>

<ErrorBoundary>
  <div class="row justify-content-center h-100">
    <div class="col-lg-9 col-sm-8 h-100">
      {#if $viewState === View.Grid}
        <GridView />
      {:else}
        <ColumnView />
      {/if}
    </div>
    {#if $selectedStore}
      <div class="col-lg-3 col-sm-4 ps-2 h-100">
        <DetailSidebar node={$selectedStore} />
      </div>
    {/if}
  </div>
  <SideNotification />
</ErrorBoundary>
