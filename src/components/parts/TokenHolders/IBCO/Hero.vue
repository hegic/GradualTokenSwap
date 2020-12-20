<script>
	import Web3 from 'web3'
	import RadialProgressBar from '../../RPB.vue'
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
		inject:['isNumber'],
		data() { return {
			amount: null,
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
			async buy(){
				this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.provide.confirm.title'),
					text: this.$t('token-holders-ibco.notifications.provide.confirm.text')
				})
				await this.$store.state.web3.eth.sendTransaction({
					from: this.$store.state.accounts[0],
					to: this.$store.state.contracts.IO._address,
					value: toWei(this.amount),
				})
				.on('transactionHash', tx => this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.provide.pending.title'),
					text: this.$t('token-holders-ibco.notifications.provide.pending.text'),
					tx
				}))
				.on('receipt', receipt => this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.provide.receipt.title'),
					text: this.$t('token-holders-ibco.notifications.provide.receipt.text'),
					tx: receipt.transactionHash
				}))
				.on('error', error => this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.provide.error.title'),
					text: this.$t('token-holders-ibco.notifications.provide.error.text')
				}))




				await this.$store.dispatch('readIOParams')
				this.amount = '0'
			},
			async claim(){
				this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.claim.confirm.title'),
					text: this.$t('token-holders-ibco.notifications.claim.confirm.text')
				})
				await this.$store.state.contracts.IO.methods.claim().send()
				.on('transactionHash', tx => this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.claim.pending.title'),
					text: this.$t('token-holders-ibco.notifications.claim.pending.text'),
					tx
				}))
				.on('receipt', receipt => this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.claim.receipt.title'),
					text: this.$t('token-holders-ibco.notifications.claim.receipt.text'),
					tx: receipt.transactionHash
				}))
				.on('error', error => this.$root.showNotification({
					title: this.$t('token-holders-ibco.notifications.claim.error.title'),
					text: this.$t('token-holders-ibco.notifications.claim.error.text')
				}))
				await this.$store.dispatch('readIOParams')
				await this.$store.dispatch('updateBalances')
			},
		},
		watch: {
			currentTime(time) {
			  if (time === 0) {
			    this.stopTimer()
			  }
			}
		},
		computed:{
			leftForStart(){ return interval(this.IOParams.START - this.now)},
			leftForEnd(){ return interval(this.IOParams.END - this.now)},
			hegicBalance(){return this.$store.state.balances.HEGIC},
			achieved(){
				return this.IOParams && this.IOParams.totalProvided.gte(this.IOParams.MINIMAL_PROVIDE_AMOUNT)
			},
			IOParams(){
				return this.$store.state.IOParams
			},
			state(){
					return this.IOParams ? "ended" : "waiting"
			},
			beClaimed() {
				if(!this.IOParams) return null
				const share = this.IOParams.provided
				const total = this.IOParams.totalProvided
				const distribute = this.IOParams.TOTAL_DISTRIBUTE_AMOUNT
				const amount = toBN(toWei(this.amount || "0"))
				const newTotal = total.add(amount)
				const newShare = share.add(amount)
				const hegic = total.isZero() ? toBN(0):
					distribute.mul(share).div(total)
				const newHegic = newTotal.isZero() ? toBN(0):
					distribute.mul(newShare).div(newTotal)
				const change = newHegic.sub(hegic)
				const price = newTotal.mul(toBN("1000")).div(distribute)
				return { hegic, price, change }
			},
			providedShare(){
				const MAX = toBN('10000')
				const {totalProvided, MINIMAL_PROVIDE_AMOUNT} = this.IOParams
				const provided = totalProvided.mul(MAX).div(MINIMAL_PROVIDE_AMOUNT)
				return (provided.lte(MAX) ? provided : MAX).toNumber()
			},
			userShare(){
				const {totalProvided, provided} = this.IOParams
				const total = totalProvided.isZero() ? toBN('1') : totalProvided
				return provided.mul(toBN('10000')).div(total).toNumber()

			},
			currentPrice(){
				if(!this.IOParams) return null
				const price = this.$store.state.prices.ETH
				return this.IOParams.totalProvided.mul(price).div(this.IOParams.TOTAL_DISTRIBUTE_AMOUNT)
			},
			IBCOProcess(){
				return {
					total: this.IOParams.END - this.IOParams.START,
					now: this.leftForEnd.raw
				}
			}
		},
		components: {RadialProgressBar},
	}
