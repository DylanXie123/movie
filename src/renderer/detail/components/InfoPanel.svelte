<script lang="ts">
  import Image from "../../common/image.svelte";
  import placeholder from "./hPlaceholder.jpg";
  import getDateString from "./getDateString";
  import OpenBtn from "./openBtn.svelte";
  import { MovieInfo, TVInfo } from "../../store/media";
  import type FileTree from "../../store/fileTree";

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

<Image
  src={node.media?.getBackgroundURL()}
  srcset={getSrcset(node)}
  alt="poster"
  {placeholder}
  classStr="w-full"
/>
<h1 class="text-xl font-bold ml-2 my-2">{node.media?.title}</h1>
<p class="text-gray-400 ml-2 mb-2">{node.media?.genres.join(", ")}</p>
<OpenBtn {node} />
<div class="grid grid-cols-3 gap-1 mx-2">
  <div class="col-span-1">
    <p class="text-gray-400 ellipsis">Language</p>
    <p>{node.media?.language}</p>
  </div>
  <div class="col-span-1">
    <p class="text-gray-400 ellipsis">ReleaseDate</p>
    {getDateString(node.media?.releaseDate)}
  </div>
  <div class="col-span-1">
    <p class="text-gray-400 ellipsis">Rating</p>
    {node.media?.tmdbRating}
  </div>
  <div class="col-span-1">
    {#if node.media instanceof MovieInfo}
      <p class="text-gray-400 ellipsis">Runtime</p>
      {node.media.runtime}
    {:else if node.media instanceof TVInfo}
      <p class="text-gray-400 ellipsis">Seasons</p>
      {node.media.seasons.length}
    {/if}
  </div>
  <div class="col-span-1">
    <p class="text-gray-400 ellipsis">TMDB</p>
    {node.media?.tmdbID}
  </div>
  <div class="col-span-1">
    <p class="text-gray-400 ellipsis">IMDB</p>
    tt{node.media?.imdbID}
  </div>
</div>
<hr />
{#if node.media?.credits}
  <div class="overflow-x-auto" data-simplebar data-simplebar-auto-hide="false">
    <div class="flex flex-row flex-nowrap my-2 p-0">
      {#each node.media.credits as cast}
        <div class="inline-block flex-none w-20 sm:w-28 mx-1">
          <Image src={cast.getProfileURL()} alt={cast.name} classStr="w-full shadow rounded aspect-[2/3]" />
          <p class="text-gray-400 ellipsis">{cast.name}</p>
        </div>
      {/each}
    </div>
  </div>
  <hr />
{/if}
<p class="m-2">{node.media?.overview}</p>

<style>
  p.ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
