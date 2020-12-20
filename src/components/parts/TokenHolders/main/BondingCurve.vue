<script>
  import BcChart from './BCChart.js'
  import Web3 from 'web3'
  const toBN = Web3.utils.toBN
  const toWei = Web3.utils.toWei
	export default {
		data(){ return {
      		k: toBN("100000132800"),
      		startPrice: toBN("356600000000000"),
			bondingCurve: 'BUY',
			amount:null
		}},
		computed:{
			bcChange(){
			  	const x = toBN(toWei(this.amount || '1'))
      			return this.bondingCurve == 'BUY' ? x : x.neg()
			},
			max(){
        return this.$store.state.BC.total
          .sub(this.$store.state.BC.sold)
      },
      maxETH(){ return this.s(this.$store.state.BC.sold, this.max) },
			bcAmount(){ return this.$store.state.BC.sold},
			bcAmountETH(){ return this.s(toBN(0), this.bcAmount)},
			ethAmount(){
				const {sold} =  this.$store.state.BC
				if(!sold) return toBN(2e18)
				return this.bondingCurve == 'BUY'
					? this.s(sold, sold.add(this.bcChange))
					: this.s(sold.add(this.bcChange), sold)
						  .mul(toBN(9)).div(toBN(10))
			},
			dealPrice(){
				return this.ethAmount.mul(toBN(1e8)).div(
					this.bondingCurve == 'BUY' ? this.bcChange : this.bcChange.neg()
				)
			}
		},
		components: {BcChart},
		methods: {
			showNotification(x){return this.$root.showNotification(x)},
			s(x0, x1){
				return x1.add(x0).mul(x1.sub(x0))
	            	.div(toBN(2)).div(this.k)
	            	.add(this.startPrice.mul(x1.sub(x0)))
	            	.div(toBN(1e18));
			},
			async call(){
				const {BC} = this.$store.state.contracts
				if(this.bondingCurve == 'BUY') {
					const value = await BC.methods.soldAmount().call().then(toBN)
						.then(sold => this.bondingCurve == 'BUY' ?
							[sold, sold.add(this.bcChange)]:
							[sold.sub(this.bcChange), sold])
						.then(([from, to]) => BC.methods.s(from, to).call())
					this.showNotification({
						title: this.$t('notifications.BCBuy.confirm.title'),
						text: this.$t('notifications.BCBuy.confirm.text')
					})
					await BC.methods.buy(this.bcChange).send({value})
						.on('transactionHash', tx => this.showNotification({
							title: this.$t('notifications.BCBuy.pending.title'),
							text: this.$t('notifications.BCBuy.pending.text'),
							tx
						}))
						.on('receipt', receipt => this.showNotification({
							title: this.$t('notifications.BCBuy.receipt.title'),
							text: this.$t('notifications.BCBuy.receipt.text'),
							tx: receipt.transactionHash
						}))
				} else if(this.bondingCurve == 'SELL'){
					const max = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
					await this.$store.state.contracts.HEGIC.methods
						.allowance(this.$store.state.accounts[0], BC._address).call().then(toBN)
						.then(x  => {
							if(x.lt(this.bcChange.neg())){
								this.showNotification({
									title: this.$t('notifications.approve.confirm.title'),
									text: this.$t('notifications.approve.confirm.text')
								})
								return this.$store.state.contracts.HEGIC.methods.approve(BC._address, max)
									.send()
									.on('transactionHash', tx => this.showNotification({
										title: this.$t('notifications.approve.pending.title'),
										text: this.$t('notifications.approve.pending.text'),
										tx
									}))
									.on('receipt', receipt => this.showNotification({
										title: this.$t('notifications.approve.receipt.title'),
										text: this.$t('notifications.approve.receipt.text'),
										tx: receipt.transactionHash
									}))
							}
						})
					this.showNotification({
						title: this.$t('notifications.BCSell.confirm.title'),
						text: this.$t('notifications.BCSell.confirm.text')
					})
					await BC.methods.sell(this.bcChange.neg()).send()
						.on('transactionHash', tx => this.showNotification({
							title: this.$t('notifications.BCSell.pending.title'),
							text: this.$t('notifications.BCSell.pending.text'),
							tx
						}))
						.on('receipt', receipt => this.showNotification({
							title: this.$t('notifications.BCSell.receipt.title'),
							text: this.$t('notifications.BCSell.receipt.text'),
							tx: receipt.transactionHash
						}))
				}

				await this.$store.dispatch('updateTokenHolders')
			}
		}
	}