</script>
<template>
	<div class="hero-content--connect th">

		<div v-if="IOParams" class="hero-content-box">

			<div v-if="state=='waiting'" class="th-hegic-ibco th-waiting-ibco"
				v-text="$t(`token-holders-ibco.in-process.s-hero.min-title`)"/>

			<div v-if="state=='waiting'" class="hero-title th-big"
				v-text="$t(`token-holders-ibco.before.s-hero.starts-in`)"/>

			<!-- <div class="th-ibco-hero-end state-waiting" v-if="state=='waiting'">
				<div class="hero-text" v-html="$t(`token-holders-ibco.before.s-hero.start-in`)"></div>
			</div>
 -->



			<div class="th-timer" v-if="state=='waiting'">
				<div class="th-timer__blok">
					<div class="th-timer__val">
						{{leftForStart.d}}
					</div>
					<div class="th-timer__text">
						{{$t("token-holders-ibco.date.D")}}
					</div>
				</div>
				<div class="th-timer__blok">
					<div class="th-timer__val">
						{{leftForStart.h}}
					</div>
					<div class="th-timer__text">
						{{$t("token-holders-ibco.date.H")}}
					</div>
				</div>
				<div class="th-timer__blok">
					<div class="th-timer__val">
						{{leftForStart.min}}
					</div>
					<div class="th-timer__text">
						{{$t("token-holders-ibco.date.M")}}
					</div>
				</div>
				<div class="th-timer__blok">
					<div class="th-timer__val">
						{{leftForStart.s}}
					</div>
					<div class="th-timer__text">
						{{$t("token-holders-ibco.date.S")}}
					</div>
				</div>
			</div>


			<div v-if="state=='active'" class="th-hegic-ibco"
				v-html="$t(`token-holders-ibco.in-process.s-hero.min-title`)"></div>
			<div v-if="state=='active'" class="hero-title" v-html="$t(`token-holders-ibco.in-process.s-hero.title`)"></div>

			<div v-if="state=='active'"
				class="with-radial-progress-bar" style="display:flex; justify-content: space-around">

				<div class="min-radial-brogress-bar">
					<radial-progress-bar :diameter="250"
							 :completed-steps="providedShare"
							 :total-steps="10000"
							 start-color="#45fff4"
							 stop-color="#2e4f7e"
							 inner-stroke-color="#19274d"
							 stroke-linecap="round"
							 :inner-stroke-width="8"
							 :stroke-width="16">
						<p class="th-circle__text additional">{{$t(`token-holders-ibco.all.total-provided`)}}</p>
						<p class="th-circle__text large">{{IOParams.totalProvided.format(18)}} ETH</p>
						<p class="th-circle__text additional" v-if="IOParams.totalProvided.lt(IOParams.MINIMAL_PROVIDE_AMOUNT)">
							{{$t(`token-holders-ibco.all.goal`)}}
							: {{ IOParams.MINIMAL_PROVIDE_AMOUNT.format(18) }} ETH
						</p>
						<p class="th-circle__text additional" v-else>
							{{$t(`token-holders-ibco.all.price`)}}: ${{ currentPrice.format(8,6) }}
						</p>
					</radial-progress-bar>
				</div>

				<radial-progress-bar :diameter="350"
						 :completed-steps="IOParams.END - IOParams.START - leftForEnd.raw"
						 :total-steps="IOParams.END - IOParams.START"
						 start-color="#45fff4"
						 stop-color="#2e4f7e"
						 inner-stroke-color="#19274d"
						 stroke-linecap="round"
						 :inner-stroke-width="8"
						 :stroke-width="16"
						 class="center-radial-brogress-bar">
					<div style="transform:scale(1.5)" class="th-timer-block-active" v-if="state=='active'">
						<div class="th-ibco-hero-end">
							<div class="hero-text" v-html="$t(`token-holders-ibco.in-process.s-hero.end`)"></div>
							<div class="th-timer mini">
								<div class="th-timer__blok">
									<div class="th-timer__val">
										{{leftForEnd.d}}
									</div>
									<div class="th-timer__text">
										{{$t("token-holders-ibco.date.D")}}
									</div>
								</div>
								<div class="th-timer__blok">
									<div class="th-timer__val">
										{{leftForEnd.h}}
									</div>
									<div class="th-timer__text">
										{{$t("token-holders-ibco.date.H")}}
									</div>
								</div>
								<div class="th-timer__blok">
									<div class="th-timer__val">
										{{leftForEnd.min}}
									</div>
									<div class="th-timer__text">
										{{$t("token-holders-ibco.date.M")}}
									</div>
								</div>
								<div class="th-timer__blok">
									<div class="th-timer__val">
										{{leftForEnd.s}}
									</div>
									<div class="th-timer__text">
										{{$t("token-holders-ibco.date.S")}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</radial-progress-bar>
				<div class="min-radial-brogress-bar">
					<radial-progress-bar :diameter="250"
							 :completed-steps="userShare"
							 :total-steps="10000"
							 start-color="#45fff4"
							 stop-color="#2e4f7e"
							 inner-stroke-color="#19274d"
							 stroke-linecap="round"
							 :inner-stroke-width="8"
							 :stroke-width="16">
						<p class="th-circle__text additional">{{$t(`token-holders-ibco.all.your-share`)}}:</p>
						<p class="th-circle__text token-hegic x">{{beClaimed.hegic.format(18)}}</p>
						<p class="th-circle__text additional">{{IOParams.provided.format(18,1)}} ETH ({{ (userShare /100) }}%)</p>
					</radial-progress-bar>
				</div>
			</div>

			<div v-if="state=='active'" class="provide-liquidity__inputs-сontainer">
				<div class="form__info th-form">
					<div style="flex:7" class="form-info-box overflow-visible">
						<div class="text" v-html="$t(`token-holders-ibco.in-process.s-hero.choose-amount`)"></div>
						<div class="input connected with-max" data-type="ETH">
							<input type="text" @keypress="isNumber" v-model="amount" placeholder="0">
						</div>
					</div>
					<div style="flex:2" class="form-info-box with-arrow"><div class="provide-liquidity__arrow mobile-rotate"></div></div>
					<div style="flex:7" class="form-info-box">
						<div class="text" v-html="$t(`token-holders-ibco.in-process.s-hero.est-amount`)"></div>
						<div class="input connected big-padding" data-type="HEGIC">
							<input type="text" disabled @keypress="isNumber" :value="beClaimed.change.format(18,2)">
						</div>
					</div>
					<button @click="buy" class="button primary">{{$t("token-holders-ibco.in-process.s-hero.button")}}</button>
				</div>
			</div>

			<!-- <div v-if="state=='active'" class="hero-text"
				v-html="$t(`token-holders-ibco.in-process.s-hero.choose-amount`)"></div>
			<div class="input-box">
				<input type="text" placeholder="0" v-model="amount" @keypress="isNumber">
				<div data-type="ETH" class="input-box__type">ETH</div>
			</div>
			<div v-if="state=='active'" class="hero-text"
				v-html="$t(`token-holders-ibco.in-process.s-hero.est-amount`)"></div>
			<div v-if="state=='active'" class="hero-th-info__val status__value token-hegic">
			{{beClaimed.hegic.format(18,2)}}</div>
			<div v-if="state=='active'" class="th-ibco-hero-button-box">
				<button @click="buy" class="button primary">{{$t("token-holders-ibco.in-process.s-hero.button")}}</button>
			</div>
		-->






			<div class="th-hegic-ibco" v-html="$t(`token-holders-ibco.in-process.s-hero.min-title`)" v-if="state=='ended'"></div>
			<div v-if="state=='ended' && achieved" class="hero-title" v-html="$t(`token-holders-ibco.successful.s-hero.title`)"></div>

			<div v-if="state=='ended' && achieved && !$store.state.IOParams.provided.isZero()" class="hero-text"
				v-html="$t(`token-holders-ibco.successful.s-hero.est-amount`)"></div>

			<div v-if="state=='ended' && achieved && !$store.state.IOParams.provided.isZero()" class="hero-th-info__val status__value token-hegic">
				{{beClaimed.hegic.format(18,2)}}</div>
			<div v-if="state=='ended' && achieved && !$store.state.IOParams.provided.isZero()" class="th-ibco-hero-button-box">
				<button @click="claim" class="button primary">{{$t("token-holders-ibco.successful.s-hero.button")}}</button>
			</div>


			<div v-if="state=='ended' && !achieved" class="hero-title" v-html="$t(`token-holders-ibco.failed.s-hero.title`)"></div>
			<div v-if="state=='ended' && !achieved && !$store.state.IOParams.provided.isZero()" class="hero-text"
				v-html="$t(`token-holders-ibco.failed.s-hero.est-amount`)"></div>
			<div v-if="state=='ended' && !achieved && !$store.state.IOParams.provided.isZero()" class="hero-th-info__val status__value">
				{{IOParams.provided.format(18,3)}} ETH</div>
			<div v-if="state=='ended' && !achieved && !$store.state.IOParams.provided.isZero()" class="th-ibco-hero-button-box">
				<button @click="claim" class="button primary">{{$t("token-holders-ibco.failed.s-hero.button")}}</button>
			</div>

			<div v-if="state=='ended' && $store.state.IOParams.provided.isZero()" class="hero-text"
				v-html="$t(`token-holders-ibco.successful.s-hero.current-amount`)"></div>
			<div v-if="state=='ended' && $store.state.IOParams.provided.isZero()" class="hero-th-info__val status__value token-hegic">
				{{hegicBalance.format(18,2) }}</div>










		</div>

		<div v-else class="hero-content-box">
			<div class="hero-title">{{$t(`token-holders-ibco.all.loading`)}}</div>
		</div>
	</div>
</template>
