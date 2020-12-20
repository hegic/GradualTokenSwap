<script>
	export default {
		emits:['close'],
		props:['loadInfo']
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header">{{loadInfo.header}}</div>
			<!-- <div class="form__header">Loading...</div> -->

			<div class="pop-up__img loading"></div>
			<div class="text big">{{loadInfo.text}}</div>

			<!-- <div class="text big">
				Waiting for something, <br class="hide-on-phone--min">
				i don’t know, just waiting...
			</div> -->

		</div>
	</div>
</template>
