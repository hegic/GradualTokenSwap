<script>
	import PutOption from './PutOption.vue'
	import CallOption from './CallOption.vue'
	import EthPool from './ETHPool.vue'
	import DaiPool from './WBTCPool.vue'

	export default {
		props:['connected', 'selectedTab'],
		data(){return{
			selectedPool: "ETH",
			radioPutNewOption: true,
			selectedTabFaq: "put"
		}},
		components: {
			PutOption,
			CallOption,
			EthPool,
			DaiPool
		}
	}
</script>
<template>
	<div class="section faq">
		
		<div class="category-title">{{$t("faq.title")}}</div>

		<div class="radio" :class="{'fix-mobile': !connected}">
			<div
				v-if="(!connected) || (connected && selectedTab=='H')"
				class="radio__value"
				:class="{select: connected ? radioPutNewOption : selectedTabFaq=='put'}"
				@click="connected ? radioPutNewOption=true : selectedTabFaq='put'">
					<div class="radio__text">{{$t("faq.put-options")}}</div>
			</div>
			<div
				v-if="(!connected) || (connected && selectedTab=='H')"
				class="radio__value"
				:class="{select: connected ? !radioPutNewOption : selectedTabFaq=='call'}"
				@click="connected ? radioPutNewOption=false : selectedTabFaq='call'">
					<div class="radio__text">{{$t("faq.call-options")}}</div>
			</div>
			<div
				v-if="(!connected) || (connected && selectedTab=='LP')"
				class="radio__value"
				:class="{select: connected ? selectedPool=='WBTC' : selectedTabFaq=='daipool'}"
				@click="connected ? selectedPool='WBTC' : selectedTabFaq='daipool'">
					<div class="radio__text">{{$t("faq.wbtc-pool")}}</div>
			</div>
			<div
				v-if="(!connected) || (connected && selectedTab=='LP')"
				class="radio__value"
				:class="{select: connected ? selectedPool=='ETH' : selectedTabFaq=='ethpool'}"
				@click="connected ? selectedPool='ETH' : selectedTabFaq='ethpool'">
					<div class="radio__text">{{$t("faq.eth-pool")}}</div>
			</div>
		</div>


		<!--HOLDER LK - PUT OPTION-->
		<put-option
			v-if="(!connected && selectedTabFaq == 'put') || (connected && selectedTab=='H' && radioPutNewOption==true)"/>



		<!--HOLDER LK - CALL OPTION-->
		<call-option 
			v-if="(!connected && selectedTabFaq == 'call') || (connected && selectedTab=='H' && radioPutNewOption==false)"/>



		<!--WRITER LK - ETH POOL-->
		<eth-pool 
			v-if="(!connected && selectedTabFaq == 'ethpool') || (connected && selectedTab=='LP' && selectedPool=='ETH')"/>



		<!--WRITER LK - WBTC POOL-->
		<dai-pool 
			v-if="(!connected && selectedTabFaq == 'daipool') || (connected && selectedTab=='LP' && selectedPool=='WBTC')"/>



	</div>
</template>