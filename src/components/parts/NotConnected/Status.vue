<script>
	export default {
		data(){return{
			// optionsVolume: '315',
			// liqudityTurnover: '41944',
			// premiumsWriters: '+1538',
		}},
		methods:{
			optionsVolume(selectedPool){
				if (selectedPool == 'ETH'){
					return '671.79 ETH'
				} else
				if (selectedPool == 'DAI'){
					return '597.32 ETH'
				}
			},
			liqudityTurnover(selectedPool){
				if (selectedPool == 'ETH'){
					return '671.79 ETH'
				} else
				if (selectedPool == 'DAI'){
					return '213,926 DAI'
				}
			},
			premiumsWriters(selectedPool){
				if (selectedPool == 'ETH'){
					return '+38.93 ETH'
				} else
				if (selectedPool == 'DAI'){
					return '+5,909.87 DAI'
				}
			},
		}
	}
</script>

<template lang="pug">
.section.status.common(v-if='false')
  .category-title {{$t(`not-connected.s-status.title`)}}
  .statuses-box.head
    .status-box.pool
      .status__title {{$t(`pool.pool`)}}
      .status__value
    .status-box.volume
      .status__title(v-html='$t(`not-connected.s-status.text-1`)')
    .status-box.turnover
      .status__title(v-html='$t(`not-connected.s-status.text-2`)')
    .status-box.premiums
      .status__title(v-html='$t(`not-connected.s-status.text-3`)')
  .statuses-box.body
    .status-box.pool
      .status__title {{$t(`pool.pool`)}}
      .status__value ETH
    .status-box.volume
      .status__title(v-html='$t(`not-connected.s-status.text-1`)')
      .status__value {{optionsVolume('ETH')}}
    .status-box.turnover
      .status__title(v-html='$t(`not-connected.s-status.text-2`)')
      .status__value {{liqudityTurnover('ETH')}}
    .status-box.premiums
      .status__title(v-html='$t(`not-connected.s-status.text-3`)')
      .status__value {{premiumsWriters('ETH')}}
  .statuses-box.body
    .status-box.pool
      .status__title {{$t(`pool.pool`)}}
      .status__value DAI
    .status-box.volume
      .status__title(v-html='$t(`not-connected.s-status.text-1`)')
      .status__value {{optionsVolume('DAI')}}
    .status-box.turnover
      .status__title(v-html='$t(`not-connected.s-status.text-2`)')
      .status__value {{liqudityTurnover('DAI')}}
    .status-box.premiums
      .status__title(v-html='$t(`not-connected.s-status.text-3`)')
      .status__value {{premiumsWriters('DAI')}}

</template>
