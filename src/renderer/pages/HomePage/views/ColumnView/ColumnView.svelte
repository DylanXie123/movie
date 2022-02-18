<script lang="ts">
  import columnViewStore from "./store/columnViewStore";
  import HeadBar from "../../components/HeadBar.svelte";
</script>

<div class="flex flex-col h-full w-full">
  <HeadBar />
  <div class="grow w-full overflow-hidden flex flex-row">
    {#each $columnViewStore as nodes}
      <div class="flex-grow overflow-y-auto min-w-0" data-simplebar>
        {#each nodes as child}
          <button
            class="btn whitespace-normal"
            title={child.parsed.base}
            on:click={() => columnViewStore.select(child)}
          >
            <div class="overflow-hidden text-ellipsis">
              {child.parsed.base}
            </div>
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>
