import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"
import router from './router'
import store from "./store"
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue() // Global event bus

new Vue({
    store,
    vuetify,
    router,
    render: h => h(App)
}).$mount("#app")
