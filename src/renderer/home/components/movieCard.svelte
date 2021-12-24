<script lang="ts">
  import type FileNode from "../../store/fileNode";
  import Image from "../../common/image.svelte";
  import selectedStore from "../../store/selectStore";

  export let node: FileNode;

  const getSrcset = (node: FileNode) => `
    ${node.movie?.getPosterURL("w185")} 1x,
    ${node.movie?.getPosterURL("w342")} 2x,
    ${node.movie?.getPosterURL("w500")} 3x,
    ${node.movie?.getPosterURL("w780")} 4x,
    ${node.movie?.getPosterURL("original")} 5x
  `;
</script>

<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
  <div class="position-relative">
    <div on:click|stopPropagation={() => selectedStore.set(node)} type="button">
      <div class="ratio" style="--bs-aspect-ratio: 150%;">
        <Image
          src={node.movie?.getPosterURL()}
          srcset={node.movie?.posterURL ? getSrcset(node) : undefined}
          alt={node.movie?.title}
        />
      </div>
    </div>
  </div>
</div>
