<script>
	export default {

		emits:['close', 'exercise'],
		props:['option'],
		computed:{
		}
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>

			<div class="form__header" v-html="$t(`pop-up.p-execute.title`)"></div>

			<div class="form__info">
				<div class="form-info-box">
					<div class="text">{{$t(`pop-up.p-execute.you-will-receive`)}}:
					<span>{{option.profit.format(option.decimals, 4)}} {{option.currency}}</span></div>
				</div>
			</div>

			<div class="form__info">
				<div class="form-info-box">
					<div class="text">{{option.good ? $t(`pop-up.p-execute.your-profits`) : $t(`pop-up.p-execute.your-losses`)}}: <span :class="{bad:!option.good, good:option.good}">{{option.good ? '+' : '-'}}${{option.pl.USD}}</span></div>
				</div>
			</div>

			<div class="text" v-html="$t(`pop-up.p-execute.text`, {p0: profit})"></div>

			<div class="pop-up__buttons">
				<button class="button primary" @click="$emit('exercise', option); $emit('close')">{{$t("pop-up.confirm")}}</button>
				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
