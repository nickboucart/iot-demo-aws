<script>
import {onMount} from "svelte";
import {postData, getData} from "$lib/apiHelpers"; 
import DeviceDetails from "$lib/components/DeviceDetails.svelte";

/**
     * @type {any[]}
     */
let devices = [];

let thingName = "";
let thing = null;
let activeDevice = null;

/**
     * @param {string } name
     */
function isValidateDeviceName(name) {
	return name.length > 5;
}

function setActiveDevice(device) {
	activeDevice = device;
}

async function getThings() {
	devices = await getData('/devices');
}

async function handleSubmit(){
	thing = await postData("/devices", {thingName});
	thingName = "";
	devices = [...devices, thing]
}

onMount(async () => {
	await getThings()
});

</script>



<h1>App</h1>


	<h2>Register new device</h2>

	<form on:submit|preventDefault={handleSubmit}>
		<label>
			Name your device:
			<input type="text" bind:value={thingName} />
		</label>

		<button type="submit" disabled={!isValidateDeviceName(thingName)}>Submit</button>
	</form>

	{#if thing}
	<h2>download your device config below. Be carefull, this is only displayed once!</h2>
	<pre>{JSON.stringify(thing)}</pre>
	<a href={"data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(thing))} download={thing.thingName + '.json'}>Download device config</a>

	{/if}



	<h2>My devices</h2>
	<ul>
		{#each devices as device }
			<li><a href="#" on:click|preventDefault={() => setActiveDevice(device)}>{device.thingName}</a></li>			
		{/each}
	</ul>

	{#if activeDevice}
	<DeviceDetails device={activeDevice} />

	{/if}