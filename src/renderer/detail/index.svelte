<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";

  export let params: Record<string, string> = {};
  const tmdbID = parseInt(params.id);

  // TODO: maybe this should be a promise?
  $: movieNode = $fileNodeStore.find((node) => node.movie?.tmdbID === tmdbID);
</script>

<div class="header" style="--background-image: url({movieNode?.backgroundURL})">
  <div class="poster">
    <img src={movieNode?.posterURL} alt="poster" />
  </div>
  <div class="info">
    <h1>{movieNode?.movie?.title}</h1>
    <p>{movieNode?.movie?.overview}</p>
  </div>
</div>

<style>
  .header {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .header::before {
    content: "";
    position: absolute;
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 255, 0.5),
        rgba(255, 255, 0, 0.5)
      ),
      var(--background-image);
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 500px;
    opacity: 0.4;
    z-index: -1;
  }

  .poster {
    height: 500px;
    padding: 20px;
    box-sizing: border-box;
  }

  .poster > img {
    max-height: 100%;
    box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .info {
    max-width: 500px;
    max-height: 500px;
    overflow-y: auto;
    flex: 1;
  }

  @media (max-width: 500px) {
    .header::before {
      height: 200px;
    }
    .poster {
      height: 200px;
    }
    .info {
      max-height: 200px;
    }
  }
</style>
