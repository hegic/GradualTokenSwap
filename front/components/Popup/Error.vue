<script>
	export default {
		emits: [ 'update:modelValue' ],
		props: {
			modelValue: String,
			title: { type:String, default: 'pop-up.p-error.title' }
		}
	}
</script>
<template lang="pug">
.pop-up(v-if='modelValue' @click="$emit('update:modelValue', null)")
  .pop-up__box(@click.stop)
    .pop-up__close(@click="$emit('update:modelValue', null)")
    .form__header.error {{$t(title)}}
    .pop-up__img.error
    .text.big {{$t(modelValue)}}
    .pop-up__buttons
      button.button.secondary.yellow(@click="$emit('update:modelValue', null)") {{$t('pop-up.cancel')}}
</template>
