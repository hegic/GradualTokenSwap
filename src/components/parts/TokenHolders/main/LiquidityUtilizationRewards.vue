<script>
	import Web3 from 'web3'
	import {mapGetters, mapState} from 'vuex'
	const {toBN} = Web3.utils
	export default {
		data(){ return {
			liquidityPoolVue: 'ALL'
		}},
		computed:{
			...mapGetters(['options']),
			...mapState(['accounts']),
			today(){
				const tmp = {
					WBTC: this.$store.state.optionRewards.WBTC.today,
					ETH: this.$store.state.optionRewards.ETH.today,
				}
				return  this.liquidityPoolVue == 'ALL' ?
					tmp.WBTC.add(tmp.ETH) : tmp[this.liquidityPoolVue]
			},
			total(){
				return toBN('165000000000000000000000')
					.mul(this.liquidityPoolVue == 'ALL' ? toBN(2) : toBN(1))
			},
			share(){ return this.today.mul(toBN(10000)).div(this.total) },
			rewardedOptions() {
				return this.options
					.filter(x =>
						(x.currency == this.liquidityPoolVue || this.liquidityPoolVue == 'ALL')
						&& x.holder == this.accounts[0]
					)
					.sort((x,y) => x.rewarded - y.rewarded)
			}
		},
		methods:{
			reward(option){
				const rate = this.$store.state.optionRewards[option.currency].rewardsRate
				return option.paid.mul(rate).div(toBN(1e8))
			}
		}
	}
</script>
<template>
	<div class="section">
		<!-- <div class="category-title">{{$t("token-holders.s-liquidity-utilization-rewards.title")}}</div> -->
		<!-- <div style="margin: 20px;"></div> -->


		<div class="th-switch-titles">
			<div class="hero-title" v-html="$t(`token-holders.s-liquidity-utilization-rewards.hero-title`)"></div>
			<div class="hero-text">
				<div
					v-for="i in $tm(`token-holders.s-liquidity-utilization-rewards.hero-texts`).length"
					v-html="$t(`token-holders.s-liquidity-utilization-rewards.hero-texts[${i-1}]`)"></div>
			</div>
		</div>



		<div class="radio">
			<div class="radio__value" :class="{select: liquidityPoolVue == 'ALL'}" @click="liquidityPoolVue = 'ALL'">
				<div class="radio__text">ALL</div>
			</div>
			<div class="radio__value" :class="{select: liquidityPoolVue == 'WBTC'}" @click="liquidityPoolVue = 'WBTC'">
				<div class="radio__text">WBTC</div>
			</div>
			<div class="radio__value" :class="{select: liquidityPoolVue == 'ETH'}" @click="liquidityPoolVue = 'ETH'">
				<div class="radio__text">ETH</div>
			</div>
		</div>
		<div style="margin: 8px;"></div>


		<div class="your-option__table">
			<table class="table-options">
				<tr class="table-options__header">
					<th>{{$t("table.id")}}</th>
					<th>{{$t("table.type")}}</th>
					<th>{{$t("table.amount")}}</th>
					<th>{{$t("table.fee")}}</th>
					<th>{{$t("table.reward")}}</th>
					<th>{{$t("table.claim")}}</th>
				</tr>
				<tr v-if="rewardedOptions.length == 0" class="table-options__tr-vals">
					<td class="null" colspan="6">{{$t("user.no-active-options")}}</td>
				</tr>
				<tr v-for="option in rewardedOptions" class="table-options__tr-vals">
					<td>{{option.id}}</td>
					<td>{{option.type}}</td>
					<td>
						<div class="tr-vals__text big">{{option.amount.format(option.decimals,4)}} {{option.currency}}</div>
						<div class="tr-vals__text additional">≈ ${{
							option.amount.mul($store.state.prices[option.currency])
								.format(option.decimals + 8, 3)
						}}</div>
					</td>
					<td>
						<div>{{option.paid.format(option.decimals, 4)}} {{option.currency}}</div>
						<div class="tr-vals__text additional">≈ ${{
							option.paid.mul($store.state.prices[option.currency])
								.format(option.decimals + 8, 3)
						}}</div>
					</td>
					<td>
						<div>{{reward(option).format(18,2)}} rHEGIC</div>
						<div class="tr-vals__text additional">≈ ${{
							reward(option).mul($store.state.prices.HEGIC)
								.format(18 + 8, 3)
						}}</div>
					</td>
					<td>
						<button class="swap"
							:disabled="option.rewarded"
							v-text="$t(`token-holders.s-liquidity-utilization-rewards.${
								option.rewarded ? 'claimed' : 'claim'
							}`)"
							@click="$store.dispatch('claimOptionReward', option)"
							/>
					</td>
				</tr>
			</table>


		</div>

		<div style="margin: 20px;"></div>

		<div class="dai-pool-box">
			<div class="dai-pool-box__vals">
				<div class="dai-pool-box__availible">
					<div class="text">{{$t("token-holders.s-liquidity-utilization-rewards.info[0]")}}: {{today.format(18,2)}} rHEGIC</div>
					<div class="dai-pool-box__val"><span>{{share.format(2,2)}}% </span>/ 100%</div>
				</div>

				<div class="dai-pool-box__percent mobile">
					<div class="d-p-b-percent__val" :style="{width:share / 100+'%'}"></div>
				</div>

				<div class="dai-pool-box__rate">
					<div class="text">{{$t("token-holders.s-liquidity-utilization-rewards.info[1]")}}</div>
					<div class="dai-pool-box__val">{{total.format(18)}} rHEGIC</div>
				</div>
			</div>
			<div class="dai-pool-box__percent big">
				<div class="d-p-b-percent__val" :style="{width:share / 100 +'%'}"></div>
			</div>
		</div>

	</div>
</template>
