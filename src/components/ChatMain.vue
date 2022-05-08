<template>
  <div class="main">
    <p class="main-attention" v-if="!Object.values(chats).length">{{ $t('selectUser') }}</p>
    <TransitionGroup name="chats" tag="div">
      <ChatItem
          v-for="(chat, index) in chats"
          :key="index"
          :index="index"
          :chat="chat"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import ChatItem from "@/components/ChatItem";
export default {
  components: {ChatItem},
  data: () => {
    return {
      chats: []
    }
  },
  mounted() {
    this.chats = this.$store.getters['openedChats']
  },
  beforeUnmount() {
    this.sockets.unsubscribe('message')
    this.sockets.unsubscribe('chat')
  }
}
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: calc(100% - var(--header-height));
  overflow-x: auto;
  position: relative;
  z-index: 1;
}
.main-attention {
  text-align: center;
  color: var(--secondary-color);
  font-size: 16px;
  font-weight: 400;
}
.chats-enter-active,
.chats-leave-active {
  transition: all var(--main-trans) ease;
}
.chats-enter-from,
.chats-leave-to {
  transform: translateX(-100vw);
}
</style>
