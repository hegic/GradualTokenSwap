<script>
  import Web3 from 'web3'
  const toBN = Web3.utils.toBN
  const toWei = Web3.utils.toWei
  import {mapState} from 'vuex'
	export default {
		inject:['isNumber'],
		data(){ return {
      inProgress: false,
			rawAmount:null,
		}},
		computed:{
      ...mapState({
        available: state => state.rSwap.swappable,
        balance: state => state.rSwap.rHEGIC,
      }),
      amount(){
        return this.rawAmount ? toBN(toWei(this.rawAmount)) : this.max
      },
			bcChange(){
				const x = toBN(toWei(this.rawAmount || '1'))
				return this.bondingCurve == 'BUY' ? x : x.neg()
			},
			max(){
				return this.balance.gt(this.available) ? this.available : this.balance
			}
		},
		methods: {
			async swap(){
        this.inProgress = true
        await this.$store.dispatch(`rSwap/swap`, this.amount).then(
          () => {this.inProgress = false; this.rawAmount = null},
          () => this.inProgress = false
        )
      }
		}
	}
</script>
<template lang="pug">
.hero-content--connect
  .hero-content-box
    .hero-title(v-html='$t(`token-holders.s-swap-token.hero-title`)')
    .hero-text
      div(
        v-for='i in $tm(`token-holders.s-swap-token.hero-texts`).length'
        v-html='$t(`token-holders.s-swap-token.hero-texts[${i-1}]`)'
      )
#js-provide.section.provide-liquidity
  //- .th-switch-titles
  //-   .hero-title(v-html='$t(`token-holders.s-swap-token.hero-title`)')
  //-   .hero-text
  //-     div(
  //-       v-for='i in $tm(`token-holders.s-swap-token.hero-texts`).length'
  //-       v-html='$t(`token-holders.s-swap-token.hero-texts[${i-1}]`)'
  //-     )

  .category-title
    | swap token
  .provide-liquidity-box
    .div(class='provide-liquidity__inputs-сontainer')
      .notification
        .notification__text {{$t("token-holders.s-swap-token.notification")}}
      .form__info
        .form-info-box.overflow-visible
          .text {{$t("token-holders.s-swap-token.amount-swap")}}:
          .input.connected(:class="{'with-max': true}" data-type='rHEGIC')
            input(v-model='rawAmount' @keypress='isNumber' :placeholder='amount.format(18,5)')
            .input__max(:class='{bad: amount.gt(balance)}') {{$t('user.wallet-balance')}}:
              |
              | {{balance.format(18,3)}}
        .form-info-box.with-arrow
          .provide-liquidity__arrow.mobile-rotate
        .form-info-box
          .text {{$t("token-holders.s-swap-token.you-will-receive")}}:
          .input.connected(:class="{'with-max': true}" data-type='HEGIC')
            input(disabled @keypress='isNumber' :placeholder='amount.format(18,5)')
            .input__max(:class='{bad: amount.gt(available)}') {{$t('token-holders.s-swap-token.max-available')}}:
              |
              | {{available.format(18,3)}}
    .provide-liquidity__submit-container
      button.button.primary(@click='swap' :disabled='inProgress || amount.gt(max)')
        | {{$t(inProgress ? 'token-holders.s-swap-token.progress' : 'token-holders.s-swap-token.swap')}}
      .text(v-html='$t(`token-holders.s-swap-token.click-swap`)')

</template>
