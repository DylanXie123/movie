<script lang="ts">
  import PImage from "./PImage/PImage.svelte";
  import placeholder from "./PImage/hPlaceholder.jpg";
  import getDateString from "../store/getDateString";
  import OpenBtn from "./OpenBtn.svelte";
  import type FileTree from "../store/fileTree";
  import { MovieInfo, TVInfo } from "../store/media";

  /**
   * `node.media` must not be undefined
   */
  export let node: FileTree;

  const getSrcset = (node: FileTree) => `
    ${node.media?.getBackgroundURL("w780")} 1x,
    ${node.media?.getBackgroundURL("w1280")} 2x,
    ${node.media?.getBackgroundURL("original")} 3x
  `;
</script>

<PImage
  src={node.media?.getBackgroundURL()}
  srcset={getSrcset(node)}
  alt="poster"
  {placeholder}
/>
<h1 class="m-2">{node.media?.title}</h1>
<p class="text-secondary mb-3">{node.media?.genres.join(", ")}</p>
<OpenBtn {node} />
<div class="row my-3 g-1">
  <div class="col-4">
    <p class="text-secondary mb-0">Language</p>
    {node.media?.language}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">ReleaseDate</p>
    {getDateString(node.media?.releaseDate)}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">Rating</p>
    {node.media?.tmdbRating}
  </div>
  <div class="col-4">
    {#if node.media instanceof MovieInfo}
      <p class="text-secondary mb-0">Runtime</p>
      {node.media.runtime}
    {:else if node.media instanceof TVInfo}
      <p class="text-secondary mb-0">Seasons</p>
      {node.media.seasons.length}
    {/if}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">TMDB</p>
    {node.media?.tmdbID}
  </div>
  <div class="col-4">
    <p class="text-secondary mb-0">IMDB</p>
    tt{node.media?.imdbID}
  </div>
</div>
<hr />
{#if node.media?.credits}
  <div
    class="overflow-auto my-3"
    data-simplebar
    data-simplebar-auto-hide="false"
  >
    <div class="row flex-nowrap">
      {#each node.media.credits as cast}
        <div class="col-3">
          <div class="ratio" style="--bs-aspect-ratio: 150%;">
            <PImage src={cast.getProfileURL()} alt={cast.name} />
          </div>
          <p class="text-secondary mb-0">{cast.name}</p>
        </div>
      {/each}
    </div>
  </div>
  <hr />
{/if}
<p>{node.media?.overview}</p>

<style>
  p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
