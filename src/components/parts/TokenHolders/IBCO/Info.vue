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
		computed:{
			leftForStart(){ return interval(this.IOParams.START - this.now)},
			leftForEnd(){ return interval(this.IOParams.END - this.now)},
			IOParams(){
				return this.$store.state.IOParams
			},
			state(){
					return this.IOParams ? "ended" : "waiting"
			},
			achieved(){
				return this.IOParams && this.IOParams.totalProvided.gte(this.IOParams.MINIMAL_PROVIDE_AMOUNT)
			},
			userShare(){
				return this.IOParams.totalProvided.isZero() ? toBN("0") :
					this.IOParams.provided.mul(toBN("10000")).div(this.IOParams.totalProvided)
			},
			beClaimed() {
				if(!this.IOParams) return null
				const share = this.IOParams.provided
				const {totalProvided} = this.IOParams
				const total = totalProvided.isZero() ? toBN('1') : totalProvided
				const distribute = this.IOParams.TOTAL_DISTRIBUTE_AMOUNT
				return total.isZero() ? toBN(0):
					distribute.mul(share).div(total)
			},
			startPrice(){
				if(!this.IOParams) return null
				const price = this.$store.state.prices.ETH
				return this.IOParams.MINIMAL_PROVIDE_AMOUNT.mul(price).div(this.IOParams.TOTAL_DISTRIBUTE_AMOUNT)
			},
			currentPrice(){
				return toBN(13370000)
				if(!this.IOParams) return null
				const price = this.$store.state.prices.ETH
				return this.IOParams.totalProvided.mul(price).div(this.IOParams.TOTAL_DISTRIBUTE_AMOUNT)
			},
			priceChange(){
				if(!this.IOParams) return null
				return this.currentPrice.mul(toBN("10000")).div(this.startPrice).sub(toBN("10000"))
			},
			contributors(){
				return new Set(this.IOParams.txs.map(x => x.address))
			},
			isContributor(){
				return this.contributors.has(this.$store.state.accounts[0])
			}

		}
	}
</script>
<template>
	<div class="section th-info" v-if="state=='active' || state=='ended'">
		<div class="category-title">Summary</div>

		<!-- <div class="category-title">{{$t('token-holders-ibco.in-process.s-info.title')}}</div> -->
		<!-- <div style="margin-top: 40px;"></div> -->

		<div class="summary-cards documents">
			<div class="summary-card document" v-if="state=='active'">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[0]`)"></div>
					<div class="summary-card__value">{{IOParams.provided.format(18,3)}} ETH</div>
				</div>
			</div>
			<div class="summary-card document" v-if="state=='active'">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[1]`)"></div>
					<div class="summary-card__value">{{userShare.format(2,2)}}%</div>
				</div>
			</div>
			<div class="summary-card document" v-if="state=='active'">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[2]`)"></div>
					<div class="summary-card__value">{{beClaimed.format(18,2)}}</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[3]`)"></div>
					<div class="summary-card__value">{{IOParams.totalProvided.format(18,3)}} ETH</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[4]`)"></div>
					<div class="summary-card__value">{{contributors.size}}</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[5]`)"></div>
					<div class="summary-card__value">{{IOParams.TOTAL_DISTRIBUTE_AMOUNT.format(18,2)}}</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[6]`)"></div>
					<div class="summary-card__value">$0.0027</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[7]`)"></div>
					<div class="summary-card__value">${{currentPrice.format(8,6)}}</div>
				</div>
			</div>
			<div class="summary-card document">
				<div class="document-angles">
					<div class="summary-card__title" v-html="$t(`token-holders-ibco.in-process.s-info.info[8]`)"></div>
					<div class="summary-card__value">+{{priceChange.format(2,2)}}%</div>
				</div>
			</div>
		</div>
	</div>
</template>
