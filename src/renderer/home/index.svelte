<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
</script>

<div class="grid-container">
  {#each $fileNodeStore as node}
    <div class="d-grid gap-2">
      <img src={node.posterURL} alt={node.parsed.name} />
      <form class="row g-2">
        <div class="col-auto">
          <label for="staticEmail2" class="visually-hidden">Email</label>
          <input
            type="text"
            readonly
            class="form-control-plaintext"
            id="staticEmail2"
            value="email@example.com"
          />
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-primary mb-3"
            >Confirm identity</button
          >
        </div>
      </form>
    </div>
  {/each}
</div>

<style>
  img {
    max-width: 100%;
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    padding: 20px;
  }
</style>
