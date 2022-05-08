<template>
  <button
      class="sidebar-item"
      :class="{ active : active }"
      @click="openChat"
  >
    <UserAvatar :username="chat.title" :useravatar="chat.userAvatar" :size="30"/>
    <span class="sidebar-item__name">{{chat.title}}</span>
  </button>
</template>

<script>
import UserAvatar from "@/components/UserAvatar";
export default {
  components: {
    UserAvatar
  },
  data: () => {
    return {
      disabled: false
    }
  },
  methods: {
    openChat() {
      if (this.active) {
        this.$store.commit('closeChat', {index: this.index})
      } else {
        this.$store.commit('openChat', {chat: {[this.index]: this.chat}})
      }
    }
  },
  computed: {
    active() {
      for(const index of Object.keys(this.$store.getters['openedChats'])) {
        if (index === this.index) {
          return true
        }
      }
      return false
    }
  },
  props: ['chat', 'index']
}
</script>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 15px;
  border-bottom: 1px solid #EBEBFF;
  transition: var(--main-trans);
}
.sidebar-item__name {
  color: var(--secondary-color);
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  transition: var(--main-trans);
}
.sidebar-item:hover {
  opacity: 0.7;
}
.sidebar-item.active {
  background-color: var(--primary-color);
}
.sidebar-item.active .sidebar-item__name {
  color: #fff;
}
</style>
