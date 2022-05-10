<template>
  <div class="chat" :class="{ fullScreen }" :style="position" @click="setActive">
    <MainLoader v-if="loading" class="chat__loader" />
    <div class="chat__header" @mousedown="moveStart" ref="chat">
      <UserAvatar :username="chat.title" :useravatar="chat.userAvatar" :size="20" />
      <p class="chat__header-name">{{chat.title}}</p>
      <div class="chat__header-tools">
        <button class="chat__header-fullscreen">
          <FullscreenIcon @click="fullScreen = !fullScreen" />
        </button>
        <button class="chat__header-close">
          <CloseIcon @click="closeChat"/>
        </button>
      </div>
    </div>
    <div class="chat__messages" ref="chatMessages" @scroll="scrollMessages">
      <p
          v-for="msg in messages"
          :key="msg.id"
          class="chat__message"
          :class="{ owner : userId == msg.userId}"
      >
        {{msg.text}}
        <span class="chat__message-date">{{getDate(msg.createdAt)}}</span>
      </p>
      <p class="chat__messages-null" v-if="!messages.length && !loading">{{ $t('chat.notMessages') }}</p>
    </div>
    <form class="chat__input" @submit.prevent="sendMessage">
      <textarea class="chat__input-textarea" v-model="message" :placeholder="$t('chat.enterMsg')" ref="textarea"></textarea>
      <button class="chat__input-send">
        <SendIcon />
      </button>
    </form>
  </div>
</template>

<script>
import UserAvatar from "@/components/UserAvatar";
import FullscreenIcon from "@/components/icons/FullscreenIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import SendIcon from "@/components/icons/SendIcon";
import MainLoader from "@/components/loaders/MainLoader";
export default {
  components: {
    MainLoader,
    SendIcon,
    CloseIcon,
    FullscreenIcon,
    UserAvatar
  },
  data: () => {
    return {
      messages: [],
      message: '',
      fullScreen: false,
      loading: true,
      stop: false,
      offset: 0
    }
  },
  methods: {
    closeChat() {
      this.$store.commit('closeChat', {index: this.index})
    },
    setActive() {
      this.$store.commit('setCurrentChat', {index: this.index})
    },
    moveStart(event) {
      this.setActive()

      if (this.fullScreen) return
      const position = this.position
      const startX = event.x
      const startY = event.y
      const index = this.index
      const store = this.$store
      document.querySelectorAll('*').forEach(el => {
        el.style.userSelect = 'none'
      })

      const moveListener = function(event) {
        const x = parseInt(position.left.slice(0, -2)) + event.x - startX
        const y = parseInt(position.top.slice(0, -2)) + event.y - startY
        store.commit('setChatPosition', {index, x, y})
      }

      document.body.addEventListener('mousemove', moveListener, false)

      document.body.addEventListener('mouseup', function() {
        document.body.removeEventListener('mousemove', moveListener, false)
        document.querySelectorAll('*').forEach(el => {
          el.style.userSelect = 'initial'
        })
      })
      document.addEventListener('mouseleave', function() {
        document.body.removeEventListener('mousemove', moveListener, false)
        document.querySelectorAll('*').forEach(el => {
          el.style.userSelect = 'initial'
        })
      })
    },
    async sendMessage() {
      if (!this.message.length) return

      await this.$store.dispatch('sendMessage', {chatId: this.chat.id, message: this.message})
      this.message = ''
      this.$refs.textarea.focus()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight
      })
    },
    scrollToBottomSmooth() {
      this.$nextTick(() => {
        this.$refs.chatMessages.scrollTo({
          top: this.$refs.chatMessages.scrollHeight,
          behavior: 'smooth'
        })
      })
    },
    async scrollMessages() {
      if (this.loading || this.stop) return
      if (this.$refs.chatMessages.scrollTop <= (this.$refs.chatMessages.scrollHeight - this.$refs.chatMessages.clientHeight)*0.2) {
        this.loading = true
        this.offset = this.offset + 30
        const response = await this.$store.dispatch('getMessages', {chatId: this.chat.id, offset: this.offset})
        if (!response || !response.data || !response.data.messages || !response.data.messages.length) {
          this.stop = true
          this.loading = false
          return
        }
        response.data.messages.reverse().forEach(msg => {
          this.messages.unshift(msg)
        })
        this.loading = false
      }
    },
    getDate(date) {
      const DATE = new Date(date)
      const CURRENTLY = new Date()
      const currently_day = CURRENTLY.getDate()
      const currently_month = CURRENTLY.getMonth() + 1
      const currently_year = CURRENTLY.getFullYear()
      let day = DATE.getDate()
      let month = DATE.getMonth() + 1
      const year= DATE.getFullYear()

      let hours = DATE.getHours()
      let minutes = DATE.getMinutes()
      if (hours < 10) hours = `0${hours}`
      if (minutes < 10) minutes = `0${minutes}`

      if (currently_day === day && currently_month === month && currently_year === year) {
        return `${hours}:${minutes}`
      }

      const YESTERDAY = new Date()
      YESTERDAY.setDate(YESTERDAY.getDate() - 1)
      const yesterday_day = YESTERDAY.getDate()
      const yesterday_month = YESTERDAY.getMonth() + 1
      const yesterday_year = YESTERDAY.getFullYear()

      if (yesterday_day === day && yesterday_month === month && yesterday_year === year) {
        return `${this.$t('chat.yesterday')}, ${hours}:${minutes}`
      }

      if (day < 10) day = `0${day}`
      if (month < 10) month = `0${month}`
      return `${day}.${month}.${year}. ${hours}:${minutes}`
    }
  },
  async mounted() {
    this.loading = true
    const response = await this.$store.dispatch('getMessages', {chatId: this.chat.id})
    this.messages = response.data.messages
    this.scrollToBottom()
    this.loading = false
  },
  computed: {
    position() {
      if (this.$store.getters['currentChat']) {
        let index = 6
        if (this.$store.getters['currentChat'] == this.index) {
          index = 9
        }
        return {
          left: `${this.$store.getters['chatPosition'][this.index].x}px`,
          top: `${this.$store.getters['chatPosition'][this.index].y}px`,
          'z-index': index
        }
      } else {
        return {
          top: `50px`,
          left: `50px`
        }
      }
    },
    userId() {
      return this.$store.getters['user'].id
    },
    newMessages() {
      return this.$store.getters['newMessages']
    }
  },
  watch: {
    newMessages() {
      if (!this.newMessages.length) return

      this.newMessages.forEach(msg => {
        if (msg.chatId === this.chat.id) {
          this.messages.push(msg.message)
          this.scrollToBottomSmooth()
          this.$store.commit('clearMessages')
        }
      })
    }
  },
  props: ['index', 'chat']
}
</script>

