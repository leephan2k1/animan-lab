import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/index.vue";

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      layout: "default",
    },
    component: HomeView,
  },
  {
    path: "/register",
    name: "register",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/register.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
