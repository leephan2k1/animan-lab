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
    children: [
      {
        path: "posts",
        name: "profilePosts",
        props: true,
        component: () => import("@/components/VuePost.vue"),
      },
      {
        path: "posts-liked",
        name: "postsLiked",
        props: true,
        component: () => import("@/components/VuePost.vue"),
      },
      {
        path: "posts-bookmarked",
        name: "postsBookmarked",
        props: true,
        component: () => import("@/components/VuePost.vue"),
      },
      {
        path: "pending",
        name: "profilePending",
        props: true,
        component: () => import("@/components/VuePost.vue"),
      },
      {
        path: "achievements",
        name: "profileAchievements",
        props: true,
        component: () => import("@/components/VueAchievements.vue"),
      },
      {
        path: "waifu",
        name: "profileWaifu",
        props: true,
        component: () => import("@/components/VueWaifu.vue"),
      },
    ],
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
