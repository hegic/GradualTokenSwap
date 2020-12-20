<template>
	<div class="hero-content--connect">
		<div class="hero-content-box">
			<div class="hero-title" v-html="$t(`holders.s-hero.title`)"></div>
			<div class="hero-text" v-html="$t(`holders.s-hero.text`)"></div>
			<div class="hero-links">
				<a class="hero-link" href=" https://hegic.gitbook.io/start" target="_blank">{{$t(`hero-links[0]`)}}</a>
				<!-- <a class="hero-link" href="https://bramah.systems/audits/Hegic_Audit_Bramah.pdf" target="_blank">Security Audit Report</a> -->
			</div>
			<div class="cryo"></div>
		</div>
	</div>
</template>