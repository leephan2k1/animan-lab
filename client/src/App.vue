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

export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    const fetchUserInfoDetail = async () => {
      const isLogged = store.getters["auth/isAuthenticated"];
      const profile = store.getters["user/getProfile"];
      const { user_name } = profile;
      if (isLogged) {
        await store.dispatch(`user/${USER_REQUEST}`, user_name);
      }
    };

    fetchUserInfoDetail();
    return {
      layout: computed(() => (route.meta.layout || PUBLIC_LAYOUT) + "-layout"),
    };
  },
};
</script>
