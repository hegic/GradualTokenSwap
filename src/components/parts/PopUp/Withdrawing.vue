<script>
	import Web3 from 'web3'
	const toBN = Web3.utils.toBN

	export default {
		emits:['close', 'withdraw'],
		props:['selectedPool', 'params'],
		inject:['isNumber'],
		data(){
			const decimals = ({WBTC: 8, ETH: 18})[this.selectedPool]
			const value = this.params.value
			 	&& (this.params.value.toString() / 10 ** decimals).toString()

			return {
				decimals, value
			}
		},
		computed:{
			pool(){return this.$store.state.pools[this.selectedPool]},
			poolAvailable(){
				const balances = this.$store.state.balances
				return balances['write' + this.selectedPool]
					// .add(balances['s' + this.selectedPool])
					.mul(this.pool.totalAmount)
					.div(this.pool.supply)
			},
			selectedAmount(){
				if(this.value){
					const diff = toBN(10).pow(toBN(18 - this.decimals))
					return toBN(Web3.utils.toWei(this.value)).div(diff)
				} else return this.poolAvailable
			},
		},
	}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header" v-html="$t(`pop-up.p-withdrawing.title`)"></div>

			<div class="form__info inp">
				<div class="form-info-box">
					<div class="text">{{$t(`pop-up.p-withdrawing.amount-for-withdraw`)}}:</div>
					<div class="input connected with-max" :data-type="selectedPool">
						<input type="text" v-model="value" :placeholder="poolAvailable.format(decimals, decimals)" @keypress="isNumber" @input="params.profitOnly = false">
						<div class="input__max" :class="{bad: selectedAmount.gt(poolAvailable)}">{{$t(`pop-up.p-withdrawing.maximum-amount`)}}: {{ poolAvailable.format(decimals, 4) }} {{ selectedPool }}</div>
					</div>
				</div>
			</div>

			<div class="text" style="text-align:left; font-size:12px">
				Your balance: {{$store.state.balances['write'+selectedPool].format(18,4)}} write{{selectedPool}}
				<br>
				Locked on the StakingRewards: {{$store.state.balances['s'+selectedPool].format(18,4)}} write{{selectedPool}}
			</div>

			<div class="form__info">
				<div class="form-info-box">
					<div class="text">{{selectedAmount.mul(pool.supply).div(pool.totalAmount).format(18,3)}} write{{selectedPool}}</div>
				</div>
				<div class="form-info-box with-arrow"><div class="provide-liquidity__arrow"></div></div>
				<div class="form-info-box">
					<div class="text">{{selectedAmount.format(decimals,3) }} {{selectedPool}}</div>
				</div>
			</div>

			<div class="text" v-if="pool.withdrawalLockup < new Date()" v-html="$t(`pop-up.p-withdrawing.text[0]`, {p0:selectedPool})"></div>
			<div class="text" v-else v-html="$t(`pop-up.p-withdrawing.text[1]`, {p0: pool.withdrawalLockup})"></div>

			<div class="pop-up__buttons">
				<button
					:disabled="selectedAmount.gt(poolAvailable) || pool.withdrawalLockup >= new Date()"
					class="button primary"
					@click="$emit('withdraw', {amount:selectedAmount, selectedPool}); $emit('close')">{{$t("pop-up.confirm")}}</button>
				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
