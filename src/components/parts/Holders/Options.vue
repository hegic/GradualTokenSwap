<script>
	export default {
		emits:['option-exercise'],
		data(){return{
			showActiveOptions: true
		}},
		computed:{
			options(){
				const account = this.$store.state.accounts[0]
				return this.$store.getters.options
					.filter(x => x.holder == account)
					.sort((x, y) => x.placed - y.placed)
			},
			activeOptions(){
				return this.options.filter(
					x => x.state == 0 &&
					x.expiration > Date.now()
				)
			},
			archiveOptions(){
				return this.options.filter(
					x => x.state > 0 ||
					x.expiration < Date.now()
				)
			},
		},
		methods:{

			tweetHref(option){
				const text =
`My $${option.currency} ${option.type.toLowerCase()} option on @HegicOptions:

Size: ${option.amount.format(option.decimals,3)} ${option.currency}
Strike: $${option.strike.format(8,2)}
Position P&L: ${option.pl.isNeg?'-':'+'}$${option.pl.USD} (${option.pl.isNeg ?'':'+'}${option.pl.X}%)

I will earn profits if the price of ETH will be ${option.type == 'PUT' ? 'lower': 'higher'} than $${option.breakeven.format(8,2)} in the next ${option.expiresIn}. Wish me luck and join me on https://www.hegic.co
`
				return `https://twitter.com/compose/tweet?${new URLSearchParams({text})}`
			},
		}

	}
</script>

<template>
	<div class="section your-option">
		<div class="category-title">{{$t("holders.s-options.title")}}</div>
		<div class="radio">
			<div class="radio__value" :class="{select: showActiveOptions}" @click="showActiveOptions = true">
				<div class="radio__text">{{$t("option.active")}}</div>
			</div>
			<div class="radio__value" :class="{select: !showActiveOptions}" @click="showActiveOptions = false">
				<div class="radio__text">{{$t("option.history")}}</div>
			</div>
		</div>

		<div class="your-option__table">
			<table class="table-options" v-if="showActiveOptions">
				<tr class="table-options__header">
					<th>{{$t("table.type")}}</th>
					<th>{{$t("table.size")}}</th>
					<th>{{$t("table.strike-price")}}</th>
					<th>{{$t("table.price-now")}}</th>
					<th>{{$t("table.break-even")}}</th>
					<th>{{$t("table.p-and-l")}}</th>
					<th>{{$t("table.placed-at")}}</th>
					<th>{{$t("table.expires-at")}}</th>
					<th>{{$t("table.expires-in")}}</th>
					<th>{{$t("table.exercise")}}</th>
					<th>{{$t("table.share")}}</th>
				</tr>
				<tr v-if="!$store.state.optionsLoaded" class="table-options__tr-vals">
					<td class="null" colspan="11">{{$t("user.loading")}}</td>
				</tr>
				<tr v-if="$store.state.optionsLoaded && activeOptions.length == 0" class="table-options__tr-vals">
					<td class="null" colspan="11">{{$t("user.no-active-options")}}</td>
				</tr>
				<tr v-for="option in activeOptions" class="table-options__tr-vals">
					<td>{{option.type}}</td>
					<td>
						<div class="tr-vals__text big">{{option.amount.format(option.decimals,3)}} {{option.currency}}</div>
						<div class="tr-vals__text additional">≈ ${{option.USDAmount.format(option.decimals + 8,2)}}</div>
					</td>
					<td>${{option.strike.format(8,2)}}</td>
					<td>
						<div class="tr-vals__text" :class="{good: option.good, bad: !option.good}">${{$store.state.prices[option.currency].format(8,2)}}</div>
					</td>
					<td>${{option.breakeven.format(8,2)}}</td>
					<td>

						<div class="tr-vals__text big">{{option.good?'+':'-'}}${{option.pl.USD}}</div>
						<div class="tr-vals__text" :class="{good: option.good, bad: !option.good}">{{option.good?'+':''}}{{option.pl.X}}%</div>
					</td>
					<td>{{option.placed}}</td>
					<td>{{option.expiration}}</td>
					<td>{{option.expiresIn.days}}d {{option.expiresIn.hours}}h</td>
					<td> <button @click="$emit('option-exercise', option)" class="swap" :disabled="!option.exercisable">{{$t("option.exercise")}}</button> </td>
					<td> <a :href="tweetHref(option)" target="_blank" class="tweet">{{$t("table.tweet")}}</a> </td>
				</tr>
			</table>

			<table class="table-options" v-else>
				<tr class="table-options__header">
					<th>{{$t("table.type")}}</th>
					<th>{{$t("table.size")}}</th>
					<!--th>ETH Price Change</th-->
					<th>{{$t("table.strike-price")}}</th>
					<th>{{$t("table.placed-at")}}</th>
					<th>{{$t("table.expired-at")}}</th>
					<th>{{$t("table.p-and-l-realized")}}</th>
					<th>{{$t("table.status")}}</th>
					<!--th>Share</th-->
				</tr>
				<tr v-if="archiveOptions.length == 0" class="table-options__tr-vals">
					<td class="null" colspan="7">{{$t("user.no-closed-options")}}</td>
				</tr>
				<tr v-for="option in archiveOptions" class="table-options__tr-vals">
					<td>{{option.type}}</td>
					<td>
						<div class="tr-vals__text big">{{option.amount.format(option.decimals,3)}} {{option.currency}}</div>
						<div class="tr-vals__text additional">≈ ${{option.USDAmount.format(option.decimals + 8,2)}}</div>
					</td>
					<!--td>
						<div class="tr-vals__box">
							<div class="tr-vals__text">{{option.priceChange && option.priceChange.from}}</div>
							<div class="tr-vals__text" :class="{good: true, bad: false}">{{option.priceChange && option.priceChange.to}}</div>
						</div>
					</td-->
					<td>{{option.strike.format(8,2)}}</td>
					<td>{{option.placed}}</td>
					<td>{{option.expiration}}</td>
					<td>
						<div class="tr-vals__text big">{{option.pl.USD}}</div>
						<div class="tr-vals__text" :class="{good: true, bad: false}">{{option.pl.X}}%</div>
					</td>
					<td>{{option.state == 1 ? $t("option.exercised") : $t("option.expired")}}</td>
					<!--td> <a class="tweet">TWEET</a> </td-->
				</tr>
			</table>
		</div>
	</div>
</template>
