<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { Button, Input, Label } from '$lib/components/ui';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = '';
    
    const result = await auth.login(email, password);
    
    if (result.success) {
      goto('/');
    } else {
      error = result.error || 'Login failed';
    }
    
    loading = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4 w-full max-w-sm">
  <div class="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      bind:value={email}
      placeholder="Enter your email"
      required
    />
  </div>

  <div class="space-y-2">
    <Label htmlFor="password">Password</Label>
    <Input
      id="password"
      type="password"
      bind:value={password}
      placeholder="Enter your password"
      required
    />
  </div>

  {#if error}
    <p class="text-red-500 text-sm">{error}</p>
  {/if}

  <Button type="submit" class="w-full" disabled={loading}>
    {loading ? 'Loading...' : 'Login'}
  </Button>

  <p class="text-center text-sm">
    Don't have an account?
    <a href="/register" class="text-blue-500 hover:underline">Register</a>
  </p>
</form>