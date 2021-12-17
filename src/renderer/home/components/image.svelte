<script lang="ts">
  import Placeholder from "./placeholder.jpg";
  export let src: string | undefined;
  export let srcset: string | undefined = src;
  export let alt = "poster";

  enum Status {
    Loading,
    Completed,
    Error,
  }

  let status = Status.Error;

  const onComplete = () => {
    status = Status.Completed;
  };

  const onError = () => {
    status = Status.Error;
  };

  $: if (src) {
    status = Status.Loading;
  }
</script>

<div class="ratio" style="--bs-aspect-ratio: 150%;">
  {#if status !== Status.Completed}
    <img src={Placeholder} alt="placeholder" class="shadow rounded img-fluid" />
  {/if}
  <img
    on:load={onComplete}
    on:error={onError}
    class="shadow rounded img-fluid"
    style="height: 100%;"
    {src}
    {srcset}
    {alt}
    hidden={status === Status.Error}
  />
</div>
