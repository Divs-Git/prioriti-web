import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const pinia = createPinia();
const app = createApp(App);

app.component("VueDatePicker", VueDatePicker);

app.use(pinia);
app.use(router);
app.mount("#app");
