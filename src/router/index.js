import { createRouter, createWebHistory } from "vue-router";
import ApiService from "@/api/apiService.js";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Task from "@/views/Tasks.vue";
import TaskForm from "@/views/TaskForm.vue";
import { useAuthStore } from "@/store";

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/tasks",
        name: "Task",
        component: Task,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/task/new",
        name: "TaskCreate",
        component: TaskForm,
        meta: {
            requiresAuth: true,
        },
    },

    {
        path: "/task/edit/:id",
        name: "TaskEdit",
        component: TaskForm,
        props: true,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/login",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({ path: "/login", query: { from: to.fullPath } });
    } else if (
        auth.isAuthenticated &&
        (to.path === "/login" || to.path === "/register")
    ) {
        next({ path: "/tasks" });
    } else {
        next();
    }
});

export default router;
