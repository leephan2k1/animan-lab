<template>
  <Teleport to="head">
    <template v-if="routeName === 'home'">
      <meta
        name="description"
        content="Animan Lab - Chia sẽ & đánh giá Anime, Manga"
      />
      <meta property="og:site_name" content="Animan Lab" />
      <meta
        property="og:image"
        :content="require('@/assets/images/thumbnail.png')"
      />
      <meta property="og:url" :content="computeURL()" />
    </template>
  </Teleport>
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

    const routeName = computed(() => route.name);

    const fetchUserInfoDetail = async () => {
      const isLogged = store.getters["auth/isAuthenticated"];
      const profile = store.getters["user/getProfile"];
      const { user_name } = profile;
      if (isLogged) {
        await store.dispatch(`user/${USER_REQUEST}`, user_name);
      }
    };

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
