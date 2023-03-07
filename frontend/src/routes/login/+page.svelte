<script>
	import { user, login } from '$lib/auth.js';


	let password = "";
	let email = "";
	async function handleSubmit() {
		await login(email, password);
	}
</script>

<div>
	<h1>Login</h1>
	<pre>{JSON.stringify($user, null, 2)}</pre>
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			Email:
			<input type="email" bind:value={email} />
		</label>
		<label>
			Password:
			<input type="password" bind:value={password} />
		</label>

		<button type="submit">Submit</button>
	</form>
</div>
