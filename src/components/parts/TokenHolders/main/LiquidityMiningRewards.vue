<script>
	import Web3 from 'web3'
	import Pie from '../../Pie.vue'
	import {mixin as VueTimers} from 'vue-timers'

	const {toBN} = Web3.utils
	export default {
		emits:['openLockTokens', 'openUnlockTokens'],
		data(){ return {
			liquidityPoolVue: 'WBTC',
			earnedTimeLeft: 0,
		}},
		computed:{
			earned(){
				const s = this.$store.state.balances['s'+this.liquidityPoolVue]
				const total = this.$store.state.balances['sTotal'+this.liquidityPoolVue]
				const add = total.isZero() ? toBN(0) :
					this.$store.state.stakingRewards[this.liquidityPoolVue]
						.rewardRate.mul(toBN(this.earnedTimeLeft))
						.mul(s).div(total)
				return this.$store.state
					.balances['sEarned' + this.liquidityPoolVue].add(add)
			},
			share(){
				const s = this.$store.state.balances['s'+this.liquidityPoolVue]
				const total = this.$store.state.balances['sTotal'+this.liquidityPoolVue]
				return total.isZero() ? toBN(0): s.mul(toBN(10000)).div(total)
			},
			dailyRewards(){
				const s = this.$store.state.balances['s'+this.liquidityPoolVue]
				const total = this.$store.state.balances['sTotal'+this.liquidityPoolVue]
				return total.isZero() ? toBN(0):
					this.$store.state.stakingRewards[this.liquidityPoolVue]
						.rewardRate.mul(toBN(24*3600)).mul(s).div(total)
			}
		},
		methods:{
			updateEarned(){
				const {lastUpdate} = this.$store.state.stakingRewards[this.liquidityPoolVue]
				this.earnedTimeLeft = ~~((new Date() - lastUpdate) / 1000)
			}
		},
		components:{
			Pie
		}
	}
