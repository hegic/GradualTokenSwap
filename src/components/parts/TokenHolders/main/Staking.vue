<script>
	import Emoji from './Emoji.vue'
	import StakingClaim from '../PopUp/StakingClaim.vue'
	import StakingWithdraw from '../PopUp/StakingWithdraw.vue'
	import EmptySchedule from "../../LiquidityProviders/EmptySchedule.vue"
	import {mapGetters} from 'vuex'
	import Web3 from 'web3'
	const {toBN} = Web3.utils
	const steps = [
		toBN("888000000000000000000"),
		toBN("8880000000000000000000"),
		toBN("88000000000000000000000"),
		toBN("888000000000000000000000"),
		toBN("8880000000000000000000000"),
		toBN("88000000000000000000000000"),
	]
	export default {
		emits:['openStakingClaim', 'openStakingWithdraw'],
		data(){ return {
			liquidityPoolVue: 'WBTC',
		}},
		computed:{
			...mapGetters(['options']),
			lots(){
				return this.$store.state.staking[this.liquidityPoolVue].stakedLots
			},
			hegicInLots(){
				return this.lots.mul(toBN("888000000000000000000000"))
			},
			rewards(){
				return this.$store.state.staking[this.liquidityPoolVue].rewards
			},
			decimals(){
				return {ETH: 18, WBTC: 8}[this.liquidityPoolVue]
			},
			staked(){
				const eStaked = this.$store.state.staking.ETH.stakedLots
				const wStaked = this.$store.state.staking.WBTC.stakedLots
				return eStaked.add(wStaked).mul(toBN("888000000000000000000000"))
			},
			total(){
				return this.$store.state.balances.HEGIC.add(this.staked)
			},
			type(){
				const {total} = this
				if(total.lt(steps[0])) return 0
				if(total.lt(steps[1])) return 1
				if(total.lt(steps[2])) return 2
				if(total.lt(steps[3])) return 3
				if(total.lt(steps[4])) return 4
				if(total.lt(steps[5])) return 5
				return 6
			}
		},
		components:{
			Emoji, StakingClaim, StakingWithdraw, EmptySchedule
		}
	}
