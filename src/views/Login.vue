<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Login</h2>
            <div v-if="error" class="error-message">{{ error }}</div>

            <form @submit="handleSubmit">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        v-model="formData.username"
                        placeholder="Enter your username"
                    />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        v-model="formData.password"
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit" class="auth-button">Login</button>
            </form>

            <div class="auth-footer">
                Don't have an account ?
                <RouterLink to="/register">Register here</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import ApiService from "@/api/apiService";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/store";

const formData = ref({
    username: "",
    password: "",
});

const error = ref("");
const router = useRouter();
const auth = useAuthStore();

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.value.username || !formData.value.password) {
        error.value = "Please fill in all fields";
        return;
    }

    const success = await auth.login(formData.value);

    if (success) {
        error.value = "";
        router.push("/tasks");
    } else {
        error.value = "Invalid username or password";
    }
};
</script>
