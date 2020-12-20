<template lang="pug">
mixin join(title, icon, href)
  a.join(href=href target='_blank')
    .join__icon(class=icon)
    .join__text= title

mixin doc(name, href)
  a.document(href=href target='_blank')
    .document-angles
      .icon-doc
      .document__title
        .text(v-html=`$t('not-connected.s-documents.${name}')`)

.section.docs-and-join
  .docs-and-join__box
    .category-title {{$t(`not-connected.s-documents.title`)}}
    .documents
      +doc('whitepaper', 'https://ipfs.io/ipfs/QmWy8x6vEunH4gD2gWT4Bt4bBwWX2KAEUov46tCLvMRcME')
      +doc('git-book', 'https://hegic.gitbook.io/start')
  .docs-and-join__box
    .category-title {{$t(`not-connected.s-joins.title`)}}
    .joins
      +join('Twitter', 'twitter', 'https://twitter.com/HegicOptions')
      +join('Telegram', 'telegram', 'https://t.me/HegicOptions')
      +join('Discord', 'discord', 'https://discordapp.com/invite/znjdj8q')
      +join('GitHub', 'git-hub', 'https://github.com/hegic')
      +join('Medium', 'medium', 'https://medium.com/hegic')
      +join('DeFi Pulse', 'defipulse', 'https://defipulse.com/hegic')
</template>
