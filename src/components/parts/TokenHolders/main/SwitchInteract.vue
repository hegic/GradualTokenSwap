<script>
	export default {
		emits:['changeinteract'],
		props:["interact"],
		data(){ return {
			open: false
		}},
	}
</script>
<template>
	<div class="section">
		<div class="category-title">{{$t("token-holders.s-switch-interact.title")}}</div>

		<div class="switch-interact switch-pool documents show-on-phone--min">

			<div class="my-select" @click="open = !open" :class="{open}">
				<div class="my-select__selected">
					<div class="my-select-val__text" v-html="$t(`token-holders.s-switch-interact.interact[${interact}]`)">
					</div>
				</div>
				<div class="my-select__vals" v-if="open">
					<div class="my-select__val"
						v-for="i in $tm(`token-holders.s-switch-interact.interact`).length"
						@click="$emit('changeinteract', i-1)">
						<div class="my-select-val__text" v-html="$t(`token-holders.s-switch-interact.interact[${i-1}]`)"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="switch-interact switch-pool documents hide-on-phone--min">

			<div class="document" :class="{unselected: interact!=0}" @click="$emit('changeinteract', 0)">
				<div class="document-angles">
					<div class="document__title">
						<div class="text">
							<div class="switch-pool__header" v-html="$t(`token-holders.s-switch-interact.interact[0]`)"></div>
						</div>
					</div>

				</div>
			</div>

			<div class="document" :class="{unselected: interact!=1}" @click="$emit('changeinteract', 1)">
				<div class="document-angles">
					<div class="document__title">
						<div class="text">
							<div class="switch-pool__header" v-html="$t(`token-holders.s-switch-interact.interact[1]`)"></div>
						</div>
					</div>

				</div>
			</div>

			<div class="document" :class="{unselected: interact!=2}" @click="$emit('changeinteract', 2)">
				<div class="document-angles">
					<div class="document__title">
						<div class="text">
							<div class="switch-pool__header" v-html="$t(`token-holders.s-switch-interact.interact[2]`)"></div>
						</div>
					</div>

				</div>
			</div>

			<div class="document" :class="{unselected: interact!=3}" @click="$emit('changeinteract', 3)">
				<div class="document-angles">
					<div class="document__title">
						<div class="text">
							<div class="switch-pool__header" v-html="$t(`token-holders.s-switch-interact.interact[3]`)"></div>
						</div>
					</div>

				</div>
			</div>

			<div class="document" :class="{unselected: interact!=4}" @click="$emit('changeinteract', 4)">
				<div class="document-angles">
					<div class="document__title">
						<div class="text">
							<div class="switch-pool__header" v-html="$t(`token-holders.s-switch-interact.interact[4]`)"></div>
						</div>
					</div>

				</div>
			</div>

			<div class="document" :class="{unselected: interact!=5}" @click="$emit('changeinteract', 5)">
				<div class="document-angles">
					<div class="document__title">
						<div class="text">
							<div class="switch-pool__header" v-html="$t(`token-holders.s-switch-interact.interact[5]`)"></div>
						</div>
					</div>

				</div>
			</div>
		</div>

	</div>
</template>