</script>
<template>
	<div class="section th liquidity-mining-rewards">
		<!-- <div class="category-title">{{$t("token-holders.s-liquidity-mining-rewards.title")}}</div> -->
		<!-- <div style="margin: 20px;"></div> -->

		<div class="th-switch-titles">
			<div class="hero-title" v-html="$t(`token-holders.s-liquidity-mining-rewards.hero-title`)"></div>
			<div class="hero-text">
				<div
					v-for="i in $tm(`token-holders.s-liquidity-mining-rewards.hero-texts`).length"
					v-html="$t(`token-holders.s-liquidity-mining-rewards.hero-texts[${i-1}]`)"></div>
			</div>
		</div>



		<!-- <div class="form-periods">
			<div class="form-periods__period" :class="{select: liquidityPoolVue == 'WBTC'}" @click="liquidityPoolVue = 'WBTC'">
				<div class="periods__period-icon-2">
					<div class="periods__period-icon-1"></div>
				</div>
				<div class="periods__period-text">WBTC {{$t("pool.pool")}}</div>
			</div>

			<div class="form-periods__line"></div>


			<div class="form-periods__period" :class="{select: liquidityPoolVue == 'ETH'}" @click="liquidityPoolVue = 'ETH'">
				<div class="periods__period-icon-2">
					<div class="periods__period-icon-1"></div>
				</div>
				<div class="periods__period-text">ETH {{$t("pool.pool")}}</div>
			</div>
		</div> -->

		<div class="radio">
			<div class="radio__value" :class="{select: liquidityPoolVue == 'WBTC'}" @click="liquidityPoolVue = 'WBTC'">
				<div class="radio__text">WBTC</div>
			</div>
			<div class="radio__value" :class="{select: liquidityPoolVue == 'ETH'}" @click="liquidityPoolVue = 'ETH'">
				<div class="radio__text">ETH</div>
			</div>
		</div>
		<div style="margin: 10px;"></div>


		<div class="provide-liquidity__submit-container">
			<div class="earnings__diagram" >
				<pie :value="share / 100"></pie>
				<div class="diagram__text">
					<div class="diagram-text__title" v-html="$t(`token-holders.s-liquidity-mining-rewards.texts[0]`)"></div>
					<div class="diagram-text__val">
						 {{$store.state.balances['sTotal' + liquidityPoolVue].format(18)}} write{{liquidityPoolVue}}
					 </div>
				</div>
			</div>
			<div class="l-m-r-box">
				<div class="earnings__dynamics">
					<div class="category-title mobile" v-html="liquidityPoolVue + ' ' + $t(`token-holders.s-liquidity-mining-rewards.buttons.claim.title`)"></div>
					<div class="earnings__info new-option__schedule-infos">
							<div class="n-o-schedule-info__val claim-val">{{earned.format(18,2)}} rHEGIC</div>
							<button class="button primary"
								:disabled="earned.isZero()"
								v-text="$t(`token-holders.s-liquidity-mining-rewards.buttons.claim.button`)"
								@click="$store.dispatch('rsClaim', liquidityPoolVue)"></button>
							<div class="earnings-info__d-text" v-html="$t(`token-holders.s-liquidity-mining-rewards.buttons.claim.text`)"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="l-m-r-box earnings__info">
			<div class="new-option__schedule-info nlp">
				<div class="n-o-schedule-info__title" v-html="$t(`token-holders.s-liquidity-mining-rewards.buttons.lock.title`)">
				</div>
				<div class="n-o-schedule-info__val">
					{{$store.state.balances['write' + liquidityPoolVue].format(18,5)}} write{{liquidityPoolVue}}
				</div>
				<button class="button primary"
					v-text="$t(`token-holders.s-liquidity-mining-rewards.buttons.lock.button`)"
					@click="$emit('openLockTokens', liquidityPoolVue)"></button>
				<div class="earnings-info__d-text" v-html="$t(`token-holders.s-liquidity-mining-rewards.buttons.lock.text`, {p0:liquidityPoolVue})"></div>
			</div>
			<div class="new-option__schedule-info lp">
				<div class="n-o-schedule-info__title" v-html="$t(`token-holders.s-liquidity-mining-rewards.buttons.unlock.title`)"></div>
				<div class="n-o-schedule-info__val">
					{{$store.state.balances['s' + liquidityPoolVue].format(18,5)}} write{{liquidityPoolVue}}
				</div>
				<button class="button primary blue"
					@click="$emit('openUnlockTokens', liquidityPoolVue)">
					{{$t(`token-holders.s-liquidity-mining-rewards.buttons.unlock.button`)}}</button>
				<div class="earnings-info__d-text" v-html="$t(`token-holders.s-liquidity-mining-rewards.buttons.unlock.text`, {p0:liquidityPoolVue})"></div>
			</div>
		</div>


		<!-- <div class="provide-liquidity-box"> -->
			<div class="liquidity-mining-rewards__stats-container">
				<div class="form__info" v-if="false">
					<!-- <div class="form-info-box">
						<div class="status__value">123 ETH{{avgReturns}}</div>
						<div class="text" v-html="$t(`token-holders.s-liquidity-mining-rewards.texts[0]`)">
						</div>
					</div> -->
					<div class="form-info-box">
						<div class="status__value">{{share.format(2,2)}}%</div>
						<div class="text" v-html="$t(`token-holders.s-liquidity-mining-rewards.texts[1]`)">
						</div>
					</div>
					<div class="form-info-box">
						<div class="status__value token-hegic"
							v-text="dailyRewards.format(18,3)"></div>
						<div class="text" v-html="$t(`token-holders.s-liquidity-mining-rewards.texts[2]`)">
						</div>
					</div>
					<div class="form-info-box">
						<div class="status__value">${{
							dailyRewards.mul(this.$store.state.prices.HEGIC).format(26,2)
						}}</div>
						<div class="text" v-html="$t(`token-holders.s-liquidity-mining-rewards.texts[3]`)">
						</div>
					</div>
				</div>
			</div>
		<!-- </div> -->



	</div>
</template>