</script>
<template>
	<div class="section bonding-curve-box">
		<!-- <div class="category-title">{{$t("token-holders.s-bonding-curve.title")}}</div> -->

		<div class="th-switch-titles">
			<div class="hero-title" v-html="$t(`token-holders.s-bonding-curve.hero-title`)"></div>
			<!-- <div class="hero-text">
				<div
					v-for="i in $tm(`token-holders.s-bonding-curve.hero-texts`).length"
					v-html="$t(`token-holders.s-bonding-curve.hero-texts[${i-1}]`)"></div>
			</div> -->
			<div style="margin: 45px;"></div>
		</div>

		<div class="radio">
			<div class="radio__value" :class="{select: bondingCurve == 'BUY'}" @click="bondingCurve = 'BUY'">
				<div class="radio__text">{{$t('token-holders.s-bonding-curve.buy')}}</div>
			</div>
			<div class="radio__value" :class="{select: bondingCurve == 'SELL'}" @click="bondingCurve = 'SELL'">
				<div class="radio__text">{{$t('token-holders.s-bonding-curve.sell')}}</div>
			</div>
		</div>

		<div style="margin: 20px;"></div>

		<div class="provide-liquidity-box">
			<div class="provide-liquidity__inputs-сontainer" style="background: #203160">
				<div class="notification">
					<div class="notification__text" v-html="$t('token-holders.s-bonding-curve.notification')"></div>
				</div>
				<div class="form__info">
					<div class="form-info-box overflow-visible">
						<div class="text">
							{{
								bondingCurve=='BUY'?
								$t('token-holders.s-bonding-curve.inputs.buy[0]'):
								$t('token-holders.s-bonding-curve.inputs.sell[0]')
							}}:
						</div>
						<div class="input connected" :class="{'with-max': true}" data-type="HEGIC">
							<input type="text" v-model="amount" placeholder="1">
							<div class="input__max"></div>
						</div>
					</div>
					<div class="form-info-box with-arrow"><div :class="{reversed: bondingCurve=='BUY'}" class="provide-liquidity__arrow mobile-rotate two"></div></div>
					<div class="form-info-box">
						<div class="text">
							{{
								bondingCurve=='BUY'?
								$t('token-holders.s-bonding-curve.inputs.buy[1]'):
								$t('token-holders.s-bonding-curve.inputs.sell[1]')
							}}:
						</div>
						<div class="input connected big-padding" data-type="ETH">
							<input type="text" disabled :value="ethAmount.format(18,18)">
						</div>
					</div>
				</div>
			</div>
			<div class="new-option__data">
				<div class="new-option__schedule-box">
					<bc-chart
						:change="bcAmount.add(bcChange)"
						:params="{startPrice, k, max}"
						:emmited="bcAmount"
						:style="{width: '100%', maxHeight:'200px', margin:'auto'}"></bc-chart>
					<div class="schedule__legend">
						<div class="schedule-legend__title"
							v-html="$t('token-holders.s-bonding-curve.schedule.legend-title')"></div>
						<div class="schedule-legend__vals">
							<div class="schedule-legend__val green">
								{{$t('token-holders.s-bonding-curve.schedule.legend[0]')}}</div>
							<div class="schedule-legend__val lp">
								{{$t('token-holders.s-bonding-curve.schedule.legend[1]')}}</div>
							<div class="schedule-legend__val blue">
								{{$t('token-holders.s-bonding-curve.schedule.legend[2]')}}</div>
						</div>
					</div>
				</div>
				<div class="new-option__schedule-infos">
					<div class="new-option__schedule-info green">
						<div class="n-o-schedule-info__title">
							{{
								bondingCurve=='BUY'?
									$t('token-holders.s-bonding-curve.schedule.info-box[0].price[0]'):
									$t('token-holders.s-bonding-curve.schedule.info-box[0].price[1]')
							}}
						</div>
						<div class="n-o-schedule-info__val fix-b-c">
							<span>
								{{dealPrice.format(8,6)}} ETH
							</span>
							<span class="additional">≈${{
								dealPrice.mul(this.$store.state.prices.ETH).format(16,3)
							}}</span>
						</div>
					</div>
					<div class="new-option__schedule-info lp">
						<div class="n-o-schedule-info__title">
							{{$t('token-holders.s-bonding-curve.schedule.info-box[1]')}}
                        </div>
						<div class="n-o-schedule-info__val fix-b-c">
                            <span>
                                {{bcAmount.format(18,3)}} HEGIC
                            </span>
							<span class="additional">
                                {{bcAmountETH.format(18,3)}} ETH
                            </span>
                        </div>
					</div>
					<div class="new-option__schedule-info blue">
						<div class="n-o-schedule-info__title">
							{{$t('token-holders.s-bonding-curve.schedule.info-box[2]')}}</div>
						<div class="n-o-schedule-info__val fix-b-c">
                            <span>{{max.format(18,3)}} HEGIC</span>
							<span class="additional">
                                {{maxETH.format(18,3)}} ETH
                            </span>
                        </div>
					</div>
				</div>
			</div>
			<div class="provide-liquidity__submit-container">
				<button
                    :disabled="bcAmount.add(bcChange).isNeg() || bcAmount.add(bcChange).gt(max)"
					@click="call"
					v-text="bondingCurve=='BUY'?$t('token-holders.s-bonding-curve.buy'):$t('token-holders.s-bonding-curve.sell')"
					class="button primary"></button>

				<div class="text"
					v-text="$t('token-holders.s-bonding-curve.info')">
				</div>
			</div>
		</div>

	</div>
</template>
