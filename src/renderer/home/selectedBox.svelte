<script lang="ts">
  import type FileNode from "../store/fileNode";

  export let node: FileNode;

  const play = () => window.fsAPI.openFile(node.fullPath);

  const getDateString = (date: Date | undefined) => {
    if (date === undefined) {
      return "";
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${year}-${month}-${day}`;
    }
  };

  const getSrcset = (node: FileNode) => `
    ${node.backgroundURL("w780")} 1x,
    ${node.backgroundURL("w1280")} 2x,
    ${node.backgroundURL("original")} 3x
  `;
</script>

<div class="overflow-auto">
  <img
    class="img-fluid"
    src={node.backgroundURL()}
    srcset={getSrcset(node)}
    alt="poster"
  />
  <h1 class="m-2">{node.movie?.title}</h1>
  <p class="text-secondary mb-4">{node.movie?.genres.join(", ")}</p>
  <div class="d-grid my-2">
    {#if node.onDisk}
      <button class="btn btn-primary rounded-pill" on:click={play}>
        <i class="bi bi-play-circle-fill" />
        <span>Watch</span>
      </button>
    {:else}
      <button class="btn btn-primary rounded-pill disabled">
        <i class="bi bi-x-circle-fill" />
        <span>Unavailable</span>
      </button>
    {/if}
  </div>
  <div class="row my-3">
    <div class="col">
      <p class="text-secondary mb-0">Language</p>
      {node.movie?.language}
    </div>
    <div class="col">
      <p class="text-secondary mb-0">ReleaseDate</p>
      {getDateString(node.movie?.releaseDate)}
    </div>
    <div class="col">
      <p class="text-secondary mb-0">Rating</p>
      {node.movie?.tmdbRating}
    </div>
  </div>
  <div class="row my-3">
    <div class="col">
      <p class="text-secondary mb-0">Runtime</p>
      {node.movie?.runtime}
    </div>
    <div class="col">
      <p class="text-secondary mb-0">ReleaseDate</p>
      {getDateString(node.movie?.releaseDate)}
    </div>
    <div class="col">
      <p class="text-secondary mb-0">Rating</p>
      {node.movie?.tmdbRating}
    </div>
  </div>
  <hr />
  {#if node.movie?.credits}
    <div class="row my-3">
      {#each node.movie.credits as cast}
        <div class="col-3">
          <img class="img-fluid" src={cast.profileURL()} alt={cast.name} />
          <p class="text-secondary mb-0">{cast.name}</p>
        </div>
      {/each}
    </div>
  {/if}
  <p>{node.movie?.overview}</p>
</div>
