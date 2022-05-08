<template>
  <div class="sidebar">
    <p class="sidebar__logo">{{ title }}</p>
    <p v-if="!Object.keys(chats).length" class="sidebar__null">{{ $t('chat.null') }}</p>
    <div class="sidebar__chats">
      <SidebarItem
          v-for="(chat, index) in chats"
          :key="index"
          :index="index"
          :chat="chat"
      />
    </div>
  </div>
</template>

<script>
import SidebarItem from "@/components/SidebarItem";
export default {
  components: {SidebarItem},
  computed: {
    title() {
      return process.env.VUE_APP_TITLE
    },
    chats() {
      return this.$store.getters['chats']
    }
  }
}
</script>

<style scoped>
.sidebar {
  min-width: var(--sidebar-width);
  width: var(--sidebar-width);
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 3px 0 20px 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
}
.sidebar__logo {
  text-align: center;
  height: var(--header-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: 900;
  font-size: 28px;
  text-transform: uppercase;
  border-bottom: 1px solid #EBEBFF;
}
.sidebar__null {
  text-align: center;
  margin-top: 20px;
}
.sidebar__chats {
  max-height: 100%;
  overflow-y: auto;
}
</style>
