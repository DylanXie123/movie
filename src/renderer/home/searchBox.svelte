<script lang="ts">
  import TMDBAPI from "../../api/TMDB";
  import type FileNode from "../../fileNode";
  import type { MovieProp } from "../../fileNode";
  import fileNodeStore from "../store/fileNodeStore";

  const search = async () => {
    results = await TMDBAPI.searchMovie(query);
  };

  const clear = () => {
    results = [];
  };

  const savetoDB = (movie: MovieProp, fullPath: string) =>
    fileNodeStore.updateNode(movie, fullPath);

  export let node: FileNode;

  let query = node.parsed.name;

  let results: MovieProp[] = [];
</script>

<div class="row g-2">
  <input type="text" class="form-control-plaintext" bind:value={query} />
  <button on:click={search} class="btn btn-primary mb-3">Search</button>
  {#if results && results.length > 0}
    <div class="list-group">
      {#each results as movie}
        <button
          on:click={() => savetoDB(movie, node.fullPath)}
          class="list-group-item list-group-item-action"
        >
          {movie.title}
        </button>
      {/each}
      <button on:click={clear} class="btn btn-primary mb-3">
        <i class="bi bi-x" />
      </button>
    </div>
  {/if}
</div>
