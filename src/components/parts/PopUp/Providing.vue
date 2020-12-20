<script>
	export default {
		emits:['close', 'provide'],
		props:['pool', 'options']
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header"  v-html="$t(`pop-up.p-providing.title`)"></div>

			<div class="form__info">
				<div class="form-info-box">
					<div class="text">{{options.providedAmount.format(options.decimals)}} {{pool}}</div>
				</div>
				<div class="form-info-box with-arrow"><div class="provide-liquidity__arrow"></div></div>
				<div class="form-info-box">
					<div class="text">{{options.writeReceive.format(18,2)}} write{{pool}}</div>
				</div>
			</div>

			<div class="text" v-html="$t(`pop-up.p-providing.text[0]`, {p0: pool, p1: pool=='ETH'? $t(`option.call`):$t(`option.put`)})"></div>
			<div class="text">
				<span class="bold">{{$t(`pop-up.p-providing.text[1]`)}}</span> <br>
				<span class="bold">{{$t(`pop-up.p-providing.text[2]`)}}</span> <br><br>
			</div>
			<div class="pop-up__buttons">
				<button class="button primary" @click="$emit('provide', options.providedAmount); $emit('close')">{{$t("pop-up.confirm")}}</button>
				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
