<script lang="ts">
  import { onDestroy } from "svelte";
  import selectedStore from "../store/selectStore";
  import DetailSidebar from "../detail/index.svelte";
  import ColumnView from "./components/columnView.svelte";
  import type { FileTree } from "../store/fileNode";
  import GridView from "./components/gridView.svelte";
  import viewState, { View } from "./viewState";

  let detailNode: FileTree | undefined = undefined;

  const unsubscribeDetailNode = selectedStore.subscribeCurrent(
    (newData) => (detailNode = newData)
  );

  onDestroy(unsubscribeDetailNode);
</script>

<div class="row h-100">
  <div class="col-lg-9 col-sm-8 h-100">
    {#if $viewState === View.Grid}
      <GridView />
    {:else}
      <ColumnView />
    {/if}
  </div>
  {#if detailNode}
    <div class="col-lg-3 col-sm-4 ps-2 h-100">
      <DetailSidebar node={detailNode} />
    </div>
  {/if}
</div>
