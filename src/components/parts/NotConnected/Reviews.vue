<template lang="pug">
.section.reviews
  .category-title {{$t(`not-connected.s-reviews.title`)}}
  .reviews-box
    .review-box
      .review__text: p {{$t(`not-connected.s-reviews.review-1`)}}
      .review__user.user-1
        .review__user--name DeFi Dad
        a.review__user--link(href='https://twitter.com/defi_dad/status/1244010984903077895' target='_blank')
          | twitter.com/DeFi_Dad
    .review-box
      .review__text: p {{$t(`not-connected.s-reviews.review-2`)}}
      .review__user.user-2
        .review__user--name DegenSpartan
        a.review__user--link(href='https://twitter.com/degenspartan/status/1244089205103329280' target='_blank')
          | twitter.com/DegenSpartan
    .review-box
      .review__text: p {{$t(`not-connected.s-reviews.review-3`)}}
      .review__user.user-3
        .review__user--name ExHuman.eth
        a.review__user--link(href='https://twitter.com/3xhuman/status/1246084590684573696' target='_blank')
          | twitter.com/3xhuman
    .review-box
      .review__text: p {{$t(`not-connected.s-reviews.review-4`)}}
      .review__user.user-4
        .review__user--name Mariano
        a.review__user--link(href='https://twitter.com/Mariandipietra/status/1247108075242369025' target='_blank')
          | twitter.com/Mariandipietra
</template>
