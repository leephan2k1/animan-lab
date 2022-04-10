<template>
  <Teleport to="head">
    <meta name="description" :content="`Trang cá nhân ${profile.user_name}`" />
    <meta property="og:site_name" content="Animan Lab" />
    <meta
      name="og:description"
      :content="`Trang cá nhân ${profile.user_name}`"
    />
    <meta property="og:image" :content="avatarHandler(profile)" />
    <meta property="og:url" :content="computeURL()" />
  </Teleport>
  <div class="w-full h-fit relative">
    <HeaderProfile />
    <h1 class="font-semibold md:text-lg pt-4 text-center">
      {{ OptionalTittle }}
    </h1>
    <router-view
      @toggleWaifuForm="handleOpenWaifuForm"
      :postsData="OptionalData"
      :isWaifuOwner="waifuOwner"
      :isFetchingWaifu="isFetchingWaifu"
      title="profileView"
    />
    <WaifuForm
      ref="waifuFormComp"
      class="hidden animate__animated animate__faster"
      @toggleWaifuForm="handleOpenWaifuForm"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import HeaderProfile from "@/components/HeaderProfile.vue";
import WaifuForm from "@/components/WaifuForm.vue";
import VueButton from "@/components/VueButton.vue";

import { avatarHandler } from "@/utils/userHandler";

import repositoryFactory from "@/api/repositoryFactory";
const userRepository = repositoryFactory.get("users");

export default {
  components: {
    HeaderProfile,
    VueButton,
    WaifuForm,
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
        case "profilePending":
          //private data (user_name local + access token)
          const { user_name } = profile;
          //public data (username in params)
          const { username } = route.params;
          if (user_name !== username) {
            return "Chỉ có người sở hữu bài viết mới có thể xem";
          }
      }
    });
    const OptionalData = ref(null);

    //config VueWaifu Component:
    const waifuOwner = ref(true);
    const waifuFormComp = ref(null);
    const isFetchingWaifu = ref(false);

    //tracking navigation & user name
    watch([params, public_user_name], () => {
      OptionalData.value = [];
      fetchPostData();
      checkWaifuOwner();
    });

    const checkWaifuOwner = () => {
      const { user_name } = profile;
      if (public_user_name.value !== user_name) {
        waifuOwner.value = false;
      } else {
        waifuOwner.value = true;
      }
    };

    const handleOpenWaifuForm = (value) => {
      const { waifuForm } = waifuFormComp.value;
      const { inputForm } = waifuFormComp.value;
      if (value) {
        waifuForm.classList.remove("hidden", "animate__fadeOut");
        waifuForm.classList.add("animate__fadeIn");
        //scroll to top:
        window.scrollTo({ top: 0, behavior: "smooth" });
        inputForm.focus();
      } else {
        waifuForm.classList.remove("animate__fadeIn");
        waifuForm.classList.add("animate__fadeOut");
        setTimeout(() => {
          waifuForm.classList.add("hidden");
        }, 500);
        //fetch waifu again if waifu was added
        isFetchingWaifu.value = !isFetchingWaifu.value;
        inputForm.value = "";
      }
    };

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
              //config title:
              if (OptionalData.value.length === 0)
                OptionalData.value = "bookmark empty";
            } else {
              OptionalData.value = [];
            }
            break;
          case "postsLiked":
            res = await userRepository.getLikeList(user_name);
            if (res?.data.success) {
              OptionalData.value = res?.data.like_list;
              OptionalData.value = OptionalData.value.filter(
                (post) => !post.tags.includes("short")
              );
              if (OptionalData.value.length === 0)
                OptionalData.value = "like list empty";
            } else {
              OptionalData.value = [];
            }
            break;
          case "profilePosts":
            res = await userRepository.getMyPosts(username);
            if (res?.data.success) {
              OptionalData.value = res.data.posts.filter(
                (post) => post.approve === true && !post.tags.includes("short")
              );
              if (OptionalData.value.length === 0)
                OptionalData.value = "my posts empty";
            } else {
              OptionalData.value = [];
            }
            break;
          case "profilePending":
            //private data:
            if (user_name !== username) {
              OptionalData.value = [];
            } else {
              res = await userRepository.getMyPosts(user_name);
              if (res?.data.success) {
                OptionalData.value = res.data.posts.filter(
                  (post) => post.approve === false
                );
              } else {
                OptionalData.value = [];
              }
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

    const computeURL = () => {
      return window.location.href;
    };

    fetchPostData();

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    checkWaifuOwner();

    return {
      avatarHandler,
      profile,
      currentComponent,
      OptionalTittle,
      OptionalData,
      waifuOwner,
      handleOpenWaifuForm,
      waifuFormComp,
      isFetchingWaifu,
      computeURL,
    };
  },
};
</script>
