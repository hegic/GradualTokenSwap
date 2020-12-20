<script>
	export default {
			emits:['close', 'confirm'],
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header">{{$t("pop-up.p-confirm.title")}}</div>


			<div class="text big">
				{{$t("pop-up.p-confirm.text[0]")}}<br class="hide-on-phone--min">
				{{$t("pop-up.p-confirm.text[1]")}}
			</div>

			<div class="pop-up__buttons">
				<button class="button primary" @click="$emit('confirm', option); $emit('close')">{{$t("pop-up.confirm")}}</button>
				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
