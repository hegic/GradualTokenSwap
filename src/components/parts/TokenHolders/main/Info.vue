<script>
	import Emoji from './Emoji.vue'
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
		data(){ return {
		}},
		components:{
			Emoji
		},
		computed:{
			staked(){
				const eStaked = this.$store.state.staking.ETH.stakedLots
				const wStaked = this.$store.state.staking.WBTC.stakedLots
				return eStaked.add(wStaked).mul(toBN("888000000000000000000000"))
			},
			total(){
				return this.$store.state.balances.HEGIC.add(this.staked)
			},
			leftForNextLevel(){
				const {total} = this
				if(total.lt(steps[0])) return steps[0].sub(total)
				if(total.lt(steps[1])) return steps[1].sub(total)
				if(total.lt(steps[2])) return steps[2].sub(total)
				if(total.lt(steps[3])) return steps[3].sub(total)
				if(total.lt(steps[4])) return steps[4].sub(total)
				if(total.lt(steps[5])) return steps[5].sub(total)
				return toBN(0)
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
		}
	}
</script>


<template>
	<div class="section">
		<div class="category-title">{{$t("token-holders.s-info.title")}}</div>

		<div class="provide-liquidity-box">

			<div class="provide-liquidity__submit-container hero-th-hegicians-citadel">
				<div class="earnings__info th-h-c__box">
					<div class="new-option__schedule-info nlp">

						<div class="hero-text" v-if="type==0" v-html="$t(`token-holders.s-info.not-part`)"></div>
						<div class="hero-text" v-else>
							{{$t(`token-holders.s-info.you-are`)}}
							<label class="th-hero-you-are__text th-hero-you-will">{{$t(`token-holders.s-info.citadel-type[${type}]`)}}!</label>
						</div>

						<div class="hero-text th-hero-you-are">
							<emoji class="emoji-big" :class="{'emoji-big-2': type>=6}" :type="type"/>
							<!-- <label class="th-hero-you-are__text">{{$t(`token-holders.s-info.citadel-type[${type}]`)}}</label> -->
						</div>

						<div class="hero-text" v-if="type<6">
							<div class="th-text-for-you">
								{{$t(`token-holders.s-info.accumulate`)}}
							</div>
							<div class="th-text-for-you">
								<!-- <label class="token-hegic">+555,000</label> -->
								<label>+{{leftForNextLevel.format(18,3)}} HEGIC</label>
							</div>
							<div class="th-text-for-you">
								{{$t(`token-holders.s-info.to-become`)}}

								<span class="th-hero-you-will">{{$t(`token-holders.s-info.citadel-type[${type+1}]`)}}!</span>
								<emoji :type="type+1"></emoji>
							</div>
						</div>
					</div>
				</div>
				<div class="earnings__dynamics th-h-c__box fix">
					<div class="category-title mobile">
						{{$t("token-holders.s-info.citadel[0]")}}
						<!-- <label class="emoji">🏩</label>: -->
					</div>
					<!-- <div style="margin: 15px"></div> -->
					<div class="citadel-box">
						<div class="th-citadel">
							<emoji :type="1"></emoji>
							<!-- <label class="emoji">🐇</label> -->
							<div class="text" v-html="$t(`token-holders.s-info.citadel[1]`)"></div>
						</div>
						<div class="th-citadel">
							<emoji :type="2"></emoji>
							<!-- <label class="emoji">🧝</label> -->
							<div class="text" v-html="$t(`token-holders.s-info.citadel[2]`)"></div>
						</div>
						<div class="th-citadel">
							<emoji :type="3"></emoji>
							<!-- <label class="emoji">🧚</label> -->
							<div class="text" v-html="$t(`token-holders.s-info.citadel[3]`)"></div>
						</div>
						<div class="th-citadel">
							<emoji :type="4"></emoji>
							<!-- <label class="emoji">🧙‍♂️</label> -->
							<div class="text" v-html="$t(`token-holders.s-info.citadel[4]`)"></div>
						</div>
						<div class="th-citadel">
							<emoji :type="5"></emoji>
							<!-- <label class="emoji">🧞‍♂️</label> -->
							<div class="text" v-html="$t(`token-holders.s-info.citadel[5]`)"></div>
						</div>
						<div class="th-citadel">
							<emoji :type="6"></emoji>
							<!-- <label class="emoji">🐲</label> -->
							<div class="text" v-html="$t(`token-holders.s-info.citadel[6]`)"></div>
						</div>
					</div>
				</div>

			</div>
			<div class="provide-liquidity__stats-сontainer">
				<div class="form__info">
					<div class="form-info-box">
						<div class="status__value">{{$store.state.balances.HEGIC.format(18,3)}}</div>
						<div class="text" v-html="$t(`token-holders.s-info.info[0]`)"></div>
					</div>
					<div class="form-info-box">
						<div class="status__value">{{staked.format(18,3)}}</div>
						<div class="text" v-html="$t(`token-holders.s-info.info[1]`)"></div>
					</div>
					<div class="form-info-box">
						<div class="status__value">${{$store.state.prices.HEGIC.format(8,8)}}</div>
						<div class="text" v-html="$t(`token-holders.s-info.info[2]`)"></div>
					</div>
					<div class="form-info-box">
						<div class="status__value">${{
							total
								.mul($store.state.prices.HEGIC)
								.format(26,2)
						}}</div>
						<div class="text" v-html="$t(`token-holders.s-info.info[3]`)"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