</script>
<template>
	<div class="section">
		<!-- <div class="category-title">{{$t("token-holders.s-staking.title")}}</div> -->
		<!-- <div style="margin: 20px;"></div> -->

		<div class="th-switch-titles">
			<div class="hero-title" v-html="$t(`token-holders.s-staking.hero-title`)"></div>
			<div class="hero-text">
				<div
					v-for="i in $tm(`token-holders.s-staking.hero-texts`).length"
					v-html="$t(`token-holders.s-staking.hero-texts[${i-1}]`)"></div>
			</div>
		</div>



		<div class="radio">
			<div class="radio__value" :class="{select: liquidityPoolVue == 'WBTC'}" @click="liquidityPoolVue = 'WBTC'">
				<div class="radio__text">WBTC</div>
			</div>
			<div class="radio__value" :class="{select: liquidityPoolVue == 'ETH'}" @click="liquidityPoolVue = 'ETH'">
				<div class="radio__text">ETH</div>
			</div>
		</div>
		<div style="margin: 20px;"></div>

		<div class="earnings-box">
			<div class="earnings__diagram-and-info fix-staking">
				<div class="earnings__diagram">
					<div class="diagram-text__title">{{$t("token-holders.s-staking.total-staked")}}</div>

					<emoji class="emoji-big-3" :type="type"></emoji>
					<!-- <div class="emoji-type">
					</div>-->

					<div style="margin: 15px;"></div>
					<div class="diagram-text__val">{{hegicInLots.format(18)}} HEGIC</div>
					<!-- <div class="diagram-text__s" :class="{good: true, bad: false}">
						+$10
					</div> -->
					<div style="margin: 10px;"></div>

					<button class="button primary" v-on:click="$emit('openStakingWithdraw', liquidityPoolVue)">
						{{$t("pool.withdraw")}}
					</button>
				</div>
				<div class="earnings__info new-option__schedule-infos">
					<div class="new-option__schedule-info lp">
						<div class="n-o-schedule-info__title">
							{{$t("token-holders.s-staking.your-lots")}}
						</div>
						<div class="n-o-schedule-info__val">{{lots}} / {{$store.state.staking[liquidityPoolVue].totalLots}}</div>
						<button class="button primary blue" v-on:click="$emit('openStakingClaim', liquidityPoolVue)">
							{{$t("token-holders.s-staking.stake")}}
						</button>
					</div>
					<div class="new-option__schedule-info nlp">
						<div class="n-o-schedule-info__title">
							{{$t("token-holders.s-staking.your-rewards")}}
						</div>
						<div class="n-o-schedule-info__val">+{{rewards.format(decimals,5)}} {{liquidityPoolVue}}</div>
						<button class="button primary"
							:disabled="rewards.isZero()"
							@click="$store.dispatch('stakingClaim', liquidityPoolVue)">
							{{$t("token-holders.s-staking.claim-rewards")}}
						</button>
						<div class="earnings-info__d-text" v-html="$t('token-holders.s-staking.claim-rewards-text')">
						</div>
					</div>
				</div>
			</div>
			<div class="earnings__dynamics">
				<div class="category-title mobile">
					{{$t("token-holders.s-staking.your-rewards")}}
				</div>
				<empty-schedule v-if="true"></empty-schedule>
				<div class="earnings-dynamics__table" v-if="false">
					<table class="table-options">
						<thead>
							<tr class="table-options__header">
								<th>{{$t("table.id")}}</th>
								<th>{{$t("table.placed-at")}}</th>
								<th>{{$t("table.amount")}}</th>
								<!-- <th>{{$t("table.your-share")}}</th> -->
							</tr>
						</thead>
						<tbody>
							<tr v-if="options.filter(x=>x.currency == liquidityPoolVue).length == 0" class="table-options__tr-vals">
								<td class="null" colspan="3">{{$t("pool.no-active-options")}}</td>
							</tr>
							<tr class="table-options__tr-vals" v-for="option in options.filter(x=>x.currency == liquidityPoolVue)">
								<td>{{option.id}}</td>
								<td>{{ option.placed }}</td>
								<td>
									<div  class="tr-vals__text" :class="{good: true}">
										{{option.settlementFee.format(decimals, decimals)}}  {{liquidityPoolVue}}
									</div>
								</td>
								<!-- <td>
									<div v-if="option.profit" class="tr-vals__text" :class="{good: !option.profit.isNeg(), bad: option.profit.isNeg()}">
										{{option.profit.isNeg() ? '':'+'}}{{option.shareProfit.format(18,5)}}
										{{selectedPool}}
									</div>
								</td> -->
							</tr>
						</tbody>
					</table>
				</div>

			</div>
		</div>


		<div class="category-title">{{$t("token-holders.s-staking.s-delegate.title")}}
		</div>

		<div class="section docs-and-join delegate-developers">
			<div class="docs-and-join__box">

				<div class="documents">
					<div  class="delegate-developer-box"
						v-for="elem in $t('token-holders.s-staking.s-delegate.links')">

						<a
							class="document"
							:href="elem.link" target="_blank">
							<div class="document-angles">
								<!-- <div :class="`icon-${elem.icon}`"></div> -->
								<div class="document__title">
									<div class="text" v-html="elem.text"></div>
								</div>
							</div>
						</a>
						<a :href="elem.developerLink" class="delegate-developer-info-box" target="_blank">

							<!-- <div :class="`delegate-developer-icon ${elem.icon}`"></div>
							<div class="text" v-html="elem.developer"></div> -->

							<div class="review__user" :class="`delegate-developer-icon ${elem.icon}`">
								<div class="review__user--name" v-html="$t('token-holders.s-staking.s-delegate.developed-by')"></div>
								<a :href="elem.developerLink" target="_blank" class="review__user--link" v-html="elem.developer"></a>
							</div>
						</a>
					</div>
				</div>
			</div>
			<div class="docs-and-join__box">
				<div class="text" v-html="$t(`token-holders.s-staking.s-delegate.text`)">
				</div>

			</div>
		</div>

	</div>
</template>
