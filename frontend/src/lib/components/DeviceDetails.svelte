<script>
	import { getData, postData } from "$lib/apiHelpers";
	import { LineChart } from "@carbon/charts-svelte";

	// import "@carbon/styles/css/styles.css";
	import "@carbon/charts/styles.css";
	import Card from "./Card.svelte";
	export let device;

	async function fetchMetrics(name) {
		const data = await getData("/devices/" + name + "/metrics");
		const metricData = [];
		data.forEach((datum) => {
			metricData.push({ ts: datum.ts, group: "humidity", hum: datum.hum });
			metricData.push({ ts: datum.ts, group: "temperatur", temp: datum.temp });
		});
		return metricData;
	}

	async function setColor(color) {
		await postData("/devices/" + device.thingName + "/shadow", { color });
	}
</script>

<div class="flex flex-row">
	<Card title="Settings for {device.thingName}" size="basic-1/4">
		<button
			type="button"
			on:click|preventDefault={() => setColor("green")}
			class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>set color to green</button
		>
		<button
			type="button"
			on:click|preventDefault={() => setColor("red")}
			class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>set color to red</button
		>
	</Card>
</div>

<Card title="Metrics for {device.thingName}" size="basic-1/4">



{#await fetchMetrics(device.thingName)}
	<p>fetching metrics...</p>
{:then metrics}
	<LineChart
		data={metrics}
		options={{
			axes: {
				left: {
					title: "Temperature (°C)",
					mapsTo: "temp",
				},
				bottom: {
					mapsTo: "ts",
					title: "Time",
					scaleType: "time",
				},
				right: {
					title: "Humidity (%)",
					mapsTo: "hum",
					correspondingDatasets: ["humidity"],
				},
			},
			curve: "curveMonotoneX",
			experimental: true,
			zoomBar: {
				top: {
					enabled: true,
				},
			},
			timeScale: {
				addSpaceOnEdges: 0,
				timeIntervalFormats: {
					"15seconds": {
						primary: "HH:mm",
						secondary: "HH:mm",
					},
				},
			},
			height: "400px",
		}}
	/>
{/await}
</Card>

