import { createI18n } from "vue-i18n"

export const messages = {
    ru: {
        form: {
            registration: "Зарегистрироваться",
            username: "Имя пользователя",
            password: "Пароль",
            login: "Войти",
            email: "E-mail",
            register: "Зарегистрироваться"
        },
        settings: {
            logout: "Выйти из аккаунта"
        },
        loading: "Данные загружаются",
        selectUser: "Откройте чат..",
        sidebar: {
          search: "Введите имя.."
        },
        chat: {
            search: "Найти пользователей",
            searchMobile: "Поиск",
            searchPlaceholder: "Введите имя/email..",
            usersNull: "Таких пользователей нет.",
            start: "Написать",
            enterMsg: "Введите сообщение..",
            notMessages: "Сообщений нет.",
            owner: "вы",
            personal: "личное",
            null: "Чатов нет.",
            yesterday: "Вчера",
            selected: "Выбрано сообщений:",
            deletePopup: "Вы уверены, что хотите удалить сообщения?\n\nОни будут удалены у всех.",
            popupConfirm: "Да",
            popupCancel: "Отменить"
        }
    },
    en: {
        form: {
            registration: "Register",
            username: "Username",
            password: "Password",
            login: "Login",
            email: "Email",
            register: "Register"
        },
        settings: {
            logout: "Logout"
        },
        loading: "Data is loading",
        selectUser: "Open chat..",
        sidebar: {
            search: "Enter a name.."
        },
        chat: {
            search: "Find users",
            searchMobile: "Search",
            searchPlaceholder: "Enter name/email..",
            usersNull: "There are no such users.",
            start: "Write",
            enterMsg: "Enter a message..",
            notMessages: "No messages.",
            owner: "you",
            personal: "personal",
            null: "No chats.",
            yesterday: "Yesterday",
            selected: "Selected messages:",
            deletePopup: "Are you sure you want to delete messages?\n\nThey will be deleted for everyone.",
            popupConfirm: "Yes",
            popupCancel: "Cancel"
        }
    }
}

export const i18n = createI18n({
    locale: localStorage.getItem('locale'),
    fallbackLocale: 'en',
    messages
})
