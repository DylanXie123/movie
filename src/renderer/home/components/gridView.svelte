<script lang="ts">
  import gridViewStore from "../../store/gridViewStore";
  import HeadBar from "./headBar.svelte";
  import MovieCard from "./movieCard.svelte";
</script>

<div class="flex flex-col h-full">
  <HeadBar>
    <h3 slot="head" class="text-xl whitespace-nowrap">
      {$gridViewStore.length} Movies
    </h3>
  </HeadBar>
  <div class="grow overflow-hidden">
    <div class="h-full overflow-auto" data-simplebar>
      <div class="grid grid-cols-12 justify-items-stretch gap-4">
        {#each $gridViewStore as node (node.fullPath)}
          <MovieCard {node} />
        {/each}
      </div>
    </div>
  </div>
</div>
