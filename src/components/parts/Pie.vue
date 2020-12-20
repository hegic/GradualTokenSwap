<script>
	export default {
		props:['value']
	}
</script>
<template>
	<svg v-if="value>=0" width="100%" height="100%" viewBox="2.5 2.5 37 37" class="donut pie">
		<circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#ffffff00"></circle>
		<circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#1D509E" stroke-width="4.6"></circle>
		<circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#45FFF4" stroke-width="4.6"
			:stroke-dasharray="`${value}  ${100 - value}`" stroke-dashoffset="25"></circle>
	</svg>

	<svg v-else width="100%" height="100%" viewBox="2.5 2.5 37 37" class="donut pie">
		<circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#ffffff00"></circle>
		<circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#FF6666" stroke-width="4.6"></circle>
		<circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#1D509E" stroke-width="4.6"
			:stroke-dasharray="`${100 + value} ${-value}`" stroke-dashoffset="25"></circle>
	</svg>
</template>


