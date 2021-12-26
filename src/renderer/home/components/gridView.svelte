<script lang="ts">
  import { onDestroy } from "svelte";
  import HeadBar from "./headBar.svelte";
  import MovieCard from "./movieCard.svelte";
  import type FileNode from "../../store/fileNode";
  import { Order, recalcNodes, Sort } from "../filter";
  import fileNodeStore from "../../store/fileNodeStore";

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

<div class="d-flex flex-column h-100">
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
