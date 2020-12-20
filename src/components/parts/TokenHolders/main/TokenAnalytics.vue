<script>
	import Web3 from 'web3'
	const {toBN} = Web3.utils

	export default {
		computed:{
			stake(){
				return this.$store.state.staking.ETH.totalLots
					.add(this.$store.state.staking.WBTC.totalLots)
			},
			hStake(){
				return this.stake.mul(toBN(888000))
			},
			ETHFees(){
				return this.$store.getters.options
					.filter(x => x.currency == 'ETH')
					.map(x => x.settlementFee)
					.reduce((x, y) => x.add(y), toBN(0))
			},
			WBTCFees(){
				return this.$store.getters.options
					.filter(x => x.currency == 'WBTC')
					.map(x => x.settlementFee)
					.reduce((x, y) => x.add(y), toBN(0))
			},
			USDFees(){
				return this.WBTCFees.mul(this.$store.state.prices.WBTC).mul(toBN(1e10))
					.add(this.ETHFees.mul(this.$store.state.prices.ETH))
			},
		}
	}
</script>
<template>
	<div class="section">
		<!-- <div class="category-title">{{$t("token-holders.s-token-analytics.title")}}</div> -->
		
		<!-- <div class="th-switch-titles">
			<div class="hero-title" v-html="$t(`token-holders.s-token-analytics.hero-title`)"></div>
			<div class="hero-text">
				<div
					v-for="i in $tm(`token-holders.s-token-analytics.hero-texts`).length" 
					v-html="$t(`token-holders.s-token-analytics.hero-texts[${i-1}]`)"></div>
			</div>
		</div> -->

		<div class="summary-cards documents">
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title">{{$t('token-holders.s-token-analytics.info[0]')}}</div>
					<div class="summary-card__value">{{hStake.format(0)}} HEGIC</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title">{{$t('token-holders.s-token-analytics.info[1]')}}</div>
					<div class="summary-card__value">{{stake}} / 3,000</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title">{{$t('token-holders.s-token-analytics.info[2]')}}</div>
					<div class="summary-card__value">1%</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title">{{$t('token-holders.s-token-analytics.info[3]')}}</div>
					<div class="summary-card__value">${{USDFees.format(18+8,2)}}</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title">{{$t('token-holders.s-token-analytics.info[4]')}}</div>
					<div class="summary-card__value">{{WBTCFees.format(8,4)}} WBTC</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title">{{$t('token-holders.s-token-analytics.info[5]')}}</div>
					<div class="summary-card__value">{{ETHFees.format(18,4)}} ETH</div>
				</div>
			</div>
		</div>

	</div>
</template>
