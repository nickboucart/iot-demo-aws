<script>
	import {onMount } from 'svelte';
	import {goto} from '$app/navigation';
	import { user, login } from '$lib/auth.js';


	let password = "";
	let email = "";
	let loggingIn = false;

	async function handleSubmit() {
		loggingIn = true;
		await login(email, password);
		goto('/app');
	}

	onMount(() => {
		if ($user) {
     goto('/app');
		}
	});

</script>

<div class=" p-6 bg-gray-200 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 grid place-items-center h-screen">
	<div>
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Login</h5>

	<form on:submit|preventDefault={handleSubmit}>
  <div class="mb-6">
    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
    <input type="email" bind:value={email} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required>
  </div>
  <div class="mb-6">
    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
    <input type="password" bind:value={password} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
  </div>
	{#if loggingIn}
	<button type="button" class="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center" disabled>Logging in...</button>
	{:else}
	<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log in</button>
	{/if}
</form>
</div>
</div>	