<template>
  <transition name="opacity">
    <div class="invite-popup-wrapper" v-if="searchOpened">
      <div class="invite-popup__bg" @click="closeSearch"></div>
      <div class="invite-popup">
        <input class="invite-popup__search" type="text" v-model="search" @input="searchStart" :placeholder="$t('chat.searchPlaceholder')">
        <div class="users" @scroll="usersScroll" ref="users">
          <div class="user" v-for="user in users" :key="user.id">
            <UserAvatar :username="user.username" :avatar="user.avatar" size="30" />
            <div class="user-col">
              <p class="user__name">{{ user.username }} <span class="user__name-owner" v-if="user.id === userId">({{ $t('chat.owner') }})</span></p>
              <p class="user__email">{{ user.email }}</p>
            </div>
            <button class="user__open" @click="openChat(user.id)">{{ $t('chat.start') }}</button>
          </div>
        </div>
        <p v-if="!users.length" class="invite-popup__loading">{{ $t('loading') }}</p>
      </div>
    </div>
  </transition>
  <div class="header">
    <button class="header__invite" @click="openSearch">{{ $t('chat.search') }}</button>
    <div class="header__settings-wrapper">
      <div class="header__info">
        <p class="header__name">{{name}}</p>
        <p class="header__email">{{email}}</p>
      </div>
      <UserAvatar class="header__avatar" :class="{ rotate : settings }" v-if="name" :username="name" :useravatar="avatar" :size="50" @click="openSettings"/>
      <transition name="right">
        <div class="header__settings" v-if="settings">
          <button class="header__settings-button" @click="logout">{{ $t('settings.logout') }}</button>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import UserAvatar from "@/components/UserAvatar";
export default {
  data: () => {
    return {
      settings: false,
      searchOpened: false,
      users: [],
      search: '',
      usersLoading: false,
      usersStop: false
    }
  },
  components: {
    UserAvatar
  },
  methods: {
    openSettings() {
      this.settings = !this.settings
    },
    logout() {
      this.$store.commit('logout')
      this.$router.push('/login', {replace: true})
    },
    async openSearch() {
      this.searchOpened = true
      const response = await this.$store.dispatch('getUsers', {offset: this.users.length, search: this.search})
      this.users = response.data.users
    },
    closeSearch() {
      this.searchOpened = false
      this.usersStop = false
      this.users = []
    },
    async openChat(userId) {
      const response = await this.$store.dispatch('startChat', userId)
      if (response.status === 200) {
        this.searchOpened = false
      }
    },
    async searchStart() {
      this.users = []
      const response = await this.$store.dispatch('getUsers', {offset: this.users.length, search: this.search})
      this.users = response.data.users
    },
    async usersScroll() {
      if (this.usersLoading || this.usersStop) return

      this.usersLoading = true
      if (this.$refs.users.scrollTop > (this.$refs.users.scrollHeight - this.$refs.users.clientHeight)*0.8) {
        const response = await this.$store.dispatch('getUsers', {offset: this.users.length, search: this.search})
        response.data.users.forEach(user => {this.users.push(user)})
        if (!response.data.users.length) {
          this.usersStop = true
        }
      }
      this.usersLoading = false
    }
  },
  computed: {
    name() {
      return this.$store.getters['user'].name
    },
    email() {
      return this.$store.getters['user'].email
    },
    avatar() {
      return this.$store.getters['user'].avatar
    },
    userId() {
      return this.$store.getters['user'].id
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 3px 0 20px 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}
.header__invite {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: var(--primary-color);
  padding: 7px 15px;
  border-radius: 5px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: var(--main-trans);
}
.header__invite:hover {
  opacity: 0.7;
}
.header__settings-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
}
.header__info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.header__name {
  font-weight: bold;
  font-size: 14px;
}
.header__email {
  font-size: 14px;
  opacity: 0.5;
}
.header__avatar {
  cursor: pointer;
  transition: var(--main-trans);
}
.header__avatar.rotate {
  transform: rotate(-90deg);
}
.header__settings {
  position: absolute;
  width: 250px;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 5px;
  overflow: hidden;
}
.header__settings-button {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  transition: var(--main-trans);
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
}
.header__settings-button:hover {
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
}
.right-enter-active,
.right-leave-active {
  transition: all var(--main-trans) ease;
}
.right-enter-from,
.right-leave-to {
  transform: scale(0);
}
.invite-popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.invite-popup__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: -1;
  cursor: pointer;
}
.invite-popup {
  background-color: var(--primary-color-invert);
  max-height: calc(100% - 40px);
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.invite-popup__search {
  position: relative;
  width: 100%;
  margin-bottom: 40px;
  border: solid var(--secondary-color);
  border-width: 0 0 2px 0;
  padding: 10px 0;
  font-size: 14px;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  transition: var(--main-trans);
}
.invite-popup__search:focus {
  border-color: var(--primary-color);
}
.users {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  height: 100%;
  max-height: 400px;
  overflow-y: auto;
}
.user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.user__name {
  text-align: left;
  width: 100%;
  font-size: 16px;
}
.user__name-owner {
  color: var(--primary-color);
  font-size: 14px;
  font-weight: bold;
}
.user__email {
  font-size: 12px;
  opacity: 0.5;
}
.user__open {
  border: none;
  outline: none;
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
  font-family: 'Montserrat', sans-serif;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: var(--main-trans);
  margin-left: auto;
}
.user__open:hover {
  opacity: 0.5;
}
.opacity-enter-active,
.opacity-leave-active {
  transition: all var(--main-trans) ease;
}
.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
.invite-popup__loading {
  text-align: center;
}
</style>
