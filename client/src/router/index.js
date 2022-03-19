import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/index.vue";
import { isAuthenticated, isNotAuthenticated } from "./routerAuth";

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
    path: "/anime",
    name: "anime",
    meta: {
      layout: "default",
    },
    component: () => import("@/views/category.vue"),
  },
  {
    path: "/manga",
    name: "manga",
    meta: {
      layout: "default",
    },
    component: () => import("@/views/category.vue"),
  },
  {
    path: "/short",
    name: "short",
    meta: {
      layout: "default",
    },
    component: () => import("@/views/shortPost.vue"),
  },
  {
    path: "/profile/:username",
    name: "profile",
    meta: {
      layout: "default",
    },
    component: () => import("@/views/profile.vue"),
    beforeEnter: isAuthenticated,
  },
  {
    path: "/register",
    name: "register",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/register.vue"),
    beforeEnter: isNotAuthenticated,
  },
  {
    path: "/login",
    name: "login",
    meta: {
      layout: "auth",
    },
    component: () => import("@/views/login.vue"),
    beforeEnter: isNotAuthenticated,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
