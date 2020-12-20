<template>
	<div>

		<div class="faq-dropdown" v-for="i in $tm(`faq.questions.WBTC`).length">
			<div class="dropdown__question" onclick="this.classList.toggle('open')">
				<div class="dropdown__question--text" v-html="$t(`faq.questions.WBTC[${i-1}].title`)"></div>
			</div>
			<div class="dropdown__answer">				   
				<div class="dropdown__answer--text" v-html="$t(`faq.questions.WBTC[${i-1}].text`)"></div>
			</div>
		</div>

	</div>
</template>