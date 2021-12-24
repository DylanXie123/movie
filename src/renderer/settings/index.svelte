<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
  import { onDestroy } from "svelte";
  import type { IgnoreData } from "../store/ignore";

  let ignoreList: IgnoreData[];

  const unsubscribe = fileNodeStore.subscribeIgnore(
    (data) => (ignoreList = data)
  );

  onDestroy(unsubscribe);

  const restore = (ignore: IgnoreData) => {
    // fileNodeStore.removeIgnore(ignore);
  };
  let dbFilePath: string;

  let movieFilePath: string;

  const importIgnore = () => fileNodeStore.importIgnoreDB(dbFilePath);

  const importMovie = () => fileNodeStore.importMovieDB(movieFilePath);

  const importAll = () => {
    importIgnore();
    importMovie();
  };
</script>

<div class="d-flex flex-column h-100">
  <div class="d-flex m-2 gap-2">
    <label for="ignore" class="form-label mx-2">DB</label>
    <div class="flex-grow-1">
      <input
        type="text"
        class="form-control "
        id="ignore"
        bind:value={dbFilePath}
      />
    </div>
    <button class="btn btn-primary" on:click={importAll}> Submit </button>
  </div>

  {#if dbFilePath}
    <h2>DB file:</h2>
    <p>{dbFilePath}</p>
  {/if}

  {#if ignoreList.length === 0}
    <p>Empty Ignore List</p>
  {:else}
    <div class="flex-grow-1 overflow-auto container-xxl">
      <ul class="list-group" data-simplebar>
        {#each ignoreList as ignore (ignore.fullPath)}
          <li
            class="list-group-item list-group-item-dark d-flex justify-content-between"
          >
            <p style="word-break: break-word;">{ignore.fullPath}</p>
            <button class="btn btn-primary" on:click={() => restore(ignore)}>
              Restore
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
