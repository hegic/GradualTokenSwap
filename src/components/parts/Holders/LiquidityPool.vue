<script>
	import {ElPagination} from 'element-plus'

	const Pagination = ElPagination
	// import 'element-plus/lib/theme-chalk/index.css'

	import MySelect from '../Select.vue'
	import Web3 from 'web3'
	const toBN = Web3.utils.toBN

	export default {
		props:['options'],
		data(){return{
			isWBTCOption: true,

			pageSize: 10,
			currentPage: 1,
		}},
		computed:{
			decimals(){
				return this.isWBTCOption ? 8 : 18
			},
			currency(){return this.isWBTCOption ? 'WBTC' : 'ETH'},
			available(){
				const type = this.isWBTCOption ? 'WBTC' : 'ETH'
				return this.$store.state.pools[type].availableBalance || toBN(0)
			},
			amount(){
				const type = this.isWBTCOption ? 'WBTC' : 'ETH'
				return this.$store.state.pools[type].totalAmount || toBN(0)
			},
			locked(){
				const type = this.isWBTCOption ? 'WBTC' : 'ETH'
				return this.$store.state.pools[type].locked || toBN(0)
			},
			activeOptions(){
				return this.options
					.filter(x => x.state == 0 && (x.currency == 'WBTC') == this.isWBTCOption )
					.sort((x,y) => x.expiration - y.expiration)
			},
			uRate(){
				return this.amount.isZero() ? 0 : this.locked.mul(toBN('10000')).div(this.amount) / 100
			},

			currentViewOptions(){
				const startIndex = this.pageSize * (this.currentPage-1)
				const lastIndex =
					(this.pageSize * (this.currentPage-1) + this.pageSize)<=this.activeOptions.length?
						this.pageSize * (this.currentPage-1) + this.pageSize :
						this.activeOptions.length
				return this.activeOptions.slice(startIndex, lastIndex)

			}
		},
		methods:{
			handelCurrentChange(val){
				this.currentPage = val
				// const el = document.getElementById("start-unlocked-liquidity")
				// el.scrollIntoView({
				// 	behavior:'smooth',
				// 	block:'start'
				// })

			}
		},
		components:{
			ElPagination:Pagination
		}
	}
</script>
<template>
	<div class="section dai-pool">
		<div class="category-title">{{$t("holders.s-liquidity-pool.title")}}</div>
		<div class="radio">
			<div class="radio__value" :class="{select: isWBTCOption}" @click="isWBTCOption = true">
				<div class="radio__text">WBTC</div>
			</div>
			<div class="radio__value" :class="{select: !isWBTCOption}" @click="isWBTCOption = false">
				<div class="radio__text">ETH</div>
			</div>
		</div>

		<div class="dai-pool-box">
			<div class="dai-pool-box__vals">
				<div class="dai-pool-box__availible">
					<div class="text">{{$t("holders.s-liquidity-pool.pool-utilization-rate")}}:</div>
					<div class="dai-pool-box__val">{{uRate}}%</div>
				</div>

				<div class="dai-pool-box__percent mobile">
					<div class="d-p-b-percent__val" :style="{width:uRate+'%'}"></div>
				</div>

				<div class="dai-pool-box__rate">
					<div class="text">{{$t("holders.s-liquidity-pool.available-liquidity")}}:</div>
					<div class="dai-pool-box__val">
						<span>{{available.format(decimals, 3)}} {{currency}}
						</span>/ {{amount.format(decimals, 3)}} {{currency}}</div>
				</div>
			</div>
			<div class="dai-pool-box__percent big">
				<div class="d-p-b-percent__val" :style="{width:uRate+'%'}"></div>
			</div>
		</div>

		<div class="dai-pool-box" v-if="false">
			<div class="dai-pool-box__vals">
				<div class="dai-pool-box__availible">
					<div class="text">{{$t("holders.s-liquidity-pool.pool-utilization-rate")}}:</div>
					<div class="dai-pool-box__val">{{uRate}}%</div>
				</div>

				<div class="dai-pool-box__percent mobile">
					<div class="d-p-b-percent__val" :style="{width:uRate+'%'}"></div>
				</div>

				<div class="dai-pool-box__rate">
					<div class="text">{{$t("holders.s-liquidity-pool.available-liquidity")}}:</div>
					<div class="dai-pool-box__val"><span>{{available.format(18,3)}} ETH </span>/ {{amount.format(18,3)}} ETH</div>
				</div>
			</div>
			<div class="dai-pool-box__percent big">
				<div class="d-p-b-percent__val" :style="{width:available *100 / amount+'%'}"></div>
			</div>
		</div>

		<!-- <div class="text exp" v-html="$t(`holders.s-liquidity-pool.unlocked-liquidity-expiration`)"></div>

		<div class="dai-pool__table" id="start-unlocked-liquidity">
			<table class="table-options">
				<tr class="table-options__header">
					<th>{{$t("table.type")}}</th>
					<th>{{$t("table.id")}}</th>
					<th>{{$t("table.expires-in")}}</th>
					<th>{{$t("table.amount")}}</th>
					<th>{{$t("table.will-be-unlocked")}}</th>
				</tr>
				<tr v-if="activeOptions.length == 0" class="table-options__tr-vals">
					<td class="null" colspan="5">{{$t("pool.no-active-options")}}</td>
				</tr>
				<tr
					v-for="option in currentViewOptions"
					class="table-options__tr-vals">
					<td>{{option.type}}</td>
					<td>{{option.id}}</td>
					<td>{{option.expiresIn}}</td>
					<td>{{option.amount.format(option.decimals, 2)}} {{option.currency}}</td>
					<td>{{option.lockedAmount.format(option.decimals, 2)}} {{option.currency}}</td>
				</tr>
			</table>
		</div>

		<el-pagination
			class="pagination-box hide-on-computer"
			small
			:hide-on-single-page="true"
			background
			@current-change="handelCurrentChange"
			layout="prev, pager, next"
			:page-size="pageSize"
	        :pager-count="5"
			:total="activeOptions.length"></el-pagination>


		<el-pagination
			class="pagination-box hide-on-phone"
			:hide-on-single-page="true"
			background
			@current-change="handelCurrentChange"
			layout="prev, pager, next"
			:page-size="pageSize"
	        :pager-count="7"
			:total="activeOptions.length"></el-pagination> -->

	</div>
</template>
