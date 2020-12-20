<script>
	export default {
		emits:['close'],
		props: {
			message: String,
		}
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header error">{{$t("pop-up.p-error.title")}}</div>

			<div class="pop-up__img error"></div>

			<div class="text big" v-text="message"></div>

			<div class="pop-up__buttons">
				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
