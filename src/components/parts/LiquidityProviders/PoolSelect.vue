<script>
	export default {

		emits:['changePool'],
		props:['selectedPool']
	}
</script>
<template>
	<div class="section">
		<div class="category-title">{{$t("liquidity-providers.s-pool-select.title")}}</div>

		<div class="switch-pool documents">
			<div class="document"  :class="{unselected: selectedPool!='WBTC'}" @click="$emit('changePool', 'WBTC')">
				<div class="document-angles">
					<div class="document__title wbtc">
						<div class="text">
							<div class="switch-pool__header">{{$t("liquidity-providers.s-pool-select.dai-pool")}}</div>
							<div class="text" style="margin: 0" v-html="$t(`liquidity-providers.s-pool-select.dai-pool-text`)"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="document" :class="{unselected: selectedPool!='ETH'}" @click="$emit('changePool', 'ETH')">
				<div class="document-angles">
					<div class="document__title eth">
						<div class="text">
							<div class="switch-pool__header">{{$t("liquidity-providers.s-pool-select.eth-pool")}}</div>
							<div class="text" style="margin: 0" v-html="$t(`liquidity-providers.s-pool-select.eth-pool-text`)"></div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>
