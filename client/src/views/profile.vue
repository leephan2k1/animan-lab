<template>
  <div class="w-full h-fit">
    <HeaderProfile />
    <h1 class="font-semibold md:text-lg pt-4 text-center">
      {{ OptionalTittle }}
    </h1>
    <router-view :postsData="OptionalData" achievementsData="hoho" />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import HeaderProfile from "@/components/HeaderProfile.vue";
import VueButton from "@/components/VueButton.vue";

import repositoryFactory from "@/api/repositoryFactory";
const userRepository = repositoryFactory.get("users");

export default {
  components: {
    HeaderProfile,
    VueButton,
  },
  setup() {
    const currentComponent = ref("myResearch");
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const profile = store.getters["user/getProfile"];
    const params = computed(() => route.name);

    const OptionalTittle = computed(() => {
      switch (route.name) {
        case "postsLiked":
          return "Bài viết yêu thích";
        case "postsBookmarked":
          return "Bài viết được đánh dấu";
      }
    });
    const OptionalData = ref(null);

    watch(params, () => {
      fetchPostData();
    });

    const paramsChecker = () => {
      const { user_name } = profile;
      if (route.params.username !== user_name) {
        router.push({ name: "notFound" });
      }
    };

    const fetchPostData = async () => {
      const { user_name } = profile;

      try {
        switch (route.name) {
          case "postsBookmarked":
            const res = await userRepository.getBookmarkList(user_name);
            if (res?.data.success) {
              OptionalData.value = res?.data.bookmark_posts;
            } else {
              OptionalData.value = [];
            }
            break;
          case "postsLiked":
            OptionalData.value = [];
            break;
          default:
            OptionalData.value = [];
        }
      } catch (err) {
        console.error(err);
      }
    };

    paramsChecker();

    fetchPostData();

    return { currentComponent, OptionalTittle, OptionalData };
  },
};
</script>
