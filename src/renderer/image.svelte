<script lang="ts">
  export let src: string | undefined;
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
<img on:load={onComplete} on:error={onError} {src} {alt} {hidden} />

<style>
  img {
    max-width: 100%;
  }
</style>
