<script lang="ts">
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';

	interface $$Props {
		class?: string;
		horizontalConstraint?: 'left' | 'right' | 'center' | 'left-right' | 'scale';
		verticalConstraint?: 'top' | 'bottom' | 'center' | 'top-bottom' | 'scale';
		disabled?: boolean;
	}

	export let horizontalConstraint: $$Props['horizontalConstraint'] = 'left';
	export let verticalConstraint: $$Props['verticalConstraint'] = 'top';
	export let disabled: $$Props['disabled'] = false;

	let className: $$Props['class'] = undefined;
	export { className as class };

	const dispatch = createEventDispatcher<{ 
		changeHorizontal: typeof horizontalConstraint;
		changeVertical: typeof verticalConstraint;
	}>();

	// Constraint anchor positions
	$: anchors = {
		// Horizontal anchors
		left: horizontalConstraint === 'left' || horizontalConstraint === 'left-right',
		right: horizontalConstraint === 'right' || horizontalConstraint === 'left-right',
		centerH: horizontalConstraint === 'center',
		scaleH: horizontalConstraint === 'scale',
		
		// Vertical anchors  
		top: verticalConstraint === 'top' || verticalConstraint === 'top-bottom',
		bottom: verticalConstraint === 'bottom' || verticalConstraint === 'top-bottom',
		centerV: verticalConstraint === 'center',
		scaleV: verticalConstraint === 'scale'
	};

	function handleAnchorClick(anchor: string) {
		if (disabled) return;
		
		if (['left', 'right', 'center', 'left-right', 'scale'].includes(anchor)) {
			horizontalConstraint = anchor as typeof horizontalConstraint;
			dispatch('changeHorizontal', horizontalConstraint);
		}
		
		if (['top', 'bottom', 'center', 'top-bottom', 'scale'].includes(anchor)) {
			verticalConstraint = anchor as typeof verticalConstraint;
			dispatch('changeVertical', verticalConstraint);
		}
	}
</script>

<div 
	class={cn(
		'relative flex items-center justify-center w-20 h-16 bg-background border border-border rounded p-2',
		disabled && 'opacity-50 cursor-not-allowed',
		className
	)}
>
	<!-- Container frame -->
	<div class="absolute inset-2 border border-muted-foreground rounded-sm"></div>
	
	<!-- Center element (represents the selected object) -->
	<div class="relative w-6 h-6 bg-blue-500 rounded-sm z-10"></div>
	
	<!-- Constraint anchors -->
	<!-- Top anchor -->
	<button
		class={cn(
			'absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full transition-colors',
			anchors.top ? 'bg-blue-500' : 'bg-muted-foreground hover:bg-foreground'
		)}
		on:click={() => handleAnchorClick('top')}
		{disabled}
	></button>
	
	<!-- Bottom anchor -->
	<button
		class={cn(
			'absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full transition-colors',
			anchors.bottom ? 'bg-blue-500' : 'bg-muted-foreground hover:bg-foreground'
		)}
		on:click={() => handleAnchorClick('bottom')}
		{disabled}
	></button>
	
	<!-- Left anchor -->
	<button
		class={cn(
			'absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-colors',
			anchors.left ? 'bg-blue-500' : 'bg-muted-foreground hover:bg-foreground'
		)}
		on:click={() => handleAnchorClick('left')}
		{disabled}
	></button>
	
	<!-- Right anchor -->
	<button
		class={cn(
			'absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-colors',
			anchors.right ? 'bg-blue-500' : 'bg-muted-foreground hover:bg-foreground'
		)}
		on:click={() => handleAnchorClick('right')}
		{disabled}
	></button>
	
	<!-- Connection lines when both sides are anchored -->
	{#if anchors.left && anchors.right}
		<div class="absolute left-2 right-2 top-1/2 h-px bg-blue-500 transform -translate-y-1/2"></div>
	{/if}
	
	{#if anchors.top && anchors.bottom}
		<div class="absolute top-2 bottom-2 left-1/2 w-px bg-blue-500 transform -translate-x-1/2"></div>
	{/if}
</div>
