<script>
import {onMount} from "svelte";
import {postData, getData} from "$lib/apiHelpers"; 
import DeviceDetails from "$lib/components/DeviceDetails.svelte";
    import { logout } from "$lib/auth";
    import { goto } from "$app/navigation";

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

async function loggingOut() {
	await logout();
	goto('/');
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

<button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
	<span class="sr-only">Open sidebar</span>
	<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
		 <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
	</svg>
</button>

<aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
	<div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
		 <ul class="space-y-2">
				<li>
					 <a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
							<svg aria-hidden="true" class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
							<span class="ml-3">My Devices</span>
					 </a>
				</li>
				{#each devices as device }
				<li><a href="#" on:click|preventDefault={() => setActiveDevice(device)} class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"><span class="ml-3">{device.thingName}</span></a></li>			
			{/each}

				<li>
					 <a href="#" on:click|preventDefault={loggingOut}    class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
							<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd"></path></svg>
							<span class="flex-1 ml-3 whitespace-nowrap">Logout</span>
					 </a>
				</li>
		 </ul>
	</div>
</aside>

<div class="p-4 sm:ml-64">
	<div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
		 <!-- <div class="grid grid-cols-3 gap-4 mb-4">
				<div class="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
		 </div> -->
		 <div class="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
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
				<a href={"data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(thing))} download={thing.thingName + '.json'}>Download device config</a>
				{/if}
		 </div>
		 <!-- <div class="grid grid-cols-2 gap-4 mb-4">
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
		 </div> -->
		 {#if activeDevice}
	 
		 <div class="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
				<DeviceDetails device={activeDevice} />
		 </div>
		 {/if}
		 <!-- <div class="grid grid-cols-2 gap-4">
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
				<div class="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
					 <p class="text-2xl text-gray-400 dark:text-gray-500">+</p>
				</div>
		 </div> -->
	</div>
</div>

