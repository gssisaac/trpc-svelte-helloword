<script lang="ts">
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	interface Tab {
		id: string;
		label?: string;
		icon?: any;
		component?: any;
		disabled?: boolean;
	}

	interface $$Props {
		class?: string;
		tabs: Tab[];
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'outline' | 'ghost';
	}

	export let tabs: $$Props['tabs'];
	export let value: $$Props['value'] = tabs[0]?.id || '';
	export let size: $$Props['size'] = 'sm';
	export let variant: $$Props['variant'] = 'default';

	let className: $$Props['class'] = undefined;
	export { className as class };

	const dispatch = createEventDispatcher<{ change: string }>();

	function handleTabClick(tabId: string, disabled?: boolean) {
		if (disabled) return;
		value = tabId;
		dispatch('change', tabId);
	}

	$: sizeClasses = {
		sm: 'h-7 px-2 text-xs',
		md: 'h-8 px-3 text-sm',
		lg: 'h-9 px-4 text-sm'
	};

	$: variantClasses = {
		default: 'bg-muted',
		outline: 'border border-border',
		ghost: 'bg-transparent'
	};
</script>

<div
	class={cn(
		'inline-flex items-center justify-center rounded-md p-1',
		variantClasses[variant],
		className
	)}
	role="tablist"
>
	{#each tabs as tab}
		<button
			class={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				sizeClasses[size],
				value === tab.id
					? 'bg-background text-foreground shadow-sm'
					: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
				tab.disabled && 'opacity-50 cursor-not-allowed'
			)}
			disabled={tab.disabled}
			role="tab"
			aria-selected={value === tab.id}
			on:click={() => handleTabClick(tab.id, tab.disabled)}
		>
			{#if tab.component}
				<svelte:component this={tab.component} size={14} class="mr-1" />
			{/if}
			{#if tab.icon && !tab.component}
				<span class="mr-1">{tab.icon}</span>
			{/if}
			{#if tab.label}
				<span>{tab.label}</span>
			{/if}
		</button>
	{/each}
</div>
