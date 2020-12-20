<script>
	function interval(x){
		var tmp = x
		const ms = parseInt(tmp % 1000)
		tmp /= 1000
		const s = parseInt(tmp % 60)
		tmp /= 60
		const min = parseInt(tmp % 60)
		tmp /= 60
		const h = parseInt(tmp % 24)
		tmp /= 24
		const d = parseInt(tmp)
		return `${d}D ${h}H ${min}M ${s}S`
	}

	export default {
		data() { return {
			leftForStart: null,
			leftForEnd: null,
			timer: null,
		}},
		mounted() { this.startTimer() },
		destroyed() { this.stopTimer() },
		methods: {
			startTimer() {
				this.timer = setInterval(() => {
					if(!this.IOParams) return;
					const leftForStart = this.IOParams.START - new Date()
					const leftForEnd = this.IOParams.END - new Date()
					this.leftForStart = leftForStart > 0 ? interval(leftForStart) : null
					this.leftForEnd = leftForEnd > 0 ? interval(leftForEnd) : null
				}, 1000)
			},
			stopTimer() { clearTimeout(this.timer) },
		},
		watch: {
		currentTime(time) {
		  if (time === 0) {
		    this.stopTimer()
		  }
		}
		},
		computed:{
			IOParams(){
				return this.$store.state.IOParams
			},
		}
	}
</script>
<template>
	<div class="section">
		<div class="category-title">IO TEST</div>
		<div v-if="IOParams">
			startsIn : {{leftForStart}}
			<br>
			endsIn : {{leftForEnd}}
		</div>
		<div v-else>
			Loading
		</div>

	</div>
</template>
