<template>
  <div class="sidebar">
    <p class="sidebar__logo">{{ title }}</p>
    <MainLoader v-if="loading" />
    <input v-if="!loading && Object.keys(initialChats).length" type="text" class="sidebar__search" @input="userSearch" v-model="search" :placeholder="$t('sidebar.search')">
    <p v-if="!Object.keys(initialChats).length && !loading" class="sidebar__null">{{ $t('chat.null') }}</p>
    <div class="sidebar__chats">
      <SidebarItem
          v-for="(chat, index) in initialChats"
          :key="index"
          :index="index"
          :chat="chat"
      />
    </div>
  </div>
</template>

<script>
import SidebarItem from "@/components/SidebarItem";
import MainLoader from "@/components/loaders/MainLoader";
export default {
  data: () => {
    return {
      search: '',
      initialChats: {}
    }
  },
  components: {MainLoader, SidebarItem},
  methods: {
    userSearch() {
      this.initialChats = {...this.chats}
      for(const key of Object.keys(this.initialChats)) {
        if (this.initialChats[key].title.search(this.search) <= -1) {
          delete this.initialChats[key]
        }
      }
    }
  },
  mounted() {
    this.initialChats = this.chats
  },
  computed: {
    title() {
      return process.env.VUE_APP_TITLE
    },
    chats() {
      return this.$store.getters['chats']
    },
    loading() {
      return this.$store.getters['chatsLoading']
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
  overflow: hidden;
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
  position: relative;
  z-index: 3;
  background-color: #fff;
}
.sidebar__search {
  outline: none;
  border: none;
  padding: 15px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 7px 20px 1px rgb(0 0 0 / 10%);
  position: relative;
  transition: var(--main-trans);
  border-bottom: 2px solid rgba(0,0,0,0);
}
.sidebar__search:focus {
  border-color: var(--primary-color);
}
.sidebar__null {
  text-align: center;
  margin-top: 20px;
}
.sidebar__chats {
  max-height: 100%;
  overflow-y: auto;
  flex: 1;
}

@media screen and (max-width: 800px) {
  .sidebar__logo {
    font-size: 20px;
  }
}
@media screen and (max-width: 450px) {
  .sidebar__logo {
    font-size: 16px;
  }
}
</style>
