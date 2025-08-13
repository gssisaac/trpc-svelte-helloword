<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui';
</script>

<div class="max-w-2xl mx-auto text-center space-y-8">
  {#if $auth.isAuthenticated && $auth.user}
    <h1 class="text-4xl font-bold">Welcome to Your Dashboard</h1>
    <p class="text-xl text-muted-foreground">
      You're logged in as {$auth.user.name || $auth.user.email}
    </p>
  {:else}
    <h1 class="text-4xl font-bold">Welcome to tRPC Svelte App</h1>
    <p class="text-xl text-muted-foreground">
      Please login or register to access your dashboard
    </p>
    <div class="flex justify-center gap-4">
      <Button variant="outline" href="/login">Login</Button>
      <Button href="/register">Register</Button>
    </div>
  {/if}
</div>