<script lang="ts">
  import Image from "../../common/image.svelte";
  import placeholder from "./hPlaceholder.jpg";
  import type FileNode from "../../store/fileNode";
  import getDateString from "./getDateString";
  import OpenBtn from "./openBtn.svelte";

  export let node: FileNode;

  const play = () => window.fsAPI.openFile(node.fullPath);

  const openFolder = () => window.fsAPI.openFile(node.parsed.dir);

  const getSrcset = (node: FileNode) => `
    ${node.movie?.getBackgroundURL("w780")} 1x,
    ${node.movie?.getBackgroundURL("w1280")} 2x,
    ${node.movie?.getBackgroundURL("original")} 3x
  `;
</script>

<Image
  src={node.movie?.getBackgroundURL()}
  srcset={getSrcset(node)}
  alt="poster"
  {placeholder}
/>
<h1 class="m-2">{node.movie?.title}</h1>
<p class="text-secondary mb-3">{node.movie?.genres.join(", ")}</p>
<OpenBtn {node} />
<div class="row my-3 g-1">
  <div class="col-4">
    <p class="text-secondary mb-0">Language</p>
    {node.movie?.language}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">ReleaseDate</p>
    {getDateString(node.movie?.releaseDate)}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">Rating</p>
    {node.movie?.tmdbRating}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">Runtime</p>
    {node.movie?.runtime}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">TMDB</p>
    {node.movie?.tmdbID}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">IMDB</p>
    tt{node.movie?.imdbID}
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
          <div class="ratio" style="--bs-aspect-ratio: 150%;">
            <Image src={cast.profileURL()} alt={cast.name} />
          </div>
          <p class="text-secondary mb-0">{cast.name}</p>
        </div>
      {/each}
    </div>
  </div>
  <hr />
{/if}
<p>{node.movie?.overview}</p>
