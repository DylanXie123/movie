<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
</script>

<p>Home Page</p>

<div class="container">
  {#each $fileNodeStore as node}
    <img src={node.posterURL} alt={node.parsed.name} />
  {/each}
</div>

<style>
  img {
    max-width: 100%;
  }
  .container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    padding: 20px;
  }
</style>
