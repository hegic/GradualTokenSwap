<template lang="pug">
.section.new-user-case
  .category-title {{$t('not-connected.s-user-case.title')}}
  .n-u-c-box
    .n-u-c-box__elem
      .n-u-c-box__icon.holders
      .n-u-c-elem__title {{$t('not-connected.s-user-case.holders.title')}}
      .text {{$t('not-connected.s-user-case.holders.text')}}
    .n-u-c-box__elem
      .n-u-c-box__icon.traders
      .n-u-c-elem__title {{$t('not-connected.s-user-case.traders.title')}}
      .text {{$t('not-connected.s-user-case.traders.text')}}
  .n-u-c-box
    .n-u-c-box__elem
      .n-u-c-box__icon.miners
      .n-u-c-elem__title {{$t('not-connected.s-user-case.miners.title')}}
      .text {{$t('not-connected.s-user-case.miners.text')}}
    .n-u-c-box__elem
      .n-u-c-box__icon.onboarding-holders
      .n-u-c-elem__title {{$t('not-connected.s-user-case.onboarding-holders.title')}}
      .text {{$t('not-connected.s-user-case.onboarding-holders.text')}}
</template>
