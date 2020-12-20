<script>
	import Web3 from 'web3'
	const {toBN, toWei} = Web3.utils

	export default {
		emits:['close'],
		inject:['isNumber'],
		props:['params'],
		data(){return{
			rawValue: ''
		}},
		computed:{
			pool(){return this.params},
			balance(){
				return this.$store.state.balances['s'+this.pool]
			},
			decimals(){return 18},
			value(){
				if(!this.rawValue) return this.balance
				const diff = toBN(10).pow(toBN(18 - this.decimals))
				return toBN(toWei(this.rawValue)).div(diff)
			},
		},
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header" v-html="$t(`pop-up.p-unlock-tokens.title`)"></div>

			<div class="form__info inp">
				<div class="form-info-box">
					<div class="text">{{$t(`pop-up.p-unlock-tokens.amount-unlock`)}}:</div>
					<div class="input connected with-max" :data-type="'write' + pool">
						<input
							type="text"
							v-model="rawValue"
							:placeholder="balance.format(18,18)"
							@keypress="isNumber" >
						<div
							class="input__max"
							:class="{bad: value.gt(balance)}">
							{{$t(`pop-up.p-unlock-tokens.max-amount`)}}: {{balance.format(18,18)}}
						</div>
					</div>
				</div>
			</div>

			<div class="text" v-html="$t(`pop-up.p-unlock-tokens.text`)"></div>

			<div class="pop-up__buttons">
				<button
					:disabled="value.gt(balance)"
					class="button primary"
					v-text="$t('pop-up.confirm')"
					@click="$store.dispatch('rsWithdraw',{pool, value});$emit('close')"/>

				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
