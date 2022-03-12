<template>
  <div class="home w-full h-fit z-10">
    <VueCarousel title="Animan shorts" />
    <h1>Home page</h1>
  </div>
</template>

<script>
import VueCarousel from "@/components/VueCarousel.vue";

export default {
  name: "HomeView",
  components: {
    VueCarousel,
  },
  setup() {},
};
</script>
