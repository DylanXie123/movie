<script lang="ts">
  import IMDBAPI from "../../api/IMDB";
  import TMDBAPI from "../../api/TMDB";
  import type FileNode from "../../fileNode";

  const init = () => {
    const fileTree = window.fsAPI.initFileTree(
      "D:\\OneDrive - stu.xjtu.edu.cn\\Media\\Movies\\Marvel\\Black.Widow.2021.1080p.WEBRip.x264-RARBG"
    );
    const fileList = window.fsAPI.flatFileTree(fileTree);
    return fileList;
  };

  const initData = init();

  let files = Promise.all(
    initData.map(async (tree) => {
      const results = await IMDBAPI.searchTitle(tree.parsed.name);
      if (results) {
        const movie = await TMDBAPI.findMovie(results[0]);
        tree.movie = movie;
      }
      return tree;
    })
  );
</script>

<ul>
  {#await files}
    <p>Waiting...</p>
  {:then filesData}
    {#each filesData as file}
      <li>{file.fullPath}</li>
      <li>{file.movie?.title}</li>
    {/each}
  {/await}
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
