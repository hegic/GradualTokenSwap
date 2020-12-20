<template lang="pug">
.section.use-case
  .category-title {{$t(`not-connected.s-use-case.title`)}}
  .use-cases-box
    .use-case-box.holders
      .use-case__header {{$t(`not-connected.s-use-case.holders.holders`)}}
      .use-case__title {{$t(`not-connected.s-use-case.holders.title`)}}
      .use-case__text {{$t(`not-connected.s-use-case.holders.text`)}}
    .use-case-box.writers
      .use-case__header {{$t(`not-connected.s-use-case.writers.writers`)}}
      .use-case__title {{$t(`not-connected.s-use-case.writers.title`)}}
      .use-case__text {{$t(`not-connected.s-use-case.writers.text`)}}
    .use-case-box.token-holders
      .use-case__header {{$t(`not-connected.s-use-case.token-holders.token-holders`)}}
      .use-case__title {{$t(`not-connected.s-use-case.token-holders.title`)}}
      .use-case__text {{$t(`not-connected.s-use-case.token-holders.text`)}}

</template>
