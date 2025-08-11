import axios from "axios";
import { useAuthStore } from "@/store";

export default class ApiService {
    static API_URL = "http://localhost:8080/api/v1";

    static getHeader() {
        const auth = useAuthStore();
        const token = auth.getToken || localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /**
     * Endpoints
     */

    // AUTH:
    // Register User
    static async registerUser(body) {
        const response = await axios.post(
            `${this.API_URL}/auth/register`,
            body
        );
        return response.data;
    }

    // Login User
    static async loginUser(body) {
        const response = await axios.post(`${this.API_URL}/auth/login`, body);
        return response.data;
    }

    // TASKS:
    // Create Task
    static async createTask(body) {
        const response = await axios.post(`${this.API_URL}/task`, body, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    // update Task
    static async updateTask(body) {
        const response = await axios.put(`${this.API_URL}/task`, body, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    // delete Task
    static async deleteTask(taskId) {
        const response = await axios.delete(`${this.API_URL}/task/${taskId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    // get all Tasks
    static async getAllTasks() {
        const response = await axios.get(`${this.API_URL}/task`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    // get Tasks By Id
    static async getTaskById(taskId) {
        const response = await axios.get(`${this.API_URL}/task/${taskId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    // get Tasks By Completed
    static async getAllTasksByCompleted(completed) {
        const response = await axios.get(`${this.API_URL}/task/status`, {
            headers: this.getHeader(),
            params: {
                completed,
            },
        });
        return response.data;
    }

    // get Tasks By Priority
    static async getAllTasksByPriority(priority) {
        const response = await axios.get(`${this.API_URL}/task/priority`, {
            headers: this.getHeader(),
            params: {
                priority,
            },
        });
        return response.data;
    }
}
