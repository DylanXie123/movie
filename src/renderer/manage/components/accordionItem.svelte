<script lang="ts">
  import TMDBAPI from "../../../api/TMDB";
  import type { MediaInfo } from "../../store/media";

  export let title: string;

  enum Stat {
    Init,
    Loading,
    Complete,
    Error,
  }

  let stat = Stat.Init;
  let medias: MediaInfo[] | undefined;

  const search = async (title: string) => {
    stat = Stat.Loading;
    try {
      medias = await TMDBAPI.searchMulti(title);
      stat = Stat.Complete;
    } catch (_) {
      stat = Stat.Error;
    }
  };
</script>

<div class="accordion-item">
  <h2 class="accordion-header" id="headingOne">
    <button
      class="accordion-button"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#collapseOne"
      aria-expanded="true"
      aria-controls="collapseOne"
    >
      {title}
    </button>
  </h2>
  <div
    id="collapseOne"
    class="accordion-collapse collapse show"
    aria-labelledby="headingOne"
    data-bs-parent="#accordionExample"
  >
    <div class="accordion-body">
      <form on:submit|preventDefault={() => search(title)}>
        <input type="search" bind:value={title} />
        <button>Submit</button>
      </form>
      {#if stat === Stat.Complete && medias}
        {#each medias as media}
          <p>{media.title}</p>
        {/each}
      {/if}
    </div>
  </div>
</div>
