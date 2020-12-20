<script>
	import Web3 from 'web3'
	const toBN = Web3.utils.toBN

	export default {
		props:['selectedPool'],
		// data(){return{
		// 	optionsVolume: '315',
		// 	liqudityTurnover: '41944',
		// 	premiumsWriters: '+1538',
		// }},
		computed:{
			options(){ return this.$store.getters.options },
			optionsVolume(){
				return this.options.filter(x => x.currency == this.selectedPool)
					.map(x=>x.amount)
					.reduce((x,y) => x.add(y), toBN(0))
					.mul(this.$store.state.prices[this.selectedPool])
					.format(this.selectedPool == 'WBTC' ? 16 : 26,2)
			},
			liqudityTurnover(){
				//const total = this.options
                //   .map(x=>x.amount)
                //    .reduce((x,y) => x.add(y), toBN(0)).format(18,3)

				return this.options.filter(x => x.currency == this.selectedPool)
					.map(x=>x.amount)
					.reduce((x,y) => x.add(y), toBN(0))
					.format(this.selectedPool == 'WBTC' ? 8 : 18,2)
			},
			premiumsWriters(){
				const type = this.selectedPool == 'ETH' ? 'CALL' : 'PUT'
				return this.options.filter(x => x.type == type && x.state > 0)
					.map(x => x.premium)
					.reduce((x, y)=>x.add(y), toBN(0))
					.format(18,2)
					+ ' ' + this.selectedPool

			}
		}
	}
</script>
<template>
	<div class="section status">
		<div class="category-title">{{$t("not-connected.s-status.title")}}</div>
		<div class="statuses-box">
			<div class="status-box volume">
				<div class="status__title" v-html="$t(`not-connected.s-status.text-1`)"></div>
				<div class="status__value">${{optionsVolume}}</div>
			</div>
			<div class="status-box turnover">
				<div class="status__title" v-html="$t(`not-connected.s-status.text-2`)"></div>
				<div class="status__value">{{liqudityTurnover}} {{selectedPool}}</div>
			</div>
			<div class="status-box premiums">
				<div class="status__title" v-html="$t(`not-connected.s-status.text-3`)"></div>
				<div class="status__value">{{premiumsWriters}}</div>
			</div>
		</div>
	</div>
</template>
