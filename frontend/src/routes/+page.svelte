<script>
import {getData} from "$lib/apiHelpers"; 
import { user, logout } from "$lib/auth";

let data = {body: ""};

async function onClick() {
		data = await getData("/");

		return false;
	}

</script>

<h1>Basic IoT Demo App</h1>

{#if $user != null}
 <button type="button" on:click={logout}>logout</button>
{:else}
<a href="/login">Login</a>
{/if}


<p>This app is part of a demonstrator to show how to setup a generic IoT architecture.
</p>

					<!-- svelte-ignore a11y-invalid-attribute -->
					<a
						href="#"
						title="do api call"
						on:click|preventDefault={() =>
							onClick()}
						>Do an api call</a
					>

					<p>
						Api Response: {data.body}
					</p>

<p>
	Made by Sirris
</p>


