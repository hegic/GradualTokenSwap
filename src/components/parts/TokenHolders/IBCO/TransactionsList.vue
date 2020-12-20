<script>
	import Web3 from 'web3'
	const toBN = Web3.utils.toBN
	const toWei = Web3.utils.toWei


	function interval(raw){
		// if(raw == null) return null;
		var tmp = raw
		const ms = parseInt(tmp % 1000)
		tmp /= 1000
		const s = parseInt(tmp % 60)
		tmp /= 60
		const min = parseInt(tmp % 60)
		tmp /= 60
		const h = parseInt(tmp % 24)
		tmp /= 24
		const d = parseInt(tmp)
		return {
			toString(){ return`${d}D ${h}H ${min}M ${s}S`},
			d,h,min,s, raw
		}
	}

	export default {
		data() { return {
			now: new Date(),
			timer: null,
		}},
		mounted() { this.startTimer() },
		destroyed() { this.stopTimer() },
		methods: {
			startTimer() {
				this.timer = setInterval(() => this.now = new Date(), 1000)
			},
			stopTimer() { clearTimeout(this.timer) },
		},
		computed: {
			leftForStart(){ return interval(this.IOParams.START - this.now)},
			leftForEnd(){ return interval(this.IOParams.END - this.now)},
			IOParams(){
				return this.$store.state.IOParams
			},
			state(){
				return !this.IOParams ? "loading" :
					this.leftForEnd.raw < 0 ? "ended":
					this.leftForStart.raw < 0 ? "active":
					"waiting"
			},
			achieved(){
				return this.IOParams && this.IOParams.totalProvided.gte(this.IOParams.MINIMAL_PROVIDE_AMOUNT)
			},
			txs(){
				return this.$store.state.IOParams.txs
				.map(x=>{
					const total = this.IOParams.totalProvided.isZero()? toBN("1"):this.IOParams.totalProvided
					const share = x.amount.mul(toBN("10000")).div(total)
					return {...x, share}
				})
			},
		}
	}
</script>

<template>
	<div class="section your-option th-padding-0" v-if="(state=='active' || state=='ended') && txs!=0">
		<div class="category-title">{{$t("token-holders-ibco.s-transactions-list.title")}}</div>
		<div class="your-option__table th">
			<table class="table-options">
				<tr class="table-options__header">
					<th>{{$t("table.number")}}</th>
					<th>{{$t("table.amount")}}</th>
					<th>{{$t("table.address")}}</th>
					<th>{{$t("table.tx")}}</th>
				</tr>
				<tr v-for="(tx,i) in txs.slice().reverse()" class="table-options__tr-vals">
					<td>{{txs.length - i}}</td>
					<td>
						<div class="tr-vals__text big">{{tx.amount.format(18,3)}} ETH</div>
						<div class="tr-vals__text additional">{{tx.share.format(2,2)}}%</div>
					</td>
					<td>{{tx.address}}</td>
					<td>
						<a :href="`//etherscan.io/tx/${tx.tx}`"
                            target="_blank"
                            class="tx-link">
                            {{tx.tx}}
                        </a>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
