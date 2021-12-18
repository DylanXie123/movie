<script lang="ts">
  import { onDestroy } from "svelte";
  import type FileNode from "../store/fileNode";
  import fileNodeStore from "../store/fileNodeStore";
  import selectedStore from "../store/selectStore";
  import { Order, recalcNodes, Sort } from "./filter";
  import HeadBar from "./components/headBar.svelte";
  import MovieCard from "./components/movieCard.svelte";
  import DetailSidebar from "../detail/index.svelte";

  let fileNodes: FileNode[] = [];
  let sort = Sort.Title;
  let order = Order.Asc;
  let queryStr = "";
  let onlyOnDisk = false;
  $: filtered = recalcNodes(fileNodes, onlyOnDisk, queryStr, sort, order);

  const unsubscribeFileNode = fileNodeStore.subscribe((newData) => {
    fileNodes = newData;
    filtered = recalcNodes(fileNodes, onlyOnDisk, queryStr, sort, order);
  });

  const changeSort = (newSort: Sort) => {
    sort = newSort;
  };

  const changeOrder = (newOrder: Order) => {
    order = newOrder;
  };

  onDestroy(unsubscribeFileNode);
</script>

<div class="d-flex h-100">
  <div
    class="flex-grow-1 d-flex flex-column col-lg-9 col-sm-8"
    on:click={() => selectedStore.set(undefined)}
  >
    <HeadBar
      bind:queryStr
      {order}
      {sort}
      bind:onlyOnDisk
      movieLength={filtered.length}
      {changeOrder}
      {changeSort}
    />
    <div class="flex-grow-1 overflow-auto" data-simplebar>
      <div class="container px-lg-5">
        <div class="row g-4">
          {#each filtered as node (node.fullPath)}
            <MovieCard {node} />
          {/each}
        </div>
      </div>
    </div>
  </div>
  {#if $selectedStore}
    <div class="col-lg-3 col-sm-4 ps-2">
      <DetailSidebar node={$selectedStore} />
    </div>
  {/if}
</div>
