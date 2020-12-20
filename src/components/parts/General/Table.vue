<script>
	import {ElPagination} from 'element-plus'

	const Pagination = ELPagination
	export default {
		props:['header', 'tr'],
		data(){return{
			isWBTCOption: true,

			pageSize: 10,
			currentPage: 1,
		}},
		computed:{
			currentViewTr(){
				const startIndex = this.pageSize * (this.currentPage-1)
				const lastIndex =
					(this.pageSize * (this.currentPage-1) + this.pageSize)<=this.tr.length?
						this.pageSize * (this.currentPage-1) + this.pageSize :
						this.tr.length
				return this.tr.slice(startIndex, lastIndex)

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
	<div class="dai-pool__table" id="start-unlocked-liquidity">
		<table class="table-options">
			<tr class="table-options__header">
				<th v-for="th in header">{{th}}</th>
			</tr>
			<tr v-if="activeOptions.length == 0" class="table-options__tr-vals">
				<td class="null" colspan="5">{{$t("pool.no-active-options")}}</td>
			</tr>
			<tr
				v-for="trs in currentViewTr"
				class="table-options__tr-vals">
				<td v-for="tr in trs">{{tr}}</td>
			</tr>
		</table>
	</div>
</template>
