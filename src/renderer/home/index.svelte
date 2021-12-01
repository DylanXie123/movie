<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
  import MovieContainer from "./movieContainer.svelte";
</script>

<div class="container-fluid py-3 pe-lg-5">
  <div class="d-flex justify-content-end">
    <div class="dropdown pe-3">
      <button
        class="btn btn-transparent dropdown-toggle text-light"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a class="dropdown-item" href="/">Action</a></li>
        <li><a class="dropdown-item" href="/">Another action</a></li>
        <li><a class="dropdown-item" href="/">Something else here</a></li>
      </ul>
    </div>
    <div class="dropdown pe-3">
      <button
        class="btn btn-transparent dropdown-toggle text-light"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a class="dropdown-item" href="/">Action</a></li>
        <li><a class="dropdown-item" href="/">Another action</a></li>
        <li><a class="dropdown-item" href="/">Something else here</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="container">
  <div class="row g-4">
    {#each $fileNodeStore as node (node.fullPath)}
      <MovieContainer {node} />
    {/each}
  </div>
</div>
