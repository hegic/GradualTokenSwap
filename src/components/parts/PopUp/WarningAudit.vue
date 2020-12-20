<script>
	export default {
		emits:['close'],
		data(){return {
			stopShowing: false,
			warningID: 1
		}},
		methods:{
			OK(){
				if(this.warningID == 1) this.warningID++
				else {
					this.$emit('close')
					if(this.stopShowing)
					window.localStorage.setItem("notShowAlert", true)
				}
			}
		}
	}
</script>
<template>
	<div class="pop-up" @click="OK">
		<div class="pop-up__box"  @click.stop>
			<div class="pop-up__close" @click="OK"></div>
			<div class="form__header error">{{$t("pop-up.p-warning.title")}} {{warningID}}/2</div>

			<div class="pop-up__img error"></div>

			<div class="text" v-if="warningID == 1">

				{{$t("pop-up.p-warning.w1.text[0]")}}

				<a target="_blank" class="hero-link"
					href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Hegic-v1.0.pdf">
					{{$t("pop-up.p-warning.w1.text[1]")}}
				</a>

				{{$t("pop-up.p-warning.w1.text[2]")}}

			</div>

			<div class="text" v-else-if="warningID == 2">
				{{$t("pop-up.p-warning.w2.text")}}
			</div>
			<div class="text">
				<label class="hover">
					<input type="checkbox" v-model="stopShowing">
					{{$t("pop-up.p-warning.not-show-again")}}
				</label>
			</div>

			<div class="pop-up__buttons">
				<button class="button secondary yellow" @click="OK">{{$t("pop-up.p-warning.ok")}}</button>
			</div>
		</div>
	</div>
</template>
