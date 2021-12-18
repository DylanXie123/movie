<script lang="ts">
  import Placeholder from "./placeholder.jpg";
  export let src: string | undefined;
  export let classStr: string = "shadow rounded img-fluid";
  export let srcset: string | undefined = src;
  export let alt: string | undefined;
  export let placeholder = Placeholder;

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

<img
  on:load={onComplete}
  on:error={onError}
  class={classStr}
  {src}
  {srcset}
  {alt}
  hidden={status !== Status.Completed}
/>
<img
  src={placeholder}
  alt="placeholder"
  class={classStr}
  hidden={status === Status.Completed}
/>
