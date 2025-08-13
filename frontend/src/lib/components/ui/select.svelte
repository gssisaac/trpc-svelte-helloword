<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface $$Props {
		class?: string;
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		options: SelectOption[];
		id?: string;
		name?: string;
		required?: boolean;
	}

	export let value: $$Props['value'] = '';
	export let placeholder: $$Props['placeholder'] = 'Select an option...';
	export let disabled: $$Props['disabled'] = false;
	export let options: $$Props['options'] = [];
	export let id: $$Props['id'] = undefined;
	export let name: $$Props['name'] = undefined;
	export let required: $$Props['required'] = false;

	let className: $$Props['class'] = undefined;
	export { className as class };

	let isOpen = false;
	let selectElement: HTMLButtonElement;

	const dispatch = createEventDispatcher<{ change: string }>();

	function toggleOpen() {
		if (!disabled) {
			isOpen = !isOpen;
		}
	}

	function selectOption(option: SelectOption) {
		if (!option.disabled) {
			value = option.value;
			isOpen = false;
			dispatch('change', value);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
			selectElement.focus();
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleOpen();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectElement && !selectElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	$: selectedOption = options.find(opt => opt.value === value);
	$: displayText = selectedOption ? selectedOption.label : placeholder;
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative">
	<button
		bind:this={selectElement}
		class={cn(
			'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		type="button"
		role="combobox"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
		{id}
		{disabled}
		on:click={toggleOpen}
		on:keydown={handleKeydown}
		{...$$restProps}
	>
		<span class={selectedOption ? '' : 'text-muted-foreground'}>
			{displayText}
		</span>
		<ChevronDown class="h-4 w-4 opacity-50" />
	</button>

	{#if isOpen}
		<div
			class="absolute top-full z-50 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
			role="listbox"
		>
			{#each options as option}
				<button
					class="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
					type="button"
					role="option"
					aria-selected={value === option.value}
					disabled={option.disabled}
					on:click={() => selectOption(option)}
				>
					{#if value === option.value}
						<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
							<div class="h-2 w-2 rounded-full bg-current"></div>
						</span>
					{/if}
					{option.label}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Hidden select for form submission -->
	<select bind:value {name} {required} class="sr-only" tabindex="-1" aria-hidden="true">
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>
</div>
