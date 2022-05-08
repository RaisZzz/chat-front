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
        chat: {
            search: "Найти пользователей",
            searchPlaceholder: "Введите имя/email..",
            start: "Написать",
            enterMsg: "Введите сообщение..",
            notMessages: "Сообщений нет.",
            owner: "вы",
            personal: "личное",
            null: "Чатов нет."
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