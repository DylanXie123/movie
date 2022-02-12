<script lang="ts">
  import ColumnView from "./components/columnView.svelte";
  import GridView from "./components/gridView.svelte";
  import DetailSidebar from "../detail/index.svelte";
  import viewState, { View } from "./viewState";
  import selectedStore from "../store/selectStore";
  import ErrorBoundary from "../common/ErrorBoundary";
  import SideNotification from "./components/sideNotification.svelte";
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
