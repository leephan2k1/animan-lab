<template>
  <div class="w-full h-full relative">
    <StatusCreator @openStatusEditor="handleOpenStatusEditor" />
    <StatusEditor @refreshContent="fetchData" :openEditor="triggerOpenEditor" />
    <VueStatus @infinite="loadMore" :data="data" />
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

import StatusCreator from "@/components/StatusCreator.vue";
import StatusEditor from "@/components/StatusEditor.vue";
import VueStatus from "@/components/VueStatus.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepo = repositoryFactory.get("posts");
const userRepo = repositoryFactory.get("users");

export default {
  components: {
    StatusCreator,
    VueStatus,
    StatusEditor,
  },
  setup() {
    const fakeData = [...Array(10).keys()];
    const triggerOpenEditor = ref(false);

    const data = ref([]);
    const page = ref(1);
    const hasNextPage = ref(false);

    const route = useRoute();
    const params = computed(() => route.params.shortType);

    const OPTIONS = {
      limit: 5,
      sort: "desc",
      tags: "short",
      populate: "user",
    };

    const handleOpenStatusEditor = () => {
      triggerOpenEditor.value = !triggerOpenEditor.value;
    };

    const handleMetaTags = () => {
      try {
        document
          .querySelector('meta[name="description"]')
          .setAttribute("content", `Bài viết về bài đăng ngắn`);
        document
          .querySelector('meta[property="og:title"]')
          .setAttribute("content", `Animan Lab`);
        document
          .querySelector('meta[property="og:description"]')
          .setAttribute("content", `Bài viết về bài đăng ngắn`);
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
          tags: OPTIONS.tags,
          populate: OPTIONS.populate,
        };
        const res = await postRepo.searchPost(params);
        if (res?.data.success) {
          if (page.value === 1) {
            data.value = res.data?.posts.docs;
          } else {
            data.value = data.value.concat(res.data?.posts.docs);
          }
          hasNextPage.value = res.data?.posts.hasNextPage;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchOptionData = async () => {
      try {
        const res = await postRepo.getPost(params.value);
        if (res?.data.success) {
          const post = res.data.post;

          const res_author = await userRepo.getUser(post?.author_name);
          if (res_author?.data.success) {
            //assign author_id because config in VueStatus.vue
            post.author_id = res_author.data?.user;
            data.value.push(post);
          }
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

    const computeURL = () => {
      return window.location.href;
    };

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    if (params.value === "animans") {
      fetchData();
    } else {
      fetchOptionData();
    }

    return {
      fetchData,
      fakeData,
      handleOpenStatusEditor,
      triggerOpenEditor,
      data,
      loadMore,
      computeURL,
    };
  },
};
</script>
