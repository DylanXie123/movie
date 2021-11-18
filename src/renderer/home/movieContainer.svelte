<script lang="ts">
  import type FileNode from "../../fileNode";
  import Image from "../image.svelte";
  import fileNodeStore from "../store/fileNodeStore";
  import SearchBox from "./searchBox.svelte";

  export let node: FileNode;

  let showEdit = false;

  const toggleEdit = () => (showEdit = !showEdit);

  const addIgnore = () => {
    fileNodeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
  };
</script>

<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2">
  <div class="position-relative">
    <Image
      src={node.posterURL}
      alt={node.movie?.title}
      path={node.movie?.tmdbID.toString()}
    />
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
