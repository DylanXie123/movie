<script lang="ts">
  import ColumnView from "./views/ColumnView/ColumnView.svelte";
  import GridView from "./views/GridView/GridView.svelte";
  import DetailSidebar from "./views/DetailView/DetailView.svelte";
  import viewState, { View } from "./store/viewState";
  import selectedStore from "./store/selectStore";
  import ErrorBoundary from "@/common/ErrorBoundary/ErrorBoundary";
  import SideNotification from "./views/GridView/components/SideNotification.svelte";
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
