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

<div class="col-span-6 sm:col-span-3">
  <div
    on:click|stopPropagation={() => {
      selectedStore.set(node);
    }}
    type="button"
  >
    <div class="w-full">
      <Image
        src={node.media?.getPosterURL()}
        srcset={node.media?.posterURL ? getSrcset(node) : undefined}
        alt={node.media?.title}
      />
    </div>
  </div>
</div>
