<script>
	import {mapActions, mapGetters} from 'vuex'

	import NotConnectedHero from './LP/Hero.vue'
	import DocumentsAndJoins from './LP/DocumentsAndJoins.vue'
	import NotificationElem from './Popup/NotificationElem.vue'
  import ErrorPopup from './Popup/Error.vue'
	import SwapToken from './Swap.vue'

	export default {
		components: {
			NotConnectedHero,
			DocumentsAndJoins,
			NotificationElem,
			SwapToken,
			ErrorPopup,
		},
		computed:{
			...mapGetters(['account']),
			connected(){ return this.account ? true : false },
		},
		methods: {
			connect(){
				this.$store.dispatch('connection/toggle')
					.catch(error => this.errorMessage = error && error.toString())
			},
		}
	}
</script>

<template lang="pug">
error-popup(v-model='errorMessage')
.main(:class="{holders: selectedTab == 'H', connected}")
	.notification-box: notification-elem(
		v-for="notification in $store.state.notifications.list"
		:notification="notification"
	)
	header.header.footer.hide-on-computer
		.hegic: a.a(href='//www.hegic.co' style={color:'inherit'}) HEGIC
		.tabs
		button.button.secondary(@click="connect" v-if="!connected") {{$t("connect")}}
		button.button.secondary.yellow(@click="connect" v-else="") {{$t("disconnect")}}


	//----------------------------section hero--------------------------------
	.section.hero: .hero-box
		.header.hide-on-phone
			.hegic: a.a(href='//www.hegic.co' style={color:'inherit'}) HEGIC
			.tabs
			button.button.secondary(@click="connect" v-if="!connected") {{$t("connect")}}
			button.button.secondary.yellow(@click="connect" v-else="")
				span.base {{$t("disconnect")}}
				span.address {{account}}
		.hero-content(v-if="!connected")
			.hero-content-box
				.hero-title(v-html='$t(`token-holders.s-swap-token.hero-title`)')
				.hero-text
					div(
						v-for='i in $tm(`token-holders.s-swap-token.hero-texts`).length'
						v-html='$t(`token-holders.s-swap-token.hero-texts[${i-1}]`)'
					)
				.hero-connect-box
					button.button.primary(@click='connect' v-text='$t(`connect`)')
					.hero-status
						.hero-status--title {{ $t(`not-connected.s-hero.current-status`) }}:
						.hero-status--value {{ $t(`not-connected.s-hero.current-status-val`) }}
			.cryo.icon-hegic
	swap-token(v-if="connected")

	//- -----GENERAL-----

	documents-and-joins
	.help: .text {{$t('need-help')}} #[a(href="mailto:help@hegic.co") help@hegic.co]

	.header.footer: .header__box
			.hegic: a.a(href='//www.hegic.co' style={color:'inherit'}) HEGIC
			.tabs
			button.button.secondary(@click="connect" v-if="!connected") {{$t("connect")}}
			button.button.secondary.yellow(@click="connect" v-else="") {{$t("disconnect")}}
	.section.bottom: .text {{new Date().getFullYear()}} {{$t('c-hegic')}}
</template>

<style lang="stylus" src="styles/index.styl"/>
