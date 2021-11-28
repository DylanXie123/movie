<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";

  let ignoreFilePath: string;

  let movieFilePath: string;

  const importIgnore = () => fileNodeStore.importIgnoreDB(ignoreFilePath);

  const importMovie = () => fileNodeStore.importMovieDB(movieFilePath);
</script>

<div class="row m-2">
  <label for="ignore" class="form-label col-sm-1">Ignore</label>
  <div class="col-sm-10">
    <input
      type="text"
      class="form-control "
      id="ignore"
      bind:value={ignoreFilePath}
    />
  </div>
  <button class="btn btn-primary col-sm-1" on:click={importIgnore}>
    Submit
  </button>
</div>
<div class="row m-2">
  <label for="movie" class="form-label col-sm-1">Movie</label>
  <div class="col-sm-10">
    <input
      type="text"
      class="form-control"
      id="movie"
      bind:value={movieFilePath}
    />
  </div>
  <button class="btn btn-primary col-sm-1" on:click={importMovie}>
    Submit
  </button>
</div>

{#if ignoreFilePath}
  <h2>Ignore files:</h2>
  <p>{ignoreFilePath}</p>
{/if}

{#if movieFilePath}
  <h2>Movie files:</h2>
  <p>{movieFilePath}</p>
{/if}
