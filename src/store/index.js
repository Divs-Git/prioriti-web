import { defineStore } from "pinia";
import ApiService from "@/api/apiService";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getToken: (state) => state.token,
    },

    actions: {
        async login(credintials) {
            try {
                const { data } = await ApiService.loginUser(credintials);
                this.token = data;
                localStorage.setItem("token", this.token);
                return true;
            } catch (error) {
                console.log("Login failed: ", error);
                return false;
            }
        },

        logout() {
            this.token = null;
            localStorage.removeItem("token");
        },
    },
});
