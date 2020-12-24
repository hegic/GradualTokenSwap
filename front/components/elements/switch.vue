<script>
	import {utils} from 'web3'
	import {toBN} from 'utils/BN'
	const {toWei} = utils
	export default {
		emits:['update:modelValue', 'close'],
		props:['modelValue', 'domain'],
		methods:{
		}
	}
</script>

<template lang="pug">
.radio
	.radio__value(v-for="v in domain"  :class='{select: modelValue == v}' @click="$emit('update:modelValue', v)")
		.radio__text {{$t(v)}}
</template>
