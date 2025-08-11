<template>
    <div class="task-form-container">
        <h2>{{ isEdit ? "Edit Task" : "Add New Task" }}</h2>

        <div class="error-message" v-if="error">{{ error }}</div>

        <form @submit="handleSubmit">
            <div class="form-group">
                <label for="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    v-model="formData.title"
                    placeholder="Enter Task Title"
                    required
                />
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    v-model="formData.description"
                    placeholder="Enter Task Description"
                    required
                />
            </div>

            <div style="margin-bottom: 20px">
                <label for="dueDate">Due Date</label>
                <VueDatePicker
                    v-model="formData.dueDate"
                    name="dueDate"
                    id="dueDate"
                    placeholder="Due Date"
                    :min-date="new Date()"
                    :enable-time-picker="false"
                />
            </div>

            <div class="form-group">
                <label for="priority">Priority</label>
                <select
                    id="priority"
                    name="priority"
                    v-model="formData.priority"
                >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div v-if="isEdit">
                <div class="form-group checkbox-group">
                    <input
                        type="checkbox"
                        name="completed"
                        id="completed"
                        v-model="formData.completed"
                    />
                    <label for="completed" style="margin-bottom: 0"
                        >Completed</label
                    >
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="save-button">
                    {{ isEdit ? "Update Task" : "Create Task" }}
                </button>

                <div v-if="isEdit">
                    <button @click="handleDelete" class="delete-button">
                        Delete
                    </button>

                    <button
                        class="cancel-button"
                        @click="() => router.push('/tasks')"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import ApiService from "@/api/apiService";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const id = ref(route.params.id);
const isEdit = ref(Boolean(id.value));
const router = useRouter();

const formData = ref({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    completed: false,
});

const error = ref("");

onMounted(() => {
    if (isEdit.value) {
        const fetchTask = async () => {
            try {
                const response = await ApiService.getTaskById(id.value);
                if (response.statusCode === 200) {
                    formData.value = response.data;
                } else {
                    error.value = response.data || "Failed to fetch task";
                }
            } catch (err) {
                error = err.response?.data?.message || "Error fetching task";
            }
        };

        fetchTask();
    }
});

const handleSubmit = async (e) => {
    e.preventDefault();
    error.value = "";

    if (!formData.value.title) {
        error.value = "Title is required";
        return;
    }

    try {
        if (isEdit.value) {
            await ApiService.updateTask(formData.value);
        } else {
            await ApiService.createTask(formData.value);
        }

        router.push("/tasks");
    } catch (err) {
        error.value = err.response?.data?.message || "Error saving task";
    }
};

const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
        try {
            await ApiService.deleteTask(id.value);
            router.push("/tasks");
        } catch (err) {
            error.value = err.response?.data?.message || "Error deleting task";
        }
    }
};
</script>
