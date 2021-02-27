import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import Clipboard from 'v-clipboard'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const vco = require('v-click-outside')

import vuetify from './plugins/vuetify'
import './styles/font.sass'
import './styles/common.sass'

Vue.use(vco)
Vue.use(Clipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
