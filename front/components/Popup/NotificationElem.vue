<script>
	export default { props:['notification'] }
</script>
<template>
	<div class="notification-elem">
		<div class="pop-up__close" @click="notification.close()"></div>
		<div class="notification__title" v-text="notification.title"></div>
		<div class="notification__text" v-html="notification.text"></div>
		<div class="notification__text" v-if="notification.tx">
			<a target="_blank" class="hero-link"
				v-text="notification.tx"
				:href="`//etherscan.io/tx/${notification.tx}`"
				></a>
		</div>
		<div class="notification__text" v-if="notification.link">
			<a target="_blank" class="hero-link"
				v-text="notification.link.text"
				:href="notification.link.address"
				></a>
		</div>
	</div>
</template>
