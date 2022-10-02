<script lang="ts">
  import columnViewStore from "renderer/store/columnViewStore";
  import HeadBar from "../components/HeadBar.svelte";
</script>

<div class="h-100">
  <HeadBar />
  <div class="d-flex container-fluid h-100">
    {#each $columnViewStore as nodes}
      <div
        class="flex-grow-1 overflow-auto"
        style="min-width: 0;"
        data-simplebar
      >
        <div class="list-group list-group-flush">
          {#each nodes as child}
            <button
              class="list-group-item list-group-item-dark list-group-item-action text-nowrap"
              title={child.parsed.base}
              on:click={() => columnViewStore.select(child)}
            >
              <div style="text-overflow:ellipsis; overflow:hidden;">
                {child.parsed.base}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
