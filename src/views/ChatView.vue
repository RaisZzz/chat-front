<template>
  <div class="wrapper" :class="{mobile}">
    <ChatSidebar />
    <div class="wrapper-col">
      <ChatHeader />
      <ChatMain />
    </div>
  </div>
</template>

<script>
import ChatSidebar from "@/components/ChatSidebar"
import ChatHeader from "@/components/ChatHeader"
import ChatMain from "@/components/ChatMain"
import helpers from "@/helpers"
import {io} from "socket.io-client"
export default {
  data: () => {
    return {
      mobile: false
    }
  },
  components: {
    ChatMain,
    ChatHeader,
    ChatSidebar
  },
  async mounted() {
    if (helpers.mobile()) {
      this.mobile = true
    }
    const vueThis = this
    const response = await vueThis.$store.dispatch('auth')
    if (response === 401) {
      vueThis.$router.push({path: '/login'})
    }
    if (response.data.token) {
      this.$store.commit('setSocket', {socket:
            io(`ws://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_SOCKET_PORT}/?userId=${response.data.user.id}`, {
              autoConnect: false
            })
      })
      this.$store.getters['socket'].connect()
      await vueThis.$store.dispatch('getData')
      vueThis.$store.getters['socket'].on('message', (data) => {
        vueThis.$store.dispatch('message', data)
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: stretch;
  height: 100vh;
}
.wrapper-col {
  width: calc(100vw - var(--sidebar-width));
}
</style>
<style>
.mobile .chat__header-fullscreen {
  display: none;
}
.mobile .chat {
  top: 0 !important;
  left: 0 !important;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
}
</style>
