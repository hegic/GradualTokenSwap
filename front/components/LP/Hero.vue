<template lang="pug">
.hero-content
  .hero-content-box
    .hero-title(v-html='$t(`not-connected.s-hero.title`)')
    .hero-text(v-html='$t(`not-connected.s-hero.text`)')
    .hero-content-box
      button.button.primary(@click='$emit(`connect`)' v-text='$t(`connect`)')
      .hero-status
        .hero-status--title {{ $t(`not-connected.s-hero.current-status`) }}:
        .hero-status--value {{ $t(`not-connected.s-hero.current-status-val`) }}
    //- .to-b-text: .to-b-text__text
    //-   | Smart contracts code of the Hegic protocol has been audited by Bramah Systems. #[br]
    //-   a(target='_blanc' href='https://bramah.systems/audits/Hegic_Audit_Bramah.pdf')
    //-     span Read the security audit report →
  .cryo
</template>

<script>
	export default {
		emits:['connect'],
	}
</script>
