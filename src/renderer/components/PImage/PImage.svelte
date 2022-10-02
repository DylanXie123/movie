<script lang="ts">
  import Placeholder from "./placeholder.jpg";
  export let src: string | undefined;
  export let classStr: string = "shadow rounded img-fluid";
  export let srcset: string | undefined = undefined;
  export let alt: string | undefined;
  export let placeholder = Placeholder;

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

  const toLoading = () => {
    status = Status.Loading;
  };

  /**
   * use reacttive statement ($:) to update `status` when src changes,
   * since reactive statement only runs when values directly appear
   * in statement change, so we need to change `status` in a separate
   * `toLoading` function
   */
  $: if (src) toLoading();
</script>

<img
  on:load={onComplete}
  on:error={onError}
  class={classStr}
  style={status === Status.Completed ? "" : "display: none;"}
  {src}
  {srcset}
  {alt}
/>
<img
  src={placeholder}
  alt="placeholder"
  class={classStr}
  hidden={status === Status.Completed}
/>
