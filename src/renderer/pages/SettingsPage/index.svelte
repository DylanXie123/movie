<script lang="ts">
  import { onDestroy } from "svelte";
  import fileTreeStore from "../../store/fileTreeStore";
  import type { IgnoreData } from "../../store/ignore";

  let ignoreList: IgnoreData[];

  const unsubscribe = fileTreeStore.subscribeIgnore(
    (data) => (ignoreList = data)
  );

  onDestroy(unsubscribe);

  const restore = (ignore: IgnoreData) => {
    fileTreeStore.removeIgnore(ignore);
  };

  const importMovieDB = async () => {
    const path = await window.electronAPI.showOpenDialog({});
    if (path) {
      await fileTreeStore.importMovieDB(path[0]);
      window.electronAPI.showMessageBox({
        message: `Import ${path[0]} success`,
        type: "info",
      });
    }
  };

  const storeInitPath = async () => {
    const path = await window.electronAPI.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (path) {
      window.electronAPI.showMessageBox({
        message: `Import ${path[0]} success, restart to take effect`,
        type: "info",
      });
      window.storageAPI.set("path", path[0]);
      window.electronAPI.relauch();
    }
  };
</script>

<button class="btn btn-primary" on:click={importMovieDB}>DB</button>
<button class="btn btn-primary" on:click={storeInitPath}>Path</button>
{#if ignoreList.length === 0}
  <p>Empty Ignore List</p>
{:else}
  <div class="d-flex flex-column h-100">
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
  </div>
{/if}
