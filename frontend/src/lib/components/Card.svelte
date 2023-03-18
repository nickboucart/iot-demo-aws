<script>
export let title = "Provide a title";
export let size = "basis-full";

</script>


<div class="{size} p-4 bg-white border border-gray-200 rounded-lg shadow m-2 dark:bg-gray-800 dark:border-gray-700">
	<h5 class="text-xl font-medium text-gray-900 dark:text-white pb-2">{title}</h5>
<slot>
	<em>Provide some content for this card</em>
</slot>
	
</div>
