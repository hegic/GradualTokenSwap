<script>
	import FAQ from './parts/FAQ/FAQ.vue'
	import {mapActions, mapGetters} from 'vuex'

	import NotConnectedHero from './parts/NotConnected/Hero.vue'
	import Reviews from './parts/NotConnected/Reviews.vue'
	import Status from './parts/NotConnected/Status.vue'
	import UseCases from './parts/NotConnected/UseCases.vue'
	import UserCase from './parts/NotConnected/UserCase.vue'
	import LandingForm from './parts/NotConnected/Form.vue'
	import DocumentsAndJoins from './parts/NotConnected/DocumentsAndJoins.vue'

	import Tabs from './parts/Tabs.vue'
	import NotificationElem from './parts/NotificationElem.vue'

	import PopUpExecute from './parts/PopUp/Execute.vue'
	import PopUpProviding from './parts/PopUp/Providing.vue'
	import PopUpWithdrawing from './parts/PopUp/Withdrawing.vue'
	import PopUpConfirm from './parts/PopUp/Confirm.vue'
	import PopUpError from './parts/PopUp/Error.vue'
	import PopUpLoading from './parts/PopUp/Loading.vue'
	import PopUpWarningAudit from './parts/PopUp/WarningAudit.vue'

	import HoldersHero from './parts/Holders/Hero.vue'
	import HolderOptions from './parts/Holders/Options.vue'
	import LiquidityPool from './parts/Holders/LiquidityPool.vue'
	import NewOption from './parts/Holders/NewOption.vue'


	import LiquidityProvidersHero from './parts/LiquidityProviders/Hero.vue'
	import PoolSelect from './parts/LiquidityProviders/PoolSelect.vue'
	import ProvidersStatus from './parts/LiquidityProviders/Status.vue'
	import EmptySchedule from './parts/LiquidityProviders/EmptySchedule.vue'
	import ProvideLiquidity from './parts/LiquidityProviders/Provide.vue'
	import ProviderEarnings from './parts/LiquidityProviders/Earnings.vue'

	import TokenHoldersHero from './parts/TokenHolders/main/Hero.vue'
	import TokenHoldersInfo from './parts/TokenHolders/main/Info.vue'
	import SwitchInteract from './parts/TokenHolders/main/SwitchInteract.vue'

	import LiquidityMiningRewards from './parts/TokenHolders/main/LiquidityMiningRewards.vue'
	import LiquidityUtilizationRewards from './parts/TokenHolders/main/LiquidityUtilizationRewards.vue'
	import Staking from './parts/TokenHolders/main/Staking.vue'
	import BondingCurve from './parts/TokenHolders/main/BondingCurve.vue'
	import TokenAnalytics from './parts/TokenHolders/main/TokenAnalytics.vue'
	import SwapToken from './parts/TokenHolders/main/Swap.vue'

	import TokenHoldersIbcoHero from './parts/TokenHolders/IBCO/Hero.vue'
	import TokenHoldersIbcoInfo from './parts/TokenHolders/IBCO/Info.vue'
	import TokenHoldersIbcoTransactionsList from './parts/TokenHolders/IBCO/TransactionsList.vue'
	import TokenHoldersIbcoTexts from './parts/TokenHolders/IBCO/Texts.vue'

	// import Summary from './parts/Summary.vue'
	import Web3 from 'web3'

	import PopUpStakingClaim from './parts/TokenHolders/PopUp/StakingClaim.vue'
	import PopUpStakingWithdraw from './parts/TokenHolders/PopUp/StakingWithdraw.vue'
	import PopUpLockTokens from './parts/TokenHolders/PopUp/LockTokens.vue'
	import PopUpUnlockTokens from './parts/TokenHolders/PopUp/UnlockTokens.vue'


	const toBN = Web3.utils.toBN

	Date.prototype.toString = function(){
		return this.toLocaleString(undefined,{ year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' })
	};

	export default {
		provide(){ return {isNumber:this.isNumber}},
		data(){ return {
				selectedTab: 'TH',
				subscriptions: [],
				providedOptions: null,
				selectedPool: 'WBTC',
				mobileMenu: false,
				exOption: null,
				withdrawLFTP: null,
				popUpConfirm: null,
				popUpError: null,
				popUpLoading: null,
				popUpWarningAudit: null,
				interact: 0,

				popUpStakingClaim: null,
				popUpStakingWithdraw: null,
				popUpLockTokens: null,
				popUpUnlockTokens: null
		}},
		components: {
			FAQ,

			Tabs,

			NotConnectedHero,
			Reviews,
			Status,
			UseCases,
			UserCase,
			LandingForm,
			DocumentsAndJoins,

			PopUpExecute,
			PopUpProviding,
			PopUpWithdrawing,
			PopUpConfirm,
			PopUpError,
			PopUpLoading,
			PopUpWarningAudit,

			HoldersHero,
			HolderOptions,
			NewOption,
			LiquidityPool,

			LiquidityProvidersHero,
			PoolSelect,
			ProvidersStatus,
			EmptySchedule,
			ProvideLiquidity,
			ProviderEarnings,

			NotificationElem,

			TokenHoldersHero,
			TokenHoldersInfo,
			SwitchInteract,
			LiquidityMiningRewards,
			LiquidityUtilizationRewards,
			Staking,
			BondingCurve,
			TokenAnalytics,
			SwapToken,
			TokenHoldersIbcoHero,
			TokenHoldersIbcoInfo,
			TokenHoldersIbcoTransactionsList,
			TokenHoldersIbcoTexts,

			PopUpStakingClaim,
			PopUpStakingWithdraw,
			PopUpLockTokens,
			PopUpUnlockTokens

		},
		computed:{
			...mapGetters(['web3', 'options']),
			activeOptions(){
				const account = this.$store.state.accounts[0].toLowerCase()
				return this.options.filter(x => x.holder.toLowerCase() == account)
			},
			connected(){ return this.$store.state.provider ? true : false },
		},
		methods: {
			isNumber(evt){
				evt = (evt) ? evt : window.event;
				var charCode = (evt.which) ? evt.which : evt.keyCode;
					const value = `${evt.target.value}${String.fromCharCode(charCode)}`
					if(charCode )
				if ((charCode > 31 && (48 > charCode || charCode > 57)) && (charCode != 46 ||  evt.target.value.indexOf('.') > 0)) {
					evt.preventDefault();;
				} else {
					return true;
				}
			},
			async connect(){
				this.$store.dispatch('connection/toggle')
			},
		}
	}
</script>

<template lang="pug">
.main(:class="{holders: selectedTab == 'H', connected}")
	.notification-box: notification-elem(
		v-for="notification in $store.state.notifications.list"
		:notification="notification"
	)
	//- .help.stock: .text
	//- 	| #[label.emoji 🧙‍♂️] Hegic #[span.bold v888]
	//- 	| is LIVE and currently in beta. #[label.emoji 🧙‍♂️]#[br]
	//- 	| Use it at #[span.bold your own risk]. DYOR.
		//- a( href="https://medium.com/hegic/announcing-hegic-token-liquidity-mining-utilization-rewards-and-staking-d1dd6605f2cd" target="_blank") Read the announcement article.

	pop-up-execute(v-if="exOption" :option="exOption" @close="exOption=null" @exercise="exercise")
	pop-up-providing(v-if="providedOptions" :pool="selectedPool" :options="providedOptions" @close="providedOptions=null" @provide="provide")
	pop-up-withdrawing(v-if="withdrawLFTP" :selected-pool="selectedPool" :params="withdrawLFTP" @close="withdrawLFTP=null" @withdraw="withdraw")
	pop-up-confirm(v-if="popUpConfirm" @close="popUpConfirm=null" @confirm="alert('confirm')")
	pop-up-error(v-if="popUpError" @close="popUpError=null" :message="popUpError")
	pop-up-loading(v-if="popUpLoading" @close="popUpLoading=null")
	pop-up-warning-audit(v-if="popUpWarningAudit" @close="popUpWarningAudit=null")

	//- .mobile-menu.hide-on-computer(:class="{'hidden': mobileMenu==false}" @click="mobileMenu=false")
		.mobile-menu-box(@click.stop="")
			.mobile-menu__header
				.icon-menu.close(@click="mobileMenu=false")
				.hegic HEGIC
			tabs(:connected="connected" @close="mobileMenu=false" v-model="selectedTab")

	header.header.footer.hide-on-computer
		.icon-menu(@click="mobileMenu=true")
		.hegic HEGIC
		//- .tabs
		button.button.secondary(@click="connect" v-if="!connected") {{$t("connect")}}
		button.button.secondary.yellow(@click="connect" v-else="") {{$t("disconnect")}}


	//- *****HERO*****
	//----------------------------section hero--------------------------------
	.section.hero: .hero-box
		.header.hide-on-phone
			.icon-menu
			.hegic HEGIC
			.tabs
			button.button.secondary(@click="connect" v-if="!connected") {{$t("connect")}}
			button.button.secondary.yellow(@click="connect" v-else="")
				span.base {{$t("disconnect")}}
				span.address {{$store.state.accounts[0]}}

		//- not-connected-hero(v-if="!connected" @connect="connect")
	//----------------------------------------------------------------------------
	//- *****HOLDERS*****
		holders-hero(v-if="connected && selectedTab == 'H'")
		holder-options(v-if="connected && selectedTab == 'H'" :options="activeOptions" @option-exercise="option => exOption = option")
		new-option(v-if="connected && selectedTab == 'H'" :pool="selectedPool" @create-option="createOption")
		liquidity-pool(v-if="connected && selectedTab == 'H'" :options="options")
	//- use-cases(v-if="!connected")
	//- landing-form(v-if="!connected" @connect="connect")
	//- status(v-if="!connected")
	//- reviews(v-if="!connected")
	//- *****LIQUIDITY-PROVIDERS*****
		liquidity-providers-hero(v-if="connected && selectedTab == 'LP'")
		pool-select(v-if="connected && selectedTab == 'LP'" :selectedpool="selectedPool" @changepool="pool => selectedPool=pool")
		provider-earnings(v-if="connected && selectedTab == 'LP'" :selectedpool="selectedPool" :options="options" @withdraw="showWithdraw")
		provide-liquidity(v-if="connected && selectedTab == 'LP'" :selectedpool="selectedPool" @provide="x => {providedOptions = x}")
		providers-status(v-if="connected && selectedTab == 'LP'" :selectedpool="selectedPool")
	//- user-case(v-if="!connected")
	//- *****TOKEN HOLDERS*****
	//- TOKEN HOLDERS - ibco
		token-holders-ibco-hero(v-if="connected && selectedTab == 'TH'")
		token-holders-ibco-info(v-if="connected && selectedTab == 'TH'")
		token-holders-ibco-transactions-list(v-if="connected && selectedTab == 'TH' && $store.state.IOParams")
		token-holders-ibco-texts(v-if="connected && selectedTab == 'TH'")
	//- TOKEN HOLDERS - lk
	//- token-holders-hero(v-if="connected && selectedTab == 'TH'")
	//- token-holders-info(v-if="connected && selectedTab == 'TH'")
	//- switch-interact(v-if="connected && selectedTab == 'TH'" @changeinteract="x => interact=x" :interact="interact")
	//- liquidity-mining-rewards(@openlocktokens="popUpLockTokens = $event" @openunlocktokens="popUpUnlockTokens = $event" v-if="connected && selectedTab == 'TH' && interact==0")
	//- liquidity-utilization-rewards(v-if="connected && selectedTab == 'TH' && interact==1")
	//- staking(@openstakingclaim="popUpStakingClaim = $event" @openstakingwithdraw="popUpStakingWithdraw = $event" v-if="connected && selectedTab == 'TH' && interact==2")
	//- bonding-curve(v-if="connected && selectedTab == 'TH' && interact==3")
	//- token-analytics(v-if="connected && selectedTab == 'TH' && interact==4")
	swap-token


	//- pop-up-staking-claim(v-if="popUpStakingClaim" :params="popUpStakingClaim" @close="popUpStakingClaim = false")
	//- pop-up-staking-withdraw(v-if="popUpStakingWithdraw" :params="popUpStakingWithdraw" @close="popUpStakingWithdraw = false")
	//- pop-up-lock-tokens(v-if="popUpLockTokens" :params="popUpLockTokens" @rs-stake="$store.dispatch('rsStake', $event)" @close="popUpLockTokens = null")
	//- pop-up-unlock-tokens(v-if="popUpUnlockTokens" :params="popUpUnlockTokens" @close="popUpUnlockTokens = null" @rs-withdraw="alert('test')")
	//- *****GENERAL*****
	//- FAQ( :connected="connected" :selectedtab="selectedTab")
	documents-and-joins
	.help: .text {{$t('need-help')}} #[a(href="mailto:help@hegic.co") help@hegic.co]

	.header.footer: .header__box
			.icon-menu(v-if="connected" @click="mobileMenu=true")
			.hegic HEGIC
			.tabs
			button.button.secondary(@click="connect" v-if="!connected") {{$t("connect")}}
			button.button.secondary.yellow(@click="connect" v-else="") {{$t("disconnect")}}
	.section.bottom: .text {{new Date().getFullYear()}} {{$t('c-hegic')}}

</template>

<style lang="stylus" src="styles/index.styl" />
