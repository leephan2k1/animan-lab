<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { PUBLIC_LAYOUT, USER_REQUEST } from "@/constants";
import { useStore } from "vuex";

import { useHead } from "@vueuse/head";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    const routeName = computed(() => route.name);

    const fetchUserInfoDetail = async () => {
      const isLogged = store.getters["auth/isAuthenticated"];
      const profile = store.getters["user/getProfile"];
      const { user_name } = profile;
      if (isLogged) {
        await store.dispatch(`user/${USER_REQUEST}`, user_name);
      }
    };

    if (routeName.value === "home") {
      useHead({
        title: "Animan Lab",
        meta: [
          {
            name: "description",
            content: "Animan Lab",
          },
          {
            property: "og:description",
            content: "Animan Lab",
          },
          {
            property: "og:url",
            content: computed(() => window.location.href),
          },
          {
            property: "og:image",
            content: computed(() => require("@/assets/images/thumbnail.png")),
          },
          {
            property: "og:site_name",
            content: "Animan Lab",
          },
        ],
      });
    }

    const computeURL = () => {
      return window.location.href;
    };

    fetchUserInfoDetail();
    return {
      routeName,
      computeURL,
      layout: computed(() => (route.meta.layout || PUBLIC_LAYOUT) + "-layout"),
    };
  },
};
</script>
