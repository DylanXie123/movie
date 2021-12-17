<script lang="ts">
  import type FileNode from "../../store/fileNode";
  import fileNodeStore from "../../store/fileNodeStore";
  import Image from "./image.svelte";
  import Search from "./search.svelte";

  export let node: FileNode;

  const play = () => window.fsAPI.openFile(node.fullPath);

  const addIgnore = () => {
    fileNodeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
  };

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

<div class="h-100" style="overflow-x: hidden;" data-simplebar>
  <Search {node} />
  <img
    class="img-fluid"
    src={node.backgroundURL()}
    srcset={getSrcset(node)}
    alt="poster"
  />
  <h1 class="m-2">{node.movie?.title}</h1>
  <p class="text-secondary mb-3">{node.movie?.genres.join(", ")}</p>
  <div class="d-grid px-4">
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
    <div
      class="overflow-auto my-3"
      data-simplebar
      data-simplebar-auto-hide="false"
    >
      <div class="row flex-nowrap">
        {#each node.movie.credits as cast}
          <div class="col-3">
            <Image src={cast.profileURL()} alt={cast.name} />
            <p class="text-secondary mb-0">{cast.name}</p>
          </div>
        {/each}
      </div>
    </div>
    <hr />
  {/if}
  <p>{node.movie?.overview}</p>
  <div class="d-grid col-6 mx-auto">
    <button class="btn btn-secondary" on:click={addIgnore}>
      <i class="bi bi-dash-circle" />
      <span>Ignore</span>
    </button>
  </div>
</div>
