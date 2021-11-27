<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";

  let ignoreFilePath: string;

  let movieFilePath: string;

  const importIgnore = () => fileNodeStore.importIgnoreDB(ignoreFilePath);

  const importMovie = () => fileNodeStore.importMovieDB(movieFilePath);
</script>

<div>
  <label for="ignore" class="form-label">Ignore</label>
  <input
    type="text"
    class="form-control"
    id="ignore"
    bind:value={ignoreFilePath}
  />
  <button class="btn btn-primary" on:click={importIgnore}>Submit</button>
</div>
<div>
  <label for="movie" class="form-label">Movie</label>
  <input
    type="text"
    class="form-control"
    id="movie"
    bind:value={movieFilePath}
  />
  <button class="btn btn-primary" on:click={importMovie}>Submit</button>
</div>

{#if ignoreFilePath}
  <h2>Ignore files:</h2>
  <p>{ignoreFilePath}</p>
{/if}

{#if movieFilePath}
  <h2>Movie files:</h2>
  <p>{movieFilePath}</p>
{/if}
