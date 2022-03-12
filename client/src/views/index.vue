<template>
  <div class="home w-full h-fit z-10">
    <VueCarousel title="Animan shorts" />
    <HighlightsPost title="Học liệu nổi bật"/>
    <h1>Home page</h1>
  </div>
</template>

<script>
import VueCarousel from "@/components/VueCarousel.vue";
import HighlightsPost from "@/components/HighlightsPost.vue";

export default {
  name: "HomeView",
  components: {
    VueCarousel,
    HighlightsPost,
  },
  setup() {},
};
</script>
