<script lang="ts">
  import gridViewStore from "../../store/gridViewStore";
  import HeadBar from "./headBar.svelte";
  import MovieCard from "./movieCard.svelte";
</script>

<div class="d-flex flex-column h-100">
  <HeadBar>
    <h3 class="m-0" slot="head" style="white-space: nowrap;">
      {$gridViewStore.length} Movies
    </h3>
  </HeadBar>
  <div class="flex-grow-1 overflow-auto" data-simplebar>
    <div class="container px-lg-5">
      <div class="row g-4">
        {#each $gridViewStore as node (node.fullPath)}
          <MovieCard {node} />
        {/each}
      </div>
    </div>
  </div>
</div>
