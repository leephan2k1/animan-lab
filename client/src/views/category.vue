<template>
  <div class="w-full z-10 min-h-[400px] h-fit">
    <h1
      v-if="currentPath === 'anime' || currentPath === 'manga'"
      class="mt-2 uppercase text-lg"
    >
      Trung tâm nghiên cứu về {{ currentPath }}
    </h1>
    <h1 v-else class="mt-2 uppercase text-lg">
      {{
        optionalData === "optional data empty"
          ? `Chưa có bài viết nào về ${currentPath}`
          : `Bài viết về ${currentPath}`
      }}
    </h1>
    <VuePost
      :title="'Học liệu ' + currentPath"
      :postsData="optionalData"
      @infinite="loadMore"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

import { TAGS } from "@/constants";

import VuePost from "@/components/VuePost.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepo = repositoryFactory.get("posts");

export default {
  components: {
    VuePost,
  },

  setup() {
    const route = useRoute();
    const currentPath = computed(() => route.params.general);

    const OPTIONS = {
      limit: 10,
      sort: "desc",
    };
    const optionalData = ref([]);

    const page = ref(1);
    const hasNextPage = ref(false);

    const computeURL = () => {
      return window.location.href;
    };

    onUnmounted(() => {});

    const handleMetaTags = () => {
      try {
        document
          .querySelector('meta[name="description"]')
          .setAttribute("content", `Bài viết về ${currentPath.value}`);
        document
          .querySelector('meta[property="og:title"]')
          .setAttribute("content", `Animan Lab`);
        document
          .querySelector('meta[property="og:description"]')
          .setAttribute("content", `Bài viết về ${currentPath.value}`);
        document
          .querySelector('meta[property="og:url"]')
          .setAttribute("content", window.location.href);
        document
          .querySelector('meta[property="og:image"]')
          .setAttribute(
            "content",
            "https://res.cloudinary.com/lee1002/image/upload/v1649660370/animan/c0skrmfi0rvnpu20gwbj.png"
          );
        document
          .querySelector('meta[property="og:site_name"]')
          .setAttribute("content", "Animan Lab");
      } catch (error) {}
    };

    handleMetaTags();

    const fetchData = async () => {
      try {
        const params = {
          page: page.value,
          limit: OPTIONS.limit,
          sort: OPTIONS.sort,
        };

        //tags filter:
        if (
          TAGS.find(
            (e) => e.text.toLowerCase() === `${currentPath.value}`.toLowerCase()
          )
        ) {
          params.tags = currentPath.value;
        }
        //search filter:
        else {
          params.title = currentPath.value;
        }

        const res = await postRepo.searchPost(params);
        if (res?.data.success) {
          if (page.value === 1) {
            if (res.data?.posts.docs.length > 0) {
              optionalData.value = res.data?.posts.docs;
            } else {
              optionalData.value = "optional data empty";
            }
          } else {
            optionalData.value = optionalData.value.concat(
              res.data?.posts.docs
            );
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
            await fetchData();
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

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    fetchData();

    return { currentPath, optionalData, loadMore, computeURL };
  },
};
</script>
