<script>
	import MySelect from '../Select.vue'
	import Web3 from 'web3'
	const toBN = Web3.utils.toBN

	export default {
		emits:['connect'],
		inject:['isNumber'],
		data(){return{
			isPutOption: true,
			amount: null,
			strike: null,
			period: {val: 1*24*3600,	text: '1 day'},
		}},
		computed:{
			strikeSelected(){
				return this.strike ?
					toBN( (this.strike * 1e8).toFixed() ) :
					this.$store.state.prices.ETH
			},
			optionCost(){
				return this.$store.getters.optionCost({
					amount: toBN( Web3.utils.toWei((parseFloat(this.amount) || 1 ).toString(), 'ether') ),
					period: toBN(this.period.val.toFixed()),
					strike: this.strikeSelected,
					type: this.isPutOption ? 'PUT' : 'CALL',
					pool: 'ETH'
				})
			}
		},
		components:{ MySelect }
	}
</script>

<template lang="pug">
.section.form
  .form-content-box
    | #[.form__left-top]#[.form__right-top]#[.form__left-bottom]#[.form__right-bottom]
    .form-content
      .form__header {{$t(`not-connected.s-form.title`)}}
      .form__info
        .form-info-box
          .text {{$t(`option.type`)}}:
          .radio
            .radio__value(:class='{select: isPutOption}' @click='isPutOption = true')
              .radio__text {{$t(`option.put`)}}
            .radio__value(:class='{select: !isPutOption}' @click='isPutOption = false')
              .radio__text {{$t(`option.call`)}}
        .form-info-box
          .text {{$t(`option.size`)}}:
          .input-box
            input(type='text' v-model='amount' placeholder='1' @keypress='isNumber')
            .input-box__type(data-type='ETH') ETH
        .form-info-box
          .text {{$t(`option.strike-price`)}}:
          .input-box(data-type='USD')
            input(
              type='text'
              :placeholder='`${strikeSelected.format(8,2)}`'
              v-model='strike'
              @keypress='isNumber'
            )
            .input-box__type(data-type='USD') USD
        .form-info-box.periods.with-select
          .text {{$t(`option.period-of-holding`)}}:
          my-select(v-model='period')
      .text(v-html='$t(`not-connected.s-form.text-1`,\
      {p0: !isPutOption ? $t(`not-connected.s-form.fall-down`) : $t(`not-connected.s-form.rise`),\
      p1: !isPutOption ? $t(`not-connected.s-form.lower`) : $t(`not-connected.s-form.higher`),\
      p2: optionCost.breakeven.format(8,2),\
      p3: period.text})')
      .text(style='margin-top: 0;' v-html='$t(`not-connected.s-form.text-2`,\
      {p0: isPutOption ? $t(`not-connected.s-form.fall-down`) : $t(`not-connected.s-form.rise`),\
      p1: isPutOption ? $t(`not-connected.s-form.lower`) : $t(`not-connected.s-form.higher`),\
      p2: optionCost.breakeven.format(8,2),\
      p3: period.text})')
      .new-option-settings
        .new-option__data
          .new-option__schedule-box
            .schedule(:data-type="isPutOption? 'put' : 'call'" :data-state='optionCost.gState')
              .schedule-value.strike
                | {{$t(`option.strike`)}}:
                span ${{strike || strikeSelected.format(8,2)}}
              .schedule-value.break-even
                | {{$t(`option.break-even`)}}:
                span ${{optionCost.breakeven.format(8,2)}}
              .schedule__line.current(:data-value='`${$t(`not-connected.s-form.current`)}: $${strikeSelected.format(8,2)}`')
              .schedule-zone.top
                .schedule__line
                .schedule__line
                .schedule__line.last
              .schedule__line
              .schedule__line
              .schedule__line
              .schedule-zone.bottom
                .schedule__line
                .schedule__line
                .schedule__line
              .schedule__legend
                .schedule-legend__title {{$t(&grave;not-connected.s-form.dynamics-value&grave;, {p0: isPutOption ? `$` : `ETH`})}}:
                .schedule-legend__vals
                  .schedule-legend__val.green {{$t(&grave;not-connected.s-form.unlimited-upside&grave;)}}
                  .schedule-legend__val.red {{$t(&grave;not-connected.s-form.worthless-expiration&grave;)}}
          .new-option__schedule-infos
            .new-option__schedule-info.strike
              .n-o-schedule-info__title {{$t(`option.strike-price`)}}
              .n-o-schedule-info__val ${{strikeSelected.format(8,2)}}
            .new-option__schedule-info.red
              .n-o-schedule-info__title {{$t(`option.total-cost`)}}
              .n-o-schedule-info__val ${{optionCost.USDFee.format(26,2)}}
            .new-option__schedule-info.green
              .n-o-schedule-info__title {{$t(`option.break-even`)}}
              .n-o-schedule-info__val ${{optionCost.breakeven.format(8,2)}}
      .form__info
        .form-info-box.card.second(onclick="this.classList.toggle('open')")
          .info-card__head
            .info-card-head__text Current Price #[br] of ETH
            .info-card-head__amount ${{strikeSelected.format(8,2)}}
          .info-card__content
            .info-card-content__text
              p
                | If the price of ETH will {{isPutOption ? 'rise': 'fall down'}}
                span.bold.blue {{isPutOption ? 'higher' : 'lower'}} than ${{optionCost.breakeven}}
                |  during the next {{period.text}}
                span.bold.blue your {{isPutOption ? 'put': 'call'}} option will expire worthless
        .form-info-box.card.third(onclick="this.classList.toggle('open')")
          .info-card__head
            .info-card-head__text
              | Total Cost of
              br
              |  an Option Contract
            .info-card-head__amount ${{optionCost.USDFee}}
          .info-card__content
            .info-card-content__text
              p
                | &middot;
                span.bold ${{optionCost.hegicFee}}
                |  is the settlement fee received by the HEGIC token holders who maintain the protocol development (1% of the option contract value)
              p
                | &middot;
                span.bold ${{optionCost.premium}}
                |  is the premium received by writers
        .form-info-box.card.first(onclick="this.classList.toggle('open')")
          .info-card__head
            .info-card-head__text
              | Break-even price
              br
              |  of an ETH {{isPutOption ? 'put': 'call'}} option
            .info-card-head__amount ${{optionCost.breakeven}}
          .info-card__content
            .info-card-content__text
              p
                | If the price of ETH will {{isPutOption ? 'fall down' : 'rise'}}
                span.bold.blue {{isPutOption ? 'lower' : 'higher'}} than ${{optionCost.breakeven}}
                |  during the next {{period.text}}
                span.bold.blue closing your  {{isPutOption ? 'put': 'call'}} option could lead to pro&filig;ts
                //- |  on your position
      button.button.primary(@click="$emit('connect')") {{$t('connect')}}

</template>
