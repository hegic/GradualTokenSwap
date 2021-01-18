<script>
  import Web3 from 'web3'
  import {toBN} from 'utils/BN'
  const {toWei} = Web3.utils

  import {mapState} from 'vuex'

  import Web3Input from './Web3Input.vue'
  import MySwitch from './elements/switch.vue'

	export default {
    components: { Web3Input, MySwitch },
		data(){ return {
      mode: "claim",
      inProgress: false,
			_amount: null,
		}},
		computed:{
      ...mapState({
        available: state => state.gradualTokenSwap.available,
        rBalance: state => state.gradualTokenSwap.rHEGIC,
        hBalance: state => state.gradualTokenSwap.HEGIC,
      }),
      amount(){return this._amount || this.rBalance},
		},
		methods: {
			async start(name){
        this.inProgress = true
        await this.$store.dispatch(`gradualTokenSwap/${name}`, this.amount).then(
          () => {this.inProgress = false; this.amount = null},
          error => {
            this.inProgress = false
            console.error(error)
          }
        )
      }
		}
	}
</script>
<template lang="pug">

#js-provide.section.provide-liquidity
  div(style="margin:20px;")
  .th-switch-titles
    .hero-title(v-html='$t(`token-holders.s-swap-token.hero-title`)')
    .hero-text
      div(
        v-for='i in $tm(`token-holders.s-swap-token.hero-texts`).length'
        v-html='$t(`token-holders.s-swap-token.hero-texts[${i-1}]`)'
      )

  //- .category-title
  //-   | swap token
  my-switch(v-model='mode' :domain="['claim', 'provide']")
  div(style="margin:10px;")


  .provide-liquidity-box(v-if="mode == 'claim'")
    .div(class='provide-liquidity__inputs-container')
      .notification
        .notification__text {{$t("token-holders.s-swap-token.notification")}}
      .form__info
        .form-info-box.overflow-visible
          .text(style="text-align: center;") {{$t("token-holders.s-swap-token.amount-available")}}:
          .n-o-schedule-info__val(style="margin: 30px auto 10px auto; color: #45fff4; font-size: 38px; text-shadow: 0 0 2px rgba(69,255,244,0.9);")
            | {{available.format(18,18)}} HEGIC
          //-.input.connected(:class="{'with-max': true}" data-type='HEGIC')
          //-  input(disabled :value='available.format(18,18)')
          //-  .input__max {{$t('user.wallet-balance')}}:
              |
              | {{hBalance.format(18,3)}}
        //- .form-info-box.with-arrow
        //-   .provide-liquidity__arrow.mobile-rotate
        //- .form-info-box
        //-   .text {{$t("token-holders.s-swap-token.you-will-receive")}}:
        //-   .input.connected(:class="{'with-max': true}" data-type='HEGIC')
        //-     input(disabled @keypress='isNumber' :placeholder='amount.format(18,7)')
        //-     .input__max(:class='{bad: amount.gt(available)}') {{$t('token-holders.s-swap-token.max-available')}}:
        //-       |
        //-       | {{available.format(18,3)}}
    .provide-liquidity__submit-container
      button.button.primary(@click="start('withdraw')" :disabled='inProgress || available.isZero()')
        | {{$t(inProgress ? 'token-holders.s-swap-token.progress' : 'token-holders.s-swap-token.claim')}}
      .text
        | HEGIC tokens are being unlocked and swapped in real-time each block. They are are unlocked without any connection to any particular addresses. 
        //- br
        | If you don't want to wait for unlocking tokens consider selling rHEGIC on
        |
        a.hero-link(href='https://info.uniswap.org/token/0x47c0ad2ae6c0ed4bcf7bc5b380d7205e89436e84' target='_blank') Uniswap

  .provide-liquidity-box(v-if="mode == 'provide'")
    .div(class='provide-liquidity__inputs-container')
      .notification
        .notification__text {{$t("token-holders.s-swap-token.notification")}}
      .form__info
        .form-info-box.overflow-visible
          .text {{$t("token-holders.s-swap-token.amount-provide")}}:
          .input.connected(:class="{'with-max': true}" data-type='rHEGIC')
            web3-input(v-model='_amount' :placeholder='amount.format(18,6)')
            .input__max(:class='{bad: amount.gt(rBalance)}') {{$t('user.wallet-balance')}}:
              |
              | {{rBalance.format(18,3)}}
        .form-info-box.with-arrow
          .provide-liquidity__arrow.mobile-rotate
        .form-info-box
          .text {{$t("token-holders.s-swap-token.you-will-receive")}}:
          .input.connected(:class="{'with-max': true}" data-type='HEGIC')
            input(disabled @keypress='isNumber' :placeholder='amount.format(18,7)')
            .input__max.bad {{$t('will be unlocked within 180 days')}}
    .provide-liquidity__submit-container
      button.button.primary(@click="start('provide')" :disabled='inProgress || amount.gt(rBalance) || amount.isZero()')
        | {{$t(inProgress ? 'token-holders.s-swap-token.progress' : 'token-holders.s-swap-token.provide')}}
      .text
        | HEGIC tokens are being unlocked and swapped in real-time each block. They are are unlocked without any connection to any particular addresses. 
        //- br
        | If you don't want to wait for unlocking tokens consider selling rHEGIC on
        |
        a.hero-link(href='https://info.uniswap.org/token/0x47c0ad2ae6c0ed4bcf7bc5b380d7205e89436e84' target='_blank') Uniswap
</template>
<!-- <div class="n-o-schedule-info__val claim-val">0 rHEGIC</div> -->