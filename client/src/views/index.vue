<template>
  <div class="home w-full h-fit z-10 overflow-hidden">
    <VueCarousel title="Animan shorts" />
    <HighlightsPost title="Học liệu nổi bật" />
    <PostSuggestions title="Hôm nay đọc gì?" />
    <AuthorRanking title="Bảng xếp hạng hiền giả" />
    <VuePost title="Nghiên cứu mới nhất"/>
  </div>
</template>

<script>
import VueCarousel from "@/components/VueCarousel.vue";
import HighlightsPost from "@/components/HighlightsPost.vue";
import PostSuggestions from "@/components/PostSuggestions.vue";
import VuePost from "@/components/VuePost.vue";
import AuthorRanking from "@/components/AuthorRanking.vue";

export default {
  name: "HomeView",
  components: {
    VueCarousel,
    HighlightsPost,
    PostSuggestions,
    VuePost,
    AuthorRanking,
  },
  setup() {},
};
</script>
