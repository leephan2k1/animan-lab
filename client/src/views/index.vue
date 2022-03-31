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
    <div class="w-full h-fit">
      <VuePost :postsData="newPost" @infinite="loadMore" />
    </div>
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
    const OPTIONS = {
      limit: 10,
      sort: "desc",
    };

    const page = ref(1);
    const hasNextPage = ref(false);

    const fetchNewPost = async () => {
      try {
        const params = {
          page: page.value,
          limit: OPTIONS.limit,
          sort: OPTIONS.sort,
        };
        const res = await postRepo.searchPost(params);
        if (res?.data.success) {
          if (page.value === 1) {
            newPost.value = res.data?.posts.docs;
          } else {
            newPost.value = newPost.value.concat(res.data?.posts.docs);
          }
          hasNextPage.value = res.data?.posts.hasNextPage;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const loadMore = (state) => {
      //setTimeout make sure skeleton always is loaded
      setTimeout(async () => {
        try {
          if (hasNextPage.value) {
            //next page:
            page.value++;
            //fetch next page:
            await fetchNewPost();
            //loading
            state.loaded();
          } else {
            hasNextPage.value = false;
            state.complete();
          }
        } catch (err) {
          state.error();
        }
      }, 500);
    };

    fetchNewPost();

    return { newPost, loadMore };
  },
};
</script>
