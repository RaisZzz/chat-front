import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router'
import {i18n} from "@/translate"
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'
const socketConnection = SocketIO('http://95.213.165.3:3000')

const app = createApp(App)


app.use(store)
app.use(router)
app.use(i18n)
app.use(new VueSocketIO({
    debug: false,
    withCredentials: true,
    connection: socketConnection,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))
app.mount('#app')
