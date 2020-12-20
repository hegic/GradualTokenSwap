<script>
	export default {
		emits:['update:modelValue',],
		props:['modelValue',],
		mounted(){
			this.$emit('update:modelValue', this.vals[0])
		},
		data(){ return {
			open: false,
			vals: [
				{val: 1*24*3600,	text: '1 day'},
				{val: 7*24*3600,	text: '1 week (7 days)'},
				{val: 14*24*3600,	text: '2 weeks (14 days)'},
				{val: 21*24*3600,	text: '3 weeks (21 days)'},
				{val: 28*24*3600,	text: '4 weeks (28 days)'}
			]
		}},
	}
</script>

<template lang="pug">
.my-select(@click='open = !open' :class='{open}')
	.my-select__selected
		.my-select-val__text {{modelValue ? modelValue.text : ''}}
			.my-select__vals(v-if='open')
				.my-select__val(v-for='val in vals' @click='$emit(`update:modelValue`, val)')
					.my-select-val__text  {{val.text}}
//- $t("select-period.day", 2, {count: 2}) }
//- $tc("select-period.week", 1, {count: 1}) + $tc("select-period.day", 7, {count: 7})}
//- $tc("select-period.week", 2, {count: 2}) + $tc("select-period.day", 14, {count: 14})}
//- $tc("select-period.week", 3, {count: 3}) + $tc("select-period.day", 21, {count: 21})}
//- $tc("select-period.week", 4, {count: 4}) + $tc("select-period.day", 28, {count: 28})}

</template>
