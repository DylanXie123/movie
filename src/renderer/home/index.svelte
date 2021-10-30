<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
</script>

<ul>
  {#each $fileNodeStore as node}
    <li>{node.parsed.base}</li>
  {/each}
</ul>

<p>Home Page</p>

<div class="container">
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
  <img src="https://via.placeholder.com/150" alt="movie" />
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
