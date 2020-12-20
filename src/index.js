import {createApp} from 'vue'
import Index from './components/index.vue'
import i18n from './i18n'
import store from './store/index.js'

const newDiv = document.createElement("div");
document.body.append(newDiv)

createApp(Index)
  .use(i18n)
  .use(store)
  .mount(newDiv)
