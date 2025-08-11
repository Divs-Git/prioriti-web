<template>
    <nav class="navbar">
        <div class="logo">
            <RouterLink to="/" class="logo-link">Prioriti</RouterLink>
        </div>

        <div class="desktop-nav">
            <template v-if="auth.isAuthenticated">
                <RouterLink to="/tasks" class="nav-link">My Tasks</RouterLink>
                <button @click="handleLogout" class="nav-button">Logout</button>
            </template>
            <template v-else>
                <RouterLink to="/login" class="nav-link">Login</RouterLink>
                <RouterLink to="/register" class="nav-link"
                    >Register</RouterLink
                >
            </template>
        </div>
    </nav>
</template>

<script setup>
import ApiService from "@/api/apiService";
import { computed, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/store";

const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
    const isLogout = window.confirm("Are you sure you want to logout?");

    if (isLogout) {
        auth.logout();
        router.push("/login");
    }
};
</script>

<style scoped></style>
