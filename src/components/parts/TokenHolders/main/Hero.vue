<script>
	import Emoji from './Emoji.vue'

	export default {
		data(){ return {
			type: 1
		}},
		components:{
			Emoji
		}
	}
</script>


<template>
	<div class="hero-content--connect th">
		<div class="hero-content-box">
			<div class="hero-title" v-html="$t(`token-holders.s-hero.title`)"></div>

			<!-- background: linear-gradient(180deg, rgb(24 48 92 / .5), rgb(24 93 141 / 0.5)) -->
			
			<div class="hero-text" v-html="$t(`token-holders.s-hero.text`)"></div>
			<div class="hero-links">
				<a class="hero-link" href=" https://hegic.gitbook.io/start" target="_blank">{{$t(`hero-links[0]`)}}</a>
				<!-- <a class="hero-link" href="https://bramah.systems/audits/Hegic_Audit_Bramah.pdf" target="_blank">Security Audit Report</a> -->
			</div>
			<div class="cryo icon-hegic"></div>


		</div>
	</div>
</template>
