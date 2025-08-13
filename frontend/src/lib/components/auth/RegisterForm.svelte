<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { Button, Input, Label } from '$lib/components/ui';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let name = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = '';
    
    const result = await auth.register(email, password, name);
    
    if (result.success) {
      goto('/');
    } else {
      error = result.error || 'Registration failed';
    }
    
    loading = false;
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4 w-full max-w-sm">
  <div class="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      type="text"
      bind:value={name}
      placeholder="Enter your name"
    />
  </div>

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
    {loading ? 'Loading...' : 'Register'}
  </Button>

  <p class="text-center text-sm">
    Already have an account?
    <a href="/login" class="text-blue-500 hover:underline">Login</a>
  </p>
</form>