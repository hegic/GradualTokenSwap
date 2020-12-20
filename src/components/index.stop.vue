<template lang="pug">
.example(v-for='item in items') {{$t('hello')}}, {{item}}
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  computed:{...mapState(['items'])},
  methods: {...mapActions({more: 'increment'})},
}
</script>

<style lang="stylus" src="styles/index.styl"/>
