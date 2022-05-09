import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import {i18n} from "@/translate"

const app = createApp(App)


app.use(store)
app.use(router)
app.use(i18n)
app.mount('#app')
