<script lang="ts">
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown } from 'lucide-svelte';

	interface $$Props {
		class?: string;
		title: string;
		open?: boolean;
		disabled?: boolean;
		headerActions?: any;
		variant?: 'default' | 'figma';
	}

	export let title: $$Props['title'];
	export let open: $$Props['open'] = false;
	export let disabled: $$Props['disabled'] = false;
	export let headerActions: $$Props['headerActions'] = null;
	export let variant: $$Props['variant'] = 'figma';

	let className: $$Props['class'] = undefined;
	export { className as class };

	const dispatch = createEventDispatcher<{ toggle: boolean }>();

	function toggle() {
		if (disabled) return;
		open = !open;
		dispatch('toggle', open);
	}

	$: variantClasses = {
		default: 'border border-border rounded-md',
		figma: 'border-b border-border'
	};
</script>

<div class={cn('accordion-item', variantClasses[variant], className)}>
	<!-- Accordion Header -->
	<button
		class={cn(
			'flex w-full items-center justify-between p-3 text-left font-medium transition-all',
			variant === 'figma' ? 'hover:bg-accent/50' : 'hover:bg-accent',
			disabled && 'opacity-50 cursor-not-allowed',
			open && variant === 'figma' && 'border-b border-border'
		)}
		on:click={toggle}
		{disabled}
		aria-expanded={open}
	>
		<div class="flex items-center space-x-2">
			<span class={cn(
				variant === 'figma' 
					? 'text-xs uppercase tracking-wide text-muted-foreground font-medium' 
					: 'text-sm text-foreground'
			)}>
				{title}
			</span>
		</div>
		
		<div class="flex items-center space-x-1">
			<!-- Header Actions Slot -->
			{#if headerActions}
				<div class="flex items-center space-x-1" on:click|stopPropagation>
					<slot name="header-actions" />
				</div>
			{/if}
			
			<!-- Chevron -->
			<ChevronDown 
				size={variant === 'figma' ? 12 : 16} 
				class={cn(
					'transition-transform duration-200',
					open && 'rotate-180'
				)} 
			/>
		</div>
	</button>

	<!-- Accordion Content -->
	{#if open}
		<div 
			class={cn(
				'overflow-hidden',
				variant === 'figma' ? 'pb-3 px-3' : 'p-3 pt-0'
			)}
		>
			<slot />
		</div>
	{/if}
</div>
