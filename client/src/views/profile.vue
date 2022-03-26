<template>
  <div class="w-full h-fit">
    <HeaderProfile />
    <h1 class="font-semibold md:text-lg pt-4 text-center">
      {{ OptionalTittle }}
    </h1>
    <router-view :postsData="OptionalData" />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
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
    const store = useStore();
    const profile = store.getters["user/getProfile"];
    const params = computed(() => route.name);
    const public_user_name = computed(() => route.params.username);

    const OptionalTittle = computed(() => {
      switch (route.name) {
        case "postsLiked":
          return "Bài viết yêu thích";
        case "postsBookmarked":
          return "Bài viết được đánh dấu";
      }
    });
    const OptionalData = ref(null);

    //tracking navigation & user name
    watch([params, public_user_name], () => {
      OptionalData.value = [];
      fetchPostData();
    });

    const fetchPostData = async () => {
      //private data (user_name local + access token)
      const { user_name } = profile;
      //public data (username in params)
      const { username } = route.params;
      try {
        let res;
        switch (route.name) {
          case "postsBookmarked":
            res = await userRepository.getBookmarkList(user_name);
            if (res?.data.success) {
              OptionalData.value = res?.data.bookmark_posts;
            } else {
              OptionalData.value = [];
            }
            break;
          case "postsLiked":
            res = await userRepository.getLikeList(user_name);
            if (res?.data.success) {
              OptionalData.value = res?.data.like_list;
            } else {
              OptionalData.value = [];
            }
            break;
          case "profilePosts":
            res = await userRepository.getMyPosts(username);
            if (res?.data.success) {
              OptionalData.value = res.data.posts.filter(
                (post) => post.approve === true
              );
            } else {
              OptionalData.value = [];
            }
            break;
          case "profilePending":
            res = await userRepository.getMyPosts(username);
            if (res?.data.success) {
              OptionalData.value = res.data.posts.filter(
                (post) => post.approve === false
              );
            } else {
              OptionalData.value = [];
            }
            break;
          default:
            OptionalData.value = [];
        }
      } catch (err) {
        OptionalData.value = [];
        console.error(err);
      }
    };

    fetchPostData();

    return { currentComponent, OptionalTittle, OptionalData };
  },
};
</script>
