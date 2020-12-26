Promise.all([
  import('vue').then(x => x.createApp),
  import('./components/index.vue').then(x => x.default),
  import('./i18n').then(x => x.default),
  import('./store/index').then(x => x.default),
]).then(([createApp, Index, i18n, store]) => {
  const newDiv = document.createElement("div");
  document.body.append(newDiv)
  createApp(Index)
    .use(i18n)
    .use(store)
    .mount(newDiv)
})

Date.prototype.toString = function(){
	return this.toLocaleString(undefined,{ year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' })
};
