<script>
import Web3 from 'web3'
const {toBN, toWei} = Web3.utils

export default {
	emits:['close'],
	methods:{
		isNumber(evt){
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			const value = `${evt.target.value}${String.fromCharCode(charCode)}`
			if(charCode ) if (value % 1 == 0 && value <= 3000 && value > 0) {
				return true;
			} else {
				evt.preventDefault();;
			}
		}
	},
	props:['params'],
	data(){return{
		rawValue: null
	}},
	computed:{
		pool(){return this.params},
		available(){
			return this.$store.state.staking[this.pool].stakedLots
		},
		decimals(){return 18},
		value(){return typeof this.rawValue === 'number' ? toBN(this.rawValue) : this.available}
	},
}
</script>
<template>
	<div class="pop-up" @click="$emit('close')">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="$emit('close')"></div>
			<div class="form__header" v-html="$t(`pop-up.p-staking-withdraw.title`)"></div>

			<div class="form__info inp">
				<div class="form-info-box">
					<div class="text">{{$t(`pop-up.p-staking-withdraw.amount`)}}:</div>
					<div class="input connected with-max" :data-type="pool + ' Staking Lots'">
						<input
							type="text"
							:placeholder="available"
							v-model.number="rawValue"
							@keypress="isNumber">
						<div
							class="input__max"
							:class="{bad: value.gt(available)}">
							{{$t(`pop-up.p-staking-withdraw.max-amount`)}}: {{available}}
						</div>
					</div>
				</div>
			</div>

			<div class="text"
				v-if="true"
				v-html="$t(`pop-up.p-staking-withdraw.text[0]`)"></div>

			<div class="text" v-else v-html="$t(`pop-up.p-staking-withdraw.text[1]`)"></div>

			<div class="text" v-if="$store.state.staking[pool].unlockedAt > Date.now()">
				Withdrawals will be available on:
				<span class="bold">
					{{$store.state.staking[pool].unlockedAt}}
				</span>
			</div>
			<div class="pop-up__buttons">
				<button
					:disabled="value.isZero() || value.gt(available) || $store.state.staking[pool].unlockedAt > Date.now()"
					class="button primary"
					@click="$store.dispatch('stakingWithdraw', {pool, value});$emit('close')">{{$t("pop-up.confirm")}}</button>

				<button class="button secondary yellow" @click="$emit('close')">{{$t('pop-up.cancel')}}</button>
			</div>
		</div>
	</div>
</template>
