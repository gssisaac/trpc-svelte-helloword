<script lang="ts">
  import { cn } from "$lib/utils";
  import { labelVariants } from "./label-variants";

  let className = "";
  export { className as class };
  export let htmlFor: string | undefined = undefined;
</script>

<label
  class={cn(labelVariants(), className)}
  for={htmlFor}
  {...$$restProps}
>
  <slot />
</label>