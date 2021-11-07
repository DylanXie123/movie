<script lang="ts">
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

{#if status === Status.Loading}
  <div class="spinner-border" role="status" />
{:else if status === Status.Error}
  <i class="bi bi-x-circle-fill" />
{/if}
<a href={path ? `#/detail/${path}` : undefined}>
  <img on:load={onComplete} on:error={onError} {src} {alt} {hidden} />
</a>

<style>
  img {
    max-width: 100%;
  }
</style>
