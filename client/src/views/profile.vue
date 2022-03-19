<template>
  <div class="w-full h-fit">
    <HeaderProfile />
    <router-view :postsData="[...Array(2).keys()]" achievementsData="hoho" />
  </div>
</template>

<script>
import { ref } from "vue";

import HeaderProfile from "@/components/HeaderProfile.vue";
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    HeaderProfile,
    VueButton,
  },
  setup() {
    const currentComponent = ref("myResearch");

    const fakeData = [];

    return { fakeData, currentComponent };
  },
};
</script>
