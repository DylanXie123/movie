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
  <div class="flex flex-row h-full">
    <div class="flex-1 sm:flex-[2]">
      {#if $viewState === View.Grid}
        <GridView />
      {:else}
        <ColumnView />
      {/if}
    </div>
    {#if $selectedStore}
      <div class="flex-1">
        <DetailSidebar node={$selectedStore} />
      </div>
    {/if}
  </div>
  <SideNotification />
</ErrorBoundary>
