<template>
	<div class="section">
		<!-- <div class="category-title">{{$t('token-holders-ibco.s-texts.title')}}</div> -->

		<div style="margin-top: 40px;"></div>
		<div class="notification exclamation"><div class="notification__text">{{$t(`token-holders-ibco.s-texts.disclaimer`)}}</div></div>
		<div style="margin-top: 45px;"></div>

		<div class="faq-dropdown" v-for="i in $t(`token-holders-ibco.s-texts.texts`)">
			<div class="dropdown__question" onclick="this.classList.toggle('open')">
				<div class="dropdown__question--text" v-html="i.title"></div>
			</div>
			<div class="dropdown__answer">
				<div class="dropdown__answer--text" v-html="i.content"></div>
			</div>
		</div>



	</div>
</template>
