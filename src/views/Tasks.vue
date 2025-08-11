<template>
    <div class="tasks-container">
        <div class="tasks-header">
            <h2>My Tasks</h2>
            <RouterLink to="/task/new" class="add-task-button"
                >+ Add New Task</RouterLink
            >
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="tasks-filters">
            <div class="filter-group">
                <label for="priority-filter">Priority: </label>
                <select
                    name="priority-filter"
                    id="priority-filter"
                    v-model="priorityFilter"
                >
                    <option value="ALL">All Priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="completion-filter">Status: </label>
                <select
                    name="completion-filter"
                    id="completion-filter"
                    v-model="completionFilter"
                >
                    <option value="ALL">All Tasks</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>
        </div>

        <div class="tasks-list">
            <div v-if="filteredTasks.length === 0" class="no-tasks">
                <p>No tasks found matching your filters.</p>
                <button class="reset-filters-button" @click="resetFilters">
                    Reset Filters
                </button>
            </div>

            <div
                v-else
                v-for="task in filteredTasks"
                :key="task.id"
                :class="`task-card ${task.completed ? 'completed' : ''}`"
            >
                <div class="task-content">
                    <div class="task-header">
                        <h3>{{ task.title }}</h3>
                        <span
                            :class="`priority-badge ${task.priority.toLowerCase()}`"
                            >{{ task.priority }}</span
                        >
                    </div>

                    <p class="task-description">{{ task.description }}</p>

                    <div class="task-meta">
                        <span class="due-date">
                            Due:
                            {{ new Date(task.dueDate).toLocaleDateString() }}
                        </span>
                        <span class="created-at">
                            Created:
                            {{ new Date(task.createdAt).toLocaleDateString() }}
                        </span>
                    </div>
                </div>

                <div class="task-actions">
                    <button
                        @click="toggleCompleted(task.id, task.completed)"
                        :class="`complete-button ${
                            task.completed ? 'completed' : ''
                        }`"
                    >
                        {{ task.completed ? "✓ Completed" : "Mark Complete" }}
                    </button>

                    <RouterLink
                        :to="`/task/edit/${task.id}`"
                        class="edit-button"
                        >Edit</RouterLink
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from "@/store";
import { onMounted, ref, watch } from "vue";
import { useRouter, RouterLink } from "vue-router";
import ApiService from "@/api/apiService";

const tasks = ref([]);
const filteredTasks = ref([]);
const error = ref("");
const priorityFilter = ref("ALL");
const completionFilter = ref("ALL");

const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
    try {
        const response = await ApiService.getAllTasks();
        if (response.statusCode === 200) {
            tasks.value = response.data;
            filteredTasks.value = response.data;
            error.value = "";
        } else {
            error.value = response.message || "Failed to fetch tasks";
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Error applying filters";
        console.log(err);
    }
});

watch([completionFilter, priorityFilter, tasks], () => {
    const applyFilters = async () => {
        try {
            let result = [...tasks.value];

            // apply completion filter if not "ALL"
            if (completionFilter.value != "ALL") {
                const response = await ApiService.getAllTasksByCompleted(
                    completionFilter.value === "COMPLETED"
                );
                if (response.statusCode === 200) {
                    result = response.data;
                }
            }

            // apply priority filter if not "ALL"
            if (priorityFilter.value != "ALL") {
                const response = await ApiService.getAllTasksByPriority(
                    priorityFilter.value
                );
                if (response.statusCode === 200) {
                    // If both filter are applied, we need to intersect the results
                    if (completionFilter.value != "ALL") {
                        const priorityTasks = response.data;
                        result = result.filter((task) =>
                            priorityTasks.some((pt) => pt.id === task.id)
                        );
                    } else {
                        result = response.data;
                    }
                }
            }

            filteredTasks.value = result;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            console.log(err);
        }
    };

    if (tasks.value.length > 0) {
        applyFilters();
    }
});

const toggleCompleted = async (taskId, currentStatus) => {
    try {
        const response = await ApiService.updateTask({
            id: taskId,
            completed: !currentStatus,
        });

        if (response.statusCode === 200) {
            tasks.value = tasks.value.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !currentStatus }
                    : task
            );
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Error updating status";
        console.log(err);
    }
};

const resetFilters = () => {
    priorityFilter.value = "ALL";
    completionFilter.value = "ALL";
};
</script>
