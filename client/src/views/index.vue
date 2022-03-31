<template>
  <div class="home w-full h-fit z-10 overflow-hidden">
    <VueCarousel title="Animan shorts" />
    <HighlightsPost title="Học liệu nổi bật" />
    <PostSuggestions title="Hôm nay đọc gì?" />
    <AuthorRanking title="Bảng xếp hạng hiền giả" />
    <div
      class="select-none border-l-4 border-button px-2 flex items-center hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">Nghiên cứu mới nhất</h1>
    </div>
    <VuePost :postsData="newPost" />
  </div>
</template>

<script>
import { ref } from "vue";

import VueCarousel from "@/components/VueCarousel.vue";
import HighlightsPost from "@/components/HighlightsPost.vue";
import PostSuggestions from "@/components/PostSuggestions.vue";
import VuePost from "@/components/VuePost.vue";
import AuthorRanking from "@/components/AuthorRanking.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepo = repositoryFactory.get("posts");

export default {
  name: "HomeView",
  components: {
    VueCarousel,
    HighlightsPost,
    PostSuggestions,
    VuePost,
    AuthorRanking,
  },
  setup() {
    const newPost = ref([]);

    const fetchNewPost = async () => {
      try {
        const params = {
          page: 1,
          limit: 10,
          sort: "desc",
        };
        const res = await postRepo.searchPost(params);
        if (res?.data.success) {
          newPost.value = res.data?.posts.docs;
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchNewPost();

    return { newPost };
  },
};
</script>
