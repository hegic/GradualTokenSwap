<script>
	import Pie from '../Pie.vue'
	import Web3 from 'web3'
	import {mapGetters} from 'vuex'
	const {toBN} = Web3.utils

	import EmptySchedule from "./EmptySchedule.vue"

	export default {

		emits:['withdraw'],
		props:['selectedPool', 'options'],
		computed:{
			pool(){return this.$store.state.pools[this.selectedPool]},
			provided(){ return this.pool.provided },
			decimals(){return ({WBTC: 8, ETH: 18})[this.selectedPool]},
			share(){
				const balances = this.$store.state.balances
				return balances['write' + this.selectedPool]
					.add(balances['s' + this.selectedPool])
					.mul(this.pool.totalAmount)
					.div(this.pool.supply)
			},
			profit(){
				const {share, provided} = this
				return share.sub(provided)
			},
			profits(){
				const totalAmount = this.pool.totalAmount.isZero() ? toBN(1) : this.pool.totalAmount
				// const x = this.$store.state.actions.filter(x => x.currency == this.selectedPool).map(x => {
				// 	const option = this.options.find(y => x.id == y.id && y.currency == this.selectedPool)
				// 	const premium = option ? option.premium: toBN(0)
				// 	const profit = x.event == 'Exercise' ? x.profit.neg().add(premium): x.profit
				// 	return {
				// 		profit,
				// 		id:x.id,
				// 		event: x.event,
				// 		expiresIn: option && option.expiresIn,
				// 		shareProfit: profit
				// 			.mul(this.pool.share)
				// 			.div(totalAmount),
				// 	}
				// })

				return this.options
					.filter(x => x.currency == this.selectedPool && x.state == 0)
					.sort((x, y) => x.expiration - y.expiration)
					.map(x => {
						const exProfit = x.profit.gt(toBN(0)) ? x.profit : toBN(0)
						const profit = x.premium.sub(exProfit)
						return {
							...x,
							profit,
							shareProfit: profit
								.mul(this.share)
								.div(totalAmount),
						}
					})
			},
			prcPie(){
				const {provided, profit} = this
				return provided.isZero() ? 0 :
					profit.mul(toBN(100000)).div(provided) / 1000
			},
			relShare(){
				const amount = this.pool.totalAmount.isZero() ? toBN(1) : this.pool.totalAmount
				return this.share.mul(toBN(10000)).div( amount) / 100
			}
		},
		components:{
			Pie, EmptySchedule
		}
	}
</script>
<template>
	<div class="section earnings">
		<div class="category-title">{{$t("liquidity-providers.s-earnings.title")}}</div>
		<div class="earnings-box">
			<div class="earnings__diagram-and-info">
				<div class="earnings__diagram">
					<pie :value="prcPie"></pie>
					<div class="diagram__text">
						<div class="diagram-text__title">{{$t("liquidity-providers.s-earnings.total")}} {{selectedPool}}</div>
						<div class="diagram-text__val">{{share.format(decimals,3)}}</div>
						<div class="diagram-text__s" :class="{good: profit > 0, bad: profit.isNeg()}">{{profit > 0 ? '+' : ''}}{{ profit.format(decimals,3)}} {{selectedPool}}</div>
					</div>
					<div class="diagram__data">
						<div class="diagram-data lp">{{$t("liquidity-providers.s-earnings.liquidity-provided")}}</div>
						<div class="diagram-data nlp" :class="{bad: profit.isNeg()}">{{$t("liquidity-providers.s-earnings.net-p-and-l")}}</div>
					</div>
					<button @click="$emit('withdraw', false)" :disabled="share.isZero()" class="button primary">
						{{$t("pool.withdraw")}}
					</button>
				</div>
				<div class="earnings__info new-option__schedule-infos">
					<div class="new-option__schedule-info lp">
						<div class="n-o-schedule-info__title">{{$t("liquidity-providers.s-earnings.liquidity-provided")}}</div>
						<div class="n-o-schedule-info__val">{{pool.provided.format(decimals,3)}} {{selectedPool}}</div>
						<button onclick="document.getElementById('js-provide').scrollIntoView({behavior: 'smooth'})" class="button primary blue" >{{$t("pool.deposit")}}</button>
					</div>
					<div class="new-option__schedule-info nlp">
						<div class="n-o-schedule-info__title">{{$t("liquidity-providers.s-earnings.net-p-and-l")}}</div>
						<div class="n-o-schedule-info__val">{{profit > 0 ? '+' : ''}}{{profit.format(decimals,3)}} {{selectedPool}}</div>
						<button @click="$emit('withdraw', true)" class="button primary" :disabled="profit.isNeg() || profit.isZero()">{{$t("liquidity-providers.s-earnings.withdraw-net-profits")}}</button>

						<div class="earnings-info__d-text"
							v-html="$t(`liquidity-providers.s-earnings.withdraw-net-profits-text`, {
								p0: pool.provided.format(decimals,3),
								p1: selectedPool})"></div>
					</div>
				</div>
			</div>
			<div class="earnings__dynamics">
				<div class="category-title mobile">{{$t(`liquidity-providers.s-earnings.p-and-l-dynamics`)}}</div>

				<empty-schedule v-if="true"></empty-schedule>

				<div class="earnings-dynamics__table" v-if="false">
					<table class="table-options">
						<thead>
							<tr class="table-options__header">
								<th>{{$t("table.id")}}</th>
								<th>{{$t("table.expires-in")}}</th>
								<th>{{$t("table.projected-p-and-l")}}</th>
								<th>{{$t("table.your-share")}}</th>
							</tr>
						</thead>
						<tbody>
							<tr class="table-options__tr-vals" v-for="option in profits">
								<td>{{option.id}}</td>
								<td>{{
									option.event == 'Expire'  ? $t("option.expired"):
									option.event == 'Exercise' ? $t("option.exercised"):
									`${option.expiresIn.days}${$t('date.d')} ${option.expiresIn.hours}${$t('date.h')}`
								}}</td>
								<td>
									<div v-if="option.profit" class="tr-vals__text" :class="{good: !option.profit.isNeg(), bad: option.profit.isNeg()}">
										{{option.profit.isNeg() ? '':'+'}}{{option.profit.format(decimals,3)}}
										{{selectedPool}}
									</div>
								</td>
								<td>
									<div v-if="option.profit" class="tr-vals__text" :class="{good: !option.profit.isNeg(), bad: option.profit.isNeg()}">
										{{option.profit.isNeg() ? '':'+'}}{{option.shareProfit.format(decimals,5)}}
										{{selectedPool}}
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

			</div>
		</div>

		<div class="dai-pool-box">
			<div class="dai-pool-box__vals">
				<div class="dai-pool-box__availible">
					<div class="text">{{$t("liquidity-providers.s-earnings.your-share-pool")}}</div>
					<div class="dai-pool-box__val"><span>{{relShare}}% </span>/ 100%</div>
				</div>

				<div class="dai-pool-box__percent mobile">
					<div class="d-p-b-percent__val" :style="{width:relShare+'%'}"></div>
				</div>

				<div class="dai-pool-box__rate">
					<div class="text">{{selectedPool}} {{$t('pool.size')}}</div>
					<div class="dai-pool-box__val">{{pool.totalAmount.format(decimals,3)}} {{selectedPool}}</div>
				</div>
			</div>
			<div class="dai-pool-box__percent big">
				<div class="d-p-b-percent__val" :style="{width:relShare+'%'}"></div>
			</div>
		</div>
	</div>
</template>
