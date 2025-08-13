<script lang="ts">
  import { cn } from "$lib/utils";
  import { buttonVariants, type ButtonVariants } from "./button-variants";

  let className = "";
  export { className as class };
  export let variant: ButtonVariants["variant"] = "default";
  export let size: ButtonVariants["size"] = "default";
  export let href: string | undefined = undefined;
</script>

{#if href}
  <a
    {href}
    class={cn(buttonVariants({ variant, size }), className)}
    {...$$restProps}
  >
    <slot />
  </a>
{:else}
  <button
    class={cn(buttonVariants({ variant, size }), className)}
    {...$$restProps}
  >
    <slot />
  </button>
{/if}