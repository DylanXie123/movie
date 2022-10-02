<script lang="ts">
  import PImage from "./PImage/PImage.svelte";
  import getDateString from "../store/getDateString";
  import type FileTree from "../store/fileTree";
  import type { MediaInfo } from "renderer/store/media";
  import TMDBAPI from "renderer/api/TMDB";
  import fileTreeStore from "renderer/store/fileTreeStore";

  enum Status {
    Init,
    Loading,
    Complete,
    Error,
  }

  export let node: FileTree;
  let status = Status.Init;
  let query = node.parsed.name;
  let results: MediaInfo[] = [];

  const search = () => {
    status = Status.Loading;
    TMDBAPI.searchMulti(query)
      .then((res) => {
        results = res;
        status = Status.Complete;
      })
      .catch(() => (status = Status.Error));
  };

  const clear = () => {
    results = [];
  };

  const updateStore = (node: FileTree, newData: MediaInfo) => {
    fileTreeStore.updateNode(node, newData);
    clear();
    status = Status.Init;
  };

  const clickOutside = (node: HTMLElement) => {
    const handleClick = (event: any) => {
      if (!node.contains(event.target)) {
        status = Status.Init;
        clear();
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };
</script>

<div use:clickOutside>
  <form on:submit|preventDefault={search}>
    <div class="position-relative">
      <input
        class="form-control rounded-pill my-2"
        placeholder="Search"
        type="search"
        value={node.parsed.base}
        on:input={(e) => (query = e.currentTarget.value)}
      />
      {#if status === Status.Loading}
        <div class="position-absolute top-50 end-0 translate-middle">
          <div class="spinner-border spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      {/if}
    </div>
  </form>

  <div class="position-relative">
    <div class="position-absolute w-100" style="z-index: 1;">
      <ul class="list-group">
        {#if status === Status.Error}
          <li class="list-group-item">Error...</li>
        {:else if status === Status.Complete}
          {#if results.length === 0}
            <li class="list-group-item">Empty</li>
          {:else}
            {#each results as movie}
              <li
                on:click={() => updateStore(node, movie)}
                class="list-group-item d-flex p-1"
                style="height: 100px;"
              >
                <PImage
                  src={movie.getPosterURL()}
                  alt={movie.title}
                  classStr="shadow rounded img-fluid h-100"
                />
                <div
                  class="ms-2 d-flex flex-column justify-content-between py-2"
                >
                  <span class="fw-bold">{movie.title}</span>
                  <span>{getDateString(movie.releaseDate)}</span>
                </div>
              </li>
            {/each}
          {/if}
        {/if}
      </ul>
    </div>
  </div>
</div>
