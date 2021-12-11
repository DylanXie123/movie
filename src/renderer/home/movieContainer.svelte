<script lang="ts">
  import type FileNode from "../store/fileNode";
  import Image from "../image.svelte";
  import fileNodeStore from "../store/fileNodeStore";
  import SearchBox from "./searchBox.svelte";
  import selectedStore from "../store/selectStore";

  export let node: FileNode;

  let showEdit = false;

  const getSrcset = (node: FileNode) => `
    ${node.posterURL("w185")} 1x,
    ${node.posterURL("w342")} 2x,
    ${node.posterURL("w500")} 3x,
    ${node.posterURL("w780")} 4x,
    ${node.posterURL("original")} 5x
  `;

  const toggleEdit = () => (showEdit = !showEdit);

  const addIgnore = () => {
    fileNodeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
  };
</script>

<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
  <div class="position-relative">
    <div on:click={() => selectedStore.set(node)} style="cursor: pointer">
      <Image
        src={node.posterURL()}
        srcset={node.movie?.posterURL ? getSrcset(node) : undefined}
        alt={node.movie?.title}
      />
    </div>
    <div class="position-absolute top-0 end-0">
      <button class="btn btn-transparent rounded-circle" on:click={toggleEdit}>
        <i class="bi bi-three-dots" />
      </button>
    </div>
  </div>
  {#if showEdit}
    <SearchBox {node} />
    <button class="btn btn-primary" on:click={addIgnore}>Ignore</button>
  {/if}
</div>
