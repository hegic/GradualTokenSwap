<script>
	import MySelect from '../Select.vue'
	import Web3 from 'web3'
	const toBN = Web3.utils.toBN

	export default {
		emits:['create-option'],
		inject:['isNumber'],
		data(){return{
			isPutOption: true,
			isWBTCOption: true,
			amount: null,
			strike: null,
			period: {val: 1*24*3600,	text: '1 day'},
		}},
		computed:{
			pool(){ return this.isWBTCOption ? "WBTC" : "ETH"},
			currentPrice(){ return this.$store.state.prices[this.pool] },
			decimals(){ return this.pool == "WBTC" ? 8 : 18},
			selectedAmount(){
				const tmp = toBN( Web3.utils.toWei(this.amount || "1") )
				return this.isWBTCOption ? tmp.div(toBN(1e10)) : tmp
			},
			selectedStrike(){
				return this.strike ?
					toBN( (this.strike * 1e8).toFixed() ) :
					this.currentPrice
			},
			optionCost() {
				return this.$store.getters.optionCost({
					amount: this.selectedAmount,
					period: toBN(this.period.val.toFixed()),
					strike: this.selectedStrike,
					type: this.isPutOption ? 'PUT' : 'CALL',
					pool: this.isWBTCOption ? "WBTC" : "ETH"
				})
			},
			maxAmount(){
				const available = this.$store.state.pools[this.pool].availableBalance || toBN(0)
				const amount = this.$store.state.pools[this.pool].totalAmount || toBN(0)
				return available.sub(amount.div(toBN(5)))

				// if(this.isPutOption) {
				// 		const available = this.$store.state.pools.WBTC.availableBalance || toBN(0)
				// 		const amount = this.$store.state.pools.WBTC.totalAmount || toBN(0)
				// 		const strike =  this.selectedStrike
				// 		return available.sub(amount.div(toBN(5))).mul(toBN(1e8)).div(strike)
				// } else {
				// }
			},
		},
		methods:{
			createOption(){
				const period = toBN(this.period.val.toFixed())
				const amount = this.selectedAmount
				const strike = toBN( this.strike ? toBN(this.strike * 1e8) :this.currentPrice )
				const pool = this.pool
				this.$emit('create-option', {isPutOption: this.isPutOption, amount, strike, period, pool})
			}
		},
		components:{ MySelect }
	}
</script>
<template>
	<div class="section new-option">
		<div class="category-title">{{$t("holders.s-new-option.title")}}</div>
		<div class="new-option-form">
			<div class="radio">
				<div class="radio__value" :class="{select: isWBTCOption}" @click="isWBTCOption = true">
					<div class="radio__text">WBTC</div>
				</div>
				<div class="radio__value" :class="{select: !isWBTCOption}" @click="isWBTCOption = false">
					<div class="radio__text">ETH</div>
				</div>
			</div>
			<div style="margin: 25px"></div>

			<div class="new-option-settings">
				<div class="form__info">
					<div class="form-info-box">
						<div class="text">{{$t("option.type")}}:</div>
						<div class="radio">
							<div class="radio__value" :class="{select: isPutOption}" @click="isPutOption = true">
								<div class="radio__text">{{$t("option.put")}}</div>
							</div>
							<div class="radio__value" :class="{select: !isPutOption}" @click="isPutOption = false">
								<div class="radio__text">{{$t("option.call")}}</div>
							</div>
						</div>
					</div>
					<div class="form-info-box overflow-visible">
						<div class="text">{{$t("option.size")}}:</div>
						<div class="input connected with-max" :data-type="pool">
							<input type="text" v-model="amount" :placeholder="1" @keypress="isNumber">
							<div
								class="input__max"
								:style="{color: selectedAmount.gt(maxAmount) ? '#ff6565' : undefined }">
									{{
										maxAmount.isNeg() || maxAmount.isZero()
											? $t("pool.maxed-out")
											: `${$t("option.max")} ${maxAmount.format(decimals,3)} ${pool}`
									}}
							</div>
						</div>
					</div>
					<div class="form-info-box">
						<div class="text">{{$t("option.strike-price")}}:</div>
						<div class="input connected" data-type="USD">
							<input type="text" :placeholder="`${selectedStrike.format(8,2)} (${$t(`option.ATM`)})`" v-model="strike"  @keypress="isNumber">
						</div>
					</div>
					<div class="form-info-box with-select">
						<div class="text">{{$t("option.period-of-holding")}}:</div>
						<my-select v-model="period"></my-select>
					</div>
				</div>
				<div class="new-option__data">
					<div class="new-option__schedule-box">
						<div class="schedule"
							:data-type="isPutOption? 'put' : 'call'"
							:data-state="optionCost.gState">

							<div class="schedule-value strike">{{$t("option.strike")}}: <span>${{selectedStrike.format(8,2)}}</span></div>
							<div class="schedule-value break-even">{{$t("option.break-even")}}: <span>${{optionCost.breakeven.format(8,2)}}</span></div>
							<my-select v-model="period"></my-select>

							<div class="schedule-zone top">
								<div class="schedule__line"></div>
								<div class="schedule__line"></div>
								<div class="schedule__line last"></div>
							</div>
							<div class="schedule__line"/>
							<my-select v-model="period"></my-select>
							<my-select v-model="period"></my-select>
							<my-select v-model="period"></my-select>tom">
								<div class="schedule__line"/><div class="schedule__line"/><div class="schedule__line"/>
							<my-select v-model="period"></my-select>
							<div class="schedule__legend">
								<div class="schedule-legend__title">
									{{$t(`holders.s-new-option.dynamics-value`, {p0: isWBTCOption ? "WBTC" : "ETH"})}}:
								</div>
								<div class="schedule-legend__vals">
									<div class="schedule-legend__val green">{{$t(`holders.s-new-option.unlimited-upside`)}}</div>
									<div class="schedule-legend__val red">{{$t(`holders.s-new-option.worthless-expiration`)}}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="new-option__schedule-infos">
						<div class="new-option__schedule-info strike">
							<div class="n-o-schedule-info__title">{{$t("option.strike-price")}}</div>
							<div class="n-o-schedule-info__val">${{selectedStrike.format(8,2)}}</div>
						</div>
						<div class="new-option__schedule-info red">
							<div class="n-o-schedule-info__title">{{$t("option.total-cost")}}</div>
							<div class="n-o-schedule-info__val">${{optionCost.USDFee.format(26,2)}}</div>
						</div>
						<div class="new-option__schedule-info green">
							<div class="n-o-schedule-info__title">{{$t("option.break-even")}}</div>
							<div class="n-o-schedule-info__val">${{optionCost.breakeven.format(8,2)}}</div>
						</div>
					</div>
				</div>
				<div class="form__info new-option-settings__info">
					<div class="n-o__text" v-html="$t('holders.s-new-option.text', {fee: optionCost.fee.format(18,4)})"></div>
					<button @click="createOption" :disabled="selectedAmount.gt(maxAmount)" class="button primary">{{$t("holders.s-new-option.buy-option-contract")}}</button>

				</div>
			</div>
		</div>
	</div>
</template>
