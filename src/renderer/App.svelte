<script lang="ts">
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./home/index.svelte";
  import Detail from "./detail/index.svelte";
</script>

<Router>
  <nav>
    <Link to="index">Home</Link>
    <Link to="detail">Detail</Link>
  </nav>
  <Route path="index" component={Home} />
  <Route path="detail" component={Detail} />
</Router>
