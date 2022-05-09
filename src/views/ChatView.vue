<template>
  <div class="wrapper">
    <ChatSidebar />
    <div class="wrapper-col">
      <ChatHeader />
      <ChatMain />
    </div>
  </div>
</template>

<script>
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMain from "@/components/ChatMain";
import { io } from "socket.io-client";
export default {
  components: {
    ChatMain,
    ChatHeader,
    ChatSidebar
  },
  async mounted() {
    const vueThis = this
    const socket = io(`ws://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_SOCKET_PORT}`, {
      autoConnect: false
    })
    socket.connect()
    socket.on('connect', async function() {
      const response = await vueThis.$store.dispatch('auth')
      if (response === 401) {
        vueThis.$router.push({path: '/login'})
      }
      if (response.data.token) {
        await vueThis.$store.dispatch('getData')
        socket.on('message', (data) => {
          vueThis.$store.dispatch('message', data)
        });
      }
    })
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
