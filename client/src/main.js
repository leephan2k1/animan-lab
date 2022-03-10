import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import assignGlobalComponents from "@/utils/import";

import "@/assets/styles/tailwind.scss";
import "@/assets/styles/global.scss";
import "@/assets/styles/grid.scss";
import "animate.css";

const app = createApp(App);

assignGlobalComponents(app);

app.use(store);
app.use(router);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
});

app.mount("#app");
