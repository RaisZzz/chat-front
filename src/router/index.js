import { createWebHistory, createRouter } from "vue-router"
import ChatView from "@/views/ChatView"
import LoginView from "@/views/LoginView"
import RegistrationView from "@/views/RegistrationView"

const routes = [
    {
        path: "/",
        name: "Chat",
        component: ChatView
    },
    {
        path: "/login",
        name: "Login",
        component: LoginView
    },
    {
        path: "/registration",
        name: "Registration",
        component: RegistrationView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
