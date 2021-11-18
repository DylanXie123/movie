<script lang="ts">
  import Placeholder from "./placeholder.jpg";
  export let src: string | undefined;
  export let path: string | undefined;
  export let alt = "poster";
  enum Status {
    Loading,
    Completed,
    Error,
  }

  let status = Status.Loading;

  const onComplete = () => {
    status = Status.Completed;
  };

  const onError = () => {
    status = Status.Error;
  };

  $: hidden = status === Status.Error;
</script>

<div class="ratio" style="--bs-aspect-ratio: 150%;">
  {#if status !== Status.Completed}
    <img
      src={Placeholder}
      alt="placeholder"
      class="shadow rounded"
      width="100%"
      height="100%"
    />
  {/if}
  <a href={path ? `#/detail/${path}` : undefined}>
    <img
      on:load={onComplete}
      on:error={onError}
      class="shadow rounded"
      {src}
      {alt}
      width="100%"
      height="100%"
      style="object-fit: cover;"
    />
  </a>
</div>
