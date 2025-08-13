<script lang="ts">
	import { cn } from '$lib/utils';

	interface $$Props {
		class?: string;
		value?: number;
		placeholder?: string;
		disabled?: boolean;
		readonly?: boolean;
		id?: string;
		name?: string;
		required?: boolean;
		min?: number;
		max?: number;
		step?: number;
	}

	export let value: $$Props['value'] = 0;
	export let placeholder: $$Props['placeholder'] = undefined;
	export let disabled: $$Props['disabled'] = false;
	export let readonly: $$Props['readonly'] = false;
	export let id: $$Props['id'] = undefined;
	export let name: $$Props['name'] = undefined;
	export let required: $$Props['required'] = false;
	export let min: $$Props['min'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let step: $$Props['step'] = undefined;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	type="number"
	{id}
	{name}
	{placeholder}
	{disabled}
	{readonly}
	{required}
	{min}
	{max}
	{step}
	bind:value
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:input
	{...$$restProps}
/>
