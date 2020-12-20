<script>

	import Web3 from 'web3'
	const toBN = Web3.utils.toBN
	export default {
		emits:['provide'],
		props:['selectedPool'],
		inject:['isNumber'],
		data(){ return {rawProvidedAmount: null }},
		computed:{
			providedAmount(){
				const amount = this.rawProvidedAmount || "1"
				const diff = toBN(10).pow(toBN(18 - this.decimals))
				return toBN(Web3.utils.toWei(amount)).div(diff)
			},
			pool(){return this.$store.state.pools[this.selectedPool]},
			balance(){return this.$store.state.balances[this.selectedPool]},
			decimals(){return ({WBTC: 8, ETH: 18})[this.selectedPool]},
			writeReceive() {
				const {totalAmount, supply} = this.pool
				const decimals = this.decimals
				const init = {
					WBTC:toBN("10000000000000"),
					ETH:toBN(1000)
				}[this.selectedPool]
				return totalAmount.isZero() ? this.providedAmount.mul(init)
					: this.providedAmount.mul(supply).div(totalAmount)
				// st _amount = this.providedAmount.isZero() ? toBN( 10 ** decimals ) || this.providedAmount
				return +(_amount * totalSupply / totalAmount).toFixed(2) || _amount * 1000 || null
			},
			avgReturns(){
				if (this.selectedPool == 'ETH'){
					return 'TBA'
				} else
				if (this.selectedPool == 'WBTC'){
					return 'TBA'
				}
			},
			projectedReturns(){
				if (this.selectedPool == 'ETH'){
					return 'TBA'
				} else
				if (this.selectedPool == 'WBTC'){
					return 'TBA'
				}
			},
			premiumsWriters(){
				const type = this.selectedPool == 'ETH' ? 'CALL' : 'PUT'
				return this.$store.getters.options.filter(x => x.type == type && x.state > 0)
					.map(x => x.premium)
					.reduce((x, y)=>x.add(y), toBN(0))
					.format(18,2)
					+ ' ' + this.selectedPool
			},
		}
	}
</script>
<template>
	<div id="js-provide" class="section provide-liquidity">
		<div class="category-title">{{$t("liquidity-providers.s-provide-liquidity.title")}}</div>

		<div class="radio">
			<div class="radio__value" :class="{select: selectedPool=='WBTC'}" @click="$root.selectedPool='WBTC'">
				<div class="radio__text">WBTC</div>
			</div>
			<div class="radio__value" :class="{select: selectedPool=='ETH'}" @click="$root.selectedPool='ETH'">
				<div class="radio__text">ETH</div>
			</div>
		</div>
		<div style="margin: 15px"></div>

		<div class="provide-liquidity-box">

			<div class="provide-liquidity__inputs-сontainer">
				<div class="notification">
					<div class="notification__text">
						{{$t("liquidity-providers.s-provide-liquidity.notification", {p0: selectedPool})}}
					</div>
				</div>
				<div class="form__info">
					<div class="form-info-box overflow-visible">
						<div class="text">{{$t("liquidity-providers.s-provide-liquidity.amount-providing")}}:</div>
						<div class="input connected" :class="{'with-max': true}" :data-type="selectedPool">
							<input type="text" v-model="rawProvidedAmount" @keypress="isNumber" placeholder="1">
							<div class="input__max" :class="{bad: providedAmount.gt(balance)}">{{$t('user.wallet-balance')}}: {{ balance.format(decimals,3) }} {{selectedPool}}</div>
						</div>
					</div>
					<div class="form-info-box with-arrow"><div class="provide-liquidity__arrow mobile-rotate"></div></div>
					<div class="form-info-box">
						<div class="text">{{$t("liquidity-providers.s-provide-liquidity.you-will-receive")}}:</div>
						<div class="input connected big-padding" :data-type="'write' + selectedPool">
							<input type="text" :value="writeReceive.format(18,2)" disabled @keypress="isNumber">
						</div>
					</div>
				</div>
			</div>
			<div class="provide-liquidity__submit-container">
				<button @click="$emit('provide', {providedAmount, writeReceive, decimals})"
					:disabled="providedAmount.gt(balance)"
					class="button primary">{{$t('pool.deposit')}}</button>
				<div class="text" v-html="$t(`liquidity-providers.s-provide-liquidity.click-deposit`, {
					p0: providedAmount.format(decimals, 3),
					p1: selectedPool})">
				</div>
				<!-- <div class="submit-container-text">
					<div class="to-b-text__text">
						Smart contracts code of the Hegic protocol has been audited by Trail of Bits. <a target="_blank" href="https://github.com/trailofbits/publications/blob/master/reviews/hegic-summary.pdf"><span>Read the security audit report →</span></a>
					</div>
				</div> -->
			</div>
			<div class="provide-liquidity__stats-сontainer">
				<div class="form__info">
					<div class="form-info-box">
						<div class="status__value">{{avgReturns}}</div>
						<div class="text">{{$t("liquidity-providers.s-provide-liquidity.stats[0]")}}</div>
					</div>
					<div class="form-info-box">
						<div class="status__value">{{projectedReturns}}</div>
						<div class="text">{{$t("liquidity-providers.s-provide-liquidity.stats[1]")}}</div>
					</div>
					<div class="form-info-box">
						<div class="status__value">{{premiumsWriters}}</div>
						<div class="text">{{$t("liquidity-providers.s-provide-liquidity.stats[2]")}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