<style scoped>
.chat {
  width: 300px;
  height: 400px;
  background-color: #fff;
  box-shadow: 0 0 74px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  border: 1px solid var(--primary-color);
  position: absolute;
  top: 50px;
  left: 50px;
  --chat-header: 40px;
  --chat-input: 50px;
  transition: var(--main-trans);
  transition-property: width, height;
}
.chat__loader {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
}
.chat.fullScreen {
  position: fixed;
  width: calc(100% - var(--sidebar-width));
  height: calc(100% - var(--header-height));
  top: var(--header-height) !important;
  left: var(--sidebar-width) !important;
  border-radius: 0;
  border-color: rgba(0,0,0,0);
  --chat-input: 100px;
  z-index: 2 !important;
  transition-property: all;
}
.chat.fullScreen .chat__input {
  align-items: flex-start;
  padding: 20px 20px 0 20px;
}
.chat.fullScreen .chat__input-textarea {
  font-size: 14px;
}
.chat.fullScreen .chat__input-send {
  width: 40px;
  height: 40px;
}
.chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--chat-header);
  padding: 10px;
  border-bottom: 1px solid var(--primary-color);
  cursor: pointer;
}
.chat__header-name {
  color: var(--secondary-color);
  font-size: 12px;
  font-weight: 600;
  margin-right: auto;
  margin-left: 10px;
}
.chat__header-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.chat__header-fullscreen,
.chat__header-close {
  background: none;
  border: none;
  cursor: pointer;
  width: 16px;
  height: 16px;
  outline: none;
}
.chat__messages {
  height: calc(100% - var(--chat-header) - var(--chat-input));
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
  overflow-y: scroll;
}
.chat__message {
  overflow-wrap: anywhere;
  white-space: break-spaces;
  font-size: 14px;
  font-weight: 500;
  background-color: var(--bg-color);
  border-radius: 10px 10px 0 10px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chat__message-date {
  opacity: 0.5;
  font-size: 12px;
}
.chat__message:first-child {
  margin-top: auto;
}
.chat__message.owner {
  background-color: var(--primary-color);
  color: var(--primary-color-invert);
  margin-left: auto;
  border-radius: 10px 10px 10px 0;
  align-items: flex-end;
}
.chat__messages-null {
  text-align: center;
  font-size: 14px;
  margin: auto auto 0;
}
.chat__input {
  height: var(--chat-input);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  gap: 10px;
  border-top: 1px solid var(--primary-color);
}
.chat__input-textarea {
  background-color: var(--bg-color);
  width: 100%;
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  border-radius: 5px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  padding: 7px 10px 0 10px;
  height: calc(100% - 20px);
}
.chat__input-send {
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
</style>
