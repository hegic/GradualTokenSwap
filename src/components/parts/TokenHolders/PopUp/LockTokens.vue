<script>
	import Web3 from 'web3'
	const {toBN, toWei} = Web3.utils

	export default {
		emits:['close', 'rs-stake'],
		inject:['isNumber'],
		props:['params'],
		data(){return{
			rawValue: ''
		}},
		computed:{
			pool(){return this.params},
			balance(){
				return this.$store.state.balances['write'+this.pool]
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
			<div class="form__header" v-html="$t(`pop-up.p-lock-tokens.title`)"></div>

			<div class="form__info inp">
				<div class="form-info-box">

					<div class="text">{{$t(`pop-up.p-lock-tokens.amount-lock`)}}:</div>
					<div class="input connected with-max" :data-type="'write'+pool">
						<input

							type="text"
							v-model="rawValue"
							:placeholder="balance.format(decimals, decimals)"
							@keypress="isNumber" >
						<div
							class="input__max"
							:class="{bad: value.gt(balance)}">
							{{$t(`pop-up.p-lock-tokens.maximum-amount`)}}:
							{{balance.format(decimals, decimals)}}

						</div>
					</div>
				</div>
			</div>

			<div class="text" v-html="$t(`pop-up.p-lock-tokens.text`)"></div>

			<div class="pop-up__buttons">
				<button
					:disabled="value.gt(balance)"
					class="button primary"
					v-text="$t('pop-up.confirm')"
					@click="$emit('rs-stake',{pool, value});$emit('close')"/>

				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
			<div class="text" :style="{color:'#667fcc'}">
Rewards in rHEGIC will be locked. Each of them represents one HEGIC token which will be claimable after the the cumulative on-chain trading volume on Hegic during the Phase I exceeds $100M or on 11/11/2021. The Phase I rewards unlock ceremony will take 6 months. During this period of time Phase I rewards will be unlocked on a weekly basis (4.17% of Phase I rewards per week) and token holders will be able to claim them with 100% of Phase I rewards distributed at the end of the ceremony. You will be able to swap rHEGIC for HEGIC (1:1).
			</div>
		</div>
	</div>
</template>
