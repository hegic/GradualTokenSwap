<script>
	export default {
		emits:['update:modelValue', 'close'],
		props:['modelValue', 'connected'],
		methods:{
			select(tab){
				window.localStorage.setItem('tab',tab)
				this.$emit('update:modelValue', tab)
				this.$emit('close')
			}
		}
	}
</script>

<template lang="pug">
.tabs
  .header__tab(v-if='connected' @click="select('H' )" :class="{select: modelValue == 'H'}") {{$t('tabs.holders')}}
  //- .header__tab.hide-on-phone(v-if='connected' @click="select('LP')" :class="{select: modelValue == 'LP'}") {{$t('tabs.liquidity-providers')}}
  .header__tab(v-if='connected' @click="select('LP')" :class="{select: modelValue == 'LP'}") {{$t('tabs.writers')}}
  .header__tab(v-if='connected' @click="select('TH')" :class="{select: modelValue == 'TH'}") {{$t('tabs.token-holders')}}
  a.header__tab(href='https://duneanalytics.com/slash125/hegic-v2' target='_blank') {{$t('tabs.analytics')}}
</template>
