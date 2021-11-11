<script lang="ts">
  import TMDBAPI from "../../api/TMDB";
  import type FileNode from "../../fileNode";
  import type { MovieProp } from "../../fileNode";
  import fileNodeStore from "../store/fileNodeStore";

  enum Status {
    Init,
    Loading,
    Loaded,
    Error,
  }

  const search = () => {
    status = Status.Loading;
    TMDBAPI.searchMovie(query)
      .then((res) => {
        results = res;
        status = Status.Loaded;
      })
      .catch(() => (status = Status.Error));
  };

  const clear = () => {
    results = [];
  };

  const updateStore = (movie: MovieProp, fullPath: string) => {
    fileNodeStore.updateNode(movie, fullPath);
    clear();
    status = Status.Init;
  };

  export let node: FileNode;

  let status = Status.Init;

  let query = node.parsed.name;

  let results: MovieProp[] = [];
</script>

<div class="row g-2">
  <input type="text" class="form-control-plaintext" bind:value={query} />
  <button on:click={search} class="btn btn-primary mb-3">Search</button>
  {#if status === Status.Loading}
    <div>Loading...</div>
  {:else if status === Status.Error}
    <div>Network Error...</div>
  {:else if status === Status.Loaded}
    {#if results.length > 0}
      <div class="list-group">
        {#each results as movie}
          <button
            on:click={() => updateStore(movie, node.fullPath)}
            class="list-group-item list-group-item-action"
          >
            {movie.title}
          </button>
        {/each}
        <button on:click={clear} class="btn btn-primary mb-3">
          <i class="bi bi-x" />
        </button>
      </div>
    {:else}
      <div>No results...</div>
    {/if}
  {/if}
</div>
