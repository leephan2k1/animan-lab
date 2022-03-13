<template>
  <div class="home w-full h-fit z-10">
    <VueCarousel title="Animan shorts" />
    <HighlightsPost title="Học liệu nổi bật" />
    <PostSuggestions title="Hôm nay đọc gì?" />
    <VuePost title="Nghiên cứu mới nhất"/>
  </div>
</template>

<script>
import VueCarousel from "@/components/VueCarousel.vue";
import HighlightsPost from "@/components/HighlightsPost.vue";
import PostSuggestions from "@/components/PostSuggestions.vue";
import VuePost from "@/components/VuePost.vue";

export default {
  name: "HomeView",
  components: {
    VueCarousel,
    HighlightsPost,
    PostSuggestions,
    VuePost,
  },
  setup() {},
};
</script>
