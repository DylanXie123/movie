<script lang="ts">
  import IMDBAPI from "../api/IMDB";
  import TMDBAPI from "../api/TMDB";

  const basePath = "D:\\OneDrive - stu.xjtu.edu.cn\\Downloads";
  let dirs = readFileNode(basePath);

  function readDir(path: string) {
    return window.fsAPI.readDir(path);
  }

  function readStat(path: string) {
    return window.fsAPI.statSync(path);
  }

  function readFileNode(path: string) {
    return window.fsAPI.readFileNode(path);
  }

  async function displayAPI() {
    const response = await TMDBAPI.searchMovie("550");
    console.log(response);
  }
</script>

<button on:click={displayAPI}>Click</button>

<ol>
  {#each dirs as dir}
    <li>
      <ul>
        <li>{dir.name}</li>
        <li>{dir.blocks}</li>
        <li>{dir.size}</li>
        <li>{dir.children}</li>
      </ul>
    </li>
  {/each}
</ol>
