<template>
  <div class="w-full h-fit">
    <HeaderProfile />
    <h1 class="font-semibold md:text-lg pt-4 text-center">
      {{ OptionalTittle }}
    </h1>
    <router-view :postsData="[...Array(2).keys()]" achievementsData="hoho" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import HeaderProfile from "@/components/HeaderProfile.vue";
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    HeaderProfile,
    VueButton,
  },
  setup() {
    const currentComponent = ref("myResearch");
    const route = useRoute();
    const OptionalTittle = computed(() => {
      switch (route.name) {
        case "postsLiked":
          return "Bài viết yêu thích";
        case "postsBookmarked":
          return "Bài viết được đánh dấu";
      }
    });

    const fakeData = [];

    return { fakeData, currentComponent, OptionalTittle };
  },
};
</script>
