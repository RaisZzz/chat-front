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
            yesterday: "Вчера"
        }
    },
    en: {
    }
}

export const i18n = createI18n({
    locale: 'ru',
    fallbackLocale: 'en',
    messages
})
