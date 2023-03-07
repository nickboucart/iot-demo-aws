<script>
	import {getData, postData} from "$lib/apiHelpers";
	import { LineChart } from "@carbon/charts-svelte";

// import "@carbon/styles/css/styles.css";
import "@carbon/charts/styles.css";
	export let device;

	async function fetchMetrics(name) {
		const data = await getData("/devices/" + name + "/metrics");
		const metricData = [];
		data.forEach(datum => {
			metricData.push({ts: datum.ts, group: "humidity", hum: datum.hum});
			metricData.push({ts: datum.ts, group: "temperatur", temp: datum.temp});
		});
		return metricData;
	}

	async function setColor(color) {
		await postData('/devices/' + device.thingName + '/shadow', {color})
	}



</script>

<p> Details for {device.thingName}</p>

<a href="#" on:click|preventDefault={() => setColor("green")}>set color to green</a>
<a href="#" on:click|preventDefault={() => setColor("red")}>set color to red</a>



{#await fetchMetrics(device.thingName)}
<p>fetching metrics...</p>
{:then metrics} 
<LineChart data={metrics} 
options={{
	"title": "Metrics",
	"axes": {
		"left": {
			"title": "Temperature (°C)",
			"mapsTo": "temp"
		},
		"bottom": {
			"mapsTo": "ts",
			"title": "Time",
			"scaleType": "time"
		},
		"right": {
			"title": "Humidity (\%)",
			"mapsTo": "hum",	
			"correspondingDatasets": [
				"humidity"
			]
		}
	},
	"curve": "curveMonotoneX",
	"experimental":true,
	"zoomBar": {
		"top": {
			enabled: true
		}
	},
  "timeScale": {
		"addSpaceOnEdges": 0,
    "timeIntervalFormats": {
      "15seconds": {
        "primary": "HH:mm",
        "secondary": "HH:mm"
      }
    }
  },
	"height": "400px"
}}
></LineChart>
{/await}