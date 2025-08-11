<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Register</h2>

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

                <button type="submit" class="auth-button">Register</button>
            </form>

            <div class="auth-footer">
                Already have an account ?
                <RouterLink to="/login">Login here</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import ApiService from "@/api/apiService";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";

const formData = ref({
    username: "",
    password: "",
});

const error = ref("");
const router = useRouter();

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.value.username || !formData.value.password) {
        error.value = "Please fill in all fields";
        return;
    }

    try {
        const response = await ApiService.registerUser(formData.value);
        if (response.statusCode === 200) {
            error.value = "";
            router.push("/login");
        } else {
            error.value = response.message || "Registration failed";
        }
    } catch (err) {
        error.value = err.response?.data?.message || err.message;
        console.log(err);
    }
};
</script>
