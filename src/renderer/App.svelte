<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";

  import Home from "./home/index.svelte";
  import Detail from "./detail/index.svelte";

  const create = () =>
    window.dbAPI
      .create({
        fullPath: "https://svelte-routing.firebaseio.com/",
        title: "new item",
        tmdbID: 0,
        imdbID: 0,
        posterURL: "https://via.placeholder.com/300x450",
        backgroundURL: "https://via.placeholder.com/300x450",
        overview: "",
        language: "",
        releaseDate: 0,
        tmdbRating: 0,
        imdbRating: 0,
      })
      .then(console.log);

  const update = () =>
    window.dbAPI
      .update({
        fullPath: "https://svelte-routing.firebaseio.com/",
        title: "update item",
        tmdbID: 0,
        imdbID: 0,
        posterURL: "https://via.placeholder.com/300x450",
        backgroundURL: "https://via.placeholder.com/300x450",
        overview: "",
        language: "",
        releaseDate: 0,
        tmdbRating: 0,
        imdbRating: 0,
      })
      .then(console.log);

  const retrieveAll = () => window.dbAPI.retrieveAll().then(console.log);

  const retrieve = () =>
    window.dbAPI
      .retrieve("https://svelte-routing.firebaseio.com/")
      .then(console.log);

  const deleteItem = () =>
    window.dbAPI
      .delete("https://svelte-routing.firebaseio.com/")
      .then(console.log);
</script>

<button on:click={create}>Create</button>
<button on:click={update}>Update</button>
<button on:click={retrieve}>Retrieve</button>
<button on:click={retrieveAll}>RetrieveAll</button>
<button on:click={deleteItem}>Delete</button>

<Router>
  <nav>
    <Link to="index">Home</Link>
    <Link to="detail">Detail</Link>
  </nav>
  <Route path="index" component={Home} />
  <Route path="detail" component={Detail} />
</Router>
