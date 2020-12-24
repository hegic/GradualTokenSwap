<script>
	import {utils} from 'web3'
	import {toBN} from 'utils/BN'
	const {toWei} = utils
	export default {
		emits:['update:modelValue', 'close'],
		props:['modelValue', 'digits', 'fallback'],
		computed:{
			rgx(){
				const d = parseInt(this.digits) || 18
				return new RegExp(`^\\d*\\.?\\d{0,${d}}$`)
			},
			value:{
				get(){
					if(!this.modelValue) return ''
					const d = parseInt(this.digits) || 18
					const r = this.modelValue.toString()
					const rr = r.length < d ? this.modelValue.toString(10,d) : r
					const s = x => {
						let f = false
						return x.split('').reverse().filter(x => {
							if(f) return true
							if(x == '0') return false
							f=true
							return true
						}).reverse().join('')
					}
					const f = s(rr.substring(rr.length - d))
					return rr.substring(0, rr.length - d) + (f ? '.' + f : '')
				},
				set(val){
					const value = val == '' ? null: toBN(toWei(val))
					if((this.modelValue != null ^ value != null) ||
					this.modelValue != null && value != null && !value.eq(this.modelValue))
						this.$emit('update:modelValue', value)
				}
			}
		},
		methods:{
			check(e){
				if(!this.rgx.test(e.target.value + e.key)) e.preventDefault()
			}
		}
	}
</script>

<template lang="pug">
input(v-model='value' @keypress='check')
</template>
