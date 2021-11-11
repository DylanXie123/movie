<script lang="ts">
  import { onDestroy } from "svelte";
  import type { IgnoreData } from "../../main/ignoreDB";
  import fileNodeStore from "../store/fileNodeStore";

  let ignoreList: IgnoreData[];

  const unsubscribe = fileNodeStore.subscribeIgnore(
    (data) => (ignoreList = data)
  );

  onDestroy(unsubscribe);

  const restore = (ignore: IgnoreData) => {
    fileNodeStore.removeIgnore(ignore);
  };
</script>

<div class="container">
  {#if ignoreList.length === 0}
    <p>Empty Ignore List</p>
  {:else}
    <ul class="list-group">
      {#each ignoreList as ignore (ignore.fullPath)}
        <li class="list-group-item">
          {ignore.fullPath}
          <button class="btn btn-primary" on:click={() => restore(ignore)}>
            Restore
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
