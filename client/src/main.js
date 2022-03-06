import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import assignGlobalComponents from "@/utils/import";

import "@/assets/styles/tailwind.scss";
import "@/assets/styles/global.scss";


const app = createApp(App);

assignGlobalComponents(app);

app.use(store);
app.use(router);

app.mount("#app");
