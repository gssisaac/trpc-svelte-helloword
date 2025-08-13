<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { Button } from '$lib/components/ui';

  onMount(() => {
    auth.initialize();
  });
</script>

<div class="min-h-screen bg-background">
  <header class="border-b">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a href="/" class="text-xl font-bold">tRPC Svelte App</a>
      
      {#if $auth.isLoading}
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      {:else if $auth.isAuthenticated && $auth.user}
        <div class="flex items-center gap-4">
          <span>Welcome, {$auth.user.name || $auth.user.email}</span>
          <Button variant="outline" on:click={() => auth.logout()}>Logout</Button>
        </div>
      {:else}
        <div class="flex gap-4">
          <Button variant="outline" href="/login">Login</Button>
          <Button href="/register">Register</Button>
        </div>
      {/if}
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>