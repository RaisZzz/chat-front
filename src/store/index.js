import {createStore} from "vuex"
import {query} from "@/query"
import md5 from 'js-md5'
import helpers from "@/helpers"
import {messages} from "@/translate"
const messageAudio = new Audio(require('@/assets/message.mp3'))

const store = createStore({
    state () {
        return {
            socket: null,
            user: {
                id: 0,
                name: '',
                avatar: 0,
                email: ''
            },
            chats: {},
            openedChats: {},
            chatsPosition: {},
            currentChat: 0,
            error: null,
            newMessages: [],
            chatsLoading: true
        }
    },
    mutations: {
        setSocket(state, {socket}) {
            state.socket = socket
        },
        openChat(state, {chat}) {
            if (helpers.mobile()) {
                for(const key of Object.keys(state.openedChats)) {
                    delete state.openedChats[key]
                }
            }
            state.openedChats = Object.assign(state.openedChats, chat)
            setCurrentChat(state, Object.keys(chat)[0])
            changePosition(state, 1, Object.keys(chat)[0])
        },
        closeChat(state, {index}) {
            delete state.openedChats[index]
            changePosition(state, 0, index)
        },
        setCurrentChat(state, {index}) {
            setCurrentChat(state, index)
        },
        setChatPosition(state, {index, x, y}) {
            if (x <= 0) {
                state.chatsPosition[index].x = 0
            } else {
                state.chatsPosition[index].x = x
            }
            if (y <= 0) {
                state.chatsPosition[index].y = 0
            } else {
                state.chatsPosition[index].y = y
            }
        },
        data(state, data) {
            state.user.id = data.user.id
            state.user.name = data.user.username
            state.user.avatar = data.user.avatar
            state.user.email = data.user.email
        },
        logout(state) {
            state.user.id = 0
            state.user.name = ''
            state.user.avatar = 0
            state.user.email = ''
            state.chats = {}
            state.openedChats = {}
            state.chatsPosition = {}
            state.currentChat = 0
            state.error = null

            state.socket.disconnect()
            localStorage.removeItem('token')
        },
        setError(state, error) {
            state.error = error
        },
        closeError(state) {
            state.error = null
        },
        clearMessages(state) {
            state.newMessages = []
        }
    },
    actions: {
        async auth() {
            return await query({method: 'get', query: 'auth/auth'})
        },
        async registration(state, {username, email, password}) {
            const response = await query({method: 'post', query: 'auth/registration', params: {
                username,
                email,
                password: md5(password)
            }})
            if (response.status === 200) {
                await localStorage.setItem('token', response.data.token)
            }
            return response
        },
        async login(state, {email, password}) {
            const response = await query({method: 'post', query: 'auth/login', params: {
                email,
                password: md5(password)
            }})
            if (response.status === 200) {
                await localStorage.setItem('token', response.data.token)
            }
            return response
        },
        async getData({commit, dispatch}) {
            const response = await query({method: 'get', query: 'user/data'})
            commit('data', response.data)
            dispatch('getChats')
            return response;
        },
        // eslint-disable-next-line no-unused-vars
        async getUsers({state}, {offset, search}) {
            return await query({method: 'get', query: 'user/all', params: {
                offset,
                search
            }})
        },
        async getChats({state}) {
            state.chatsLoading = true
            const response = await query({method: 'get', query: 'chat/all'})
            response.data.chats.forEach(chat => {
                if (chat.personal) chat.title = messages[localStorage.getItem('locale')].chat.personal
                state.chats[chat.id] = chat
            })
            state.chatsLoading = false
            return response
        },
        async message({state}, data) {
            for (const msg of data) {
                if (msg.userId !== state.user.id) {
                    messageAudio.play()
                }
                if (!state.chats[msg.chatId]) {
                    const response = await query({method: 'get', query: 'chat/all'})
                    state.chats = response.data.chats
                }
            }
            state.newMessages = data
        },
        // eslint-disable-next-line no-unused-vars
        async startChat({state, dispatch, commit}, user_id) {
            let users = []
            if (state.user.id === user_id) {
                users = [state.user.id]
            } else {
                users = [state.user.id, user_id]
            }
            const response = await query({method: 'post', query: 'chat/start', params: {
                userId: user_id,
                users
            }})
            if (response.data.chat.personal) response.data.chat.title = messages[localStorage.getItem('locale')].chat.personal
            state.chats[response.data.chat.id] = response.data.chat
            commit('openChat', {chat: {
                [response.data.chat.id]: response.data.chat
            }})
            return response
        },
        async startChatSocket({state}, socketChat) {
            state.chats[socketChat.id] = socketChat
        },
        // eslint-disable-next-line no-unused-vars
        async sendMessage({state}, {chatId, message}) {
            return await query({method: 'post', query: 'chat/sendMessage', params: {
                chatId,
                message
            }})
        },
        // eslint-disable-next-line no-unused-vars
        async getMessages({state}, {chatId, offset}) {
            return await query({method: 'get', query: 'chat/getMessages', params: {
                chatId,
                offset
            }})
        },
        // eslint-disable-next-line no-unused-vars
        async getUser({state}, {userId}) {
            return await query({method: 'get', query: 'user/', params: {
                userId
            }})
        },
        // eslint-disable-next-line no-unused-vars
        async deleteMessages({state}, {chatId, messages}) {
            return await query({method: 'post', query: 'chat/deleteMessages', params: {
                chatId,
                messages
            }})
        }
    },
    getters: {
        socket: state => {
            return state.socket
        },
        user: state => {
            return state.user
        },
        chats: state => {
            return state.chats
        },
        openedChats: state => {
            return state.openedChats
        },
        chatPosition: state => {
            return state.chatsPosition
        },
        currentChat: state => {
            return state.currentChat
        },
        error: state => {
            return state.error
        },
        newMessages: state => {
            return state.newMessages
        },
        chatsLoading: state => {
            return state.chatsLoading
        }
    }
})

function changePosition(state, action, index) {
    const stepX = 200
    const stepY = 50
    if (action === 0) {
        delete state.chatsPosition[index]
    } else if (action === 1) {
        state.chatsPosition[index] = {}
        let maxX = 0
        for (const value of Object.values(state.chatsPosition)) {
            if (value.x > maxX) maxX = value.x
        }
        let minX = maxX
        for (const value of Object.values(state.chatsPosition)) {
            if (value.x < minX) minX = value.x
        }
        if (minX - stepX >= 0) {
            state.chatsPosition[index].x = minX - stepX
        } else if (minX === 0) {
            state.chatsPosition[index].x = 50
        } else {
            state.chatsPosition[index].x = maxX + stepX
        }

        let maxY = 0
        for (const value of Object.values(state.chatsPosition)) {
            if (value.y > maxY) maxY = value.y
        }
        let minY = maxY
        for (const value of Object.values(state.chatsPosition)) {
            if (value.y < minY) minY = value.y
        }
        if (minY - stepY >= stepY) {
            state.chatsPosition[index].y = minY - stepY
        } else if (minY === 0) {
            state.chatsPosition[index].y = 50
        } else {
            state.chatsPosition[index].y = maxY + stepY
        }
    }
}

function setCurrentChat(state, index) {
    state.currentChat = index
}

export default store
