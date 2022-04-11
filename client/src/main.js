import { createApp } from "vue";
import { createHead } from "@vueuse/head";
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
import "swiper/css";

import { addListener, launch } from "devtools-detector";

NProgress.configure({ easing: "ease", speed: 1000, showSpinner: false });

const app = createApp(App);
const head = createHead();

assignGlobalComponents(app);

app.use(store);
app.use(head);
app.use(router);
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
});
app.mount("#app");

//protect web app
if (process.env.NODE_ENV !== "development") {
  (function () {
    const app = document.querySelector("#app");
    // 1. add listener
    addListener((isOpen) => {
      if (isOpen) {
        // app.innerHTML = null;
        // const p = document.createElement("p");
        // p.classList.add("text-center", "font-bold", "text-2xl");
        // p.innerText = "Còn đúng mỗi cái nịt!";
        // app.append(p);
        localStorage.removeItem("usr");
        localStorage.removeItem("access-token");
        localStorage.removeItem("_secure__ls__metadata");
        localStorage.removeItem("refresh-token");
      }
    });
    // 2. launch detect
    launch();
  })();
}
