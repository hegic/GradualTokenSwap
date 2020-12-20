<script>
	export default {
		props:['type']
	}
</script>
<template>
	<label class="emoji-box">
		<div v-if="type=='0'" class="emoji-icon magic"> </div>
		<div v-if="type=='1'" class="emoji-icon rabbi"> </div>
		<div v-if="type=='2'" class="emoji-icon elfo"> </div>
		<div v-if="type=='3'" class="emoji-icon fairy"> </div>
		<div v-if="type=='4'" class="emoji-icon wiz"> </div>
		<div v-if="type=='5'" class="emoji-icon genie"> </div>
		<div v-if="type=='6'" class="emoji-icon drago"> </div>
	</label>
</template>


