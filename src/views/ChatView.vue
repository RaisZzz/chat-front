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
export default {
  components: {
    ChatMain,
    ChatHeader,
    ChatSidebar
  },
  async mounted() {
    const response = await this.$store.dispatch('auth')
    if (response === 401) {
      this.$router.push('/login', {replace: true})
    }
    if (response.data.token) {
      await this.$store.dispatch('getData')
      this.sockets.subscribe('message', (data) => {
        this.$store.dispatch('message', data)
      });
      this.sockets.subscribe('chat', (data) => {
        this.$store.dispatch('startChatSocket', data)
      });
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
