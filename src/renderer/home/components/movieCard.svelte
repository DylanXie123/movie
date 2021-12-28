<script lang="ts">
  import type FileTree from "../../store/fileTree";
  import Image from "../../common/image.svelte";
  import selectedStore from "../../store/selectStore";

  export let node: FileTree;

  const getSrcset = (node: FileTree) => `
    ${node.media?.getPosterURL("w185")} 1x,
    ${node.media?.getPosterURL("w342")} 2x,
    ${node.media?.getPosterURL("w500")} 3x,
    ${node.media?.getPosterURL("w780")} 4x,
    ${node.media?.getPosterURL("original")} 5x
  `;
</script>

<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
  <div class="position-relative">
    <div
      on:click|stopPropagation={() => {
        selectedStore.set(node);
      }}
      type="button"
    >
      <div class="ratio" style="--bs-aspect-ratio: 150%;">
        <Image
          src={node.media?.getPosterURL()}
          srcset={node.media?.posterURL ? getSrcset(node) : undefined}
          alt={node.media?.title}
        />
      </div>
    </div>
  </div>
</div>
