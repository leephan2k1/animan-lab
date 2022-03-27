<template>
  <div
    class="w-full min-h-[400px] h-fit bg-white rounded-lg shadow-md flex flex-col z-0"
  >
    <h1 class="lg:pl-7 p-4 text-2xl font-bold">
      {{ postData?.title }}
    </h1>
    <!-- author  -->
    <div class="w-full h-16 md:h-20 flex justify-between">
      <div class="lg:w-[35%] w-[80%] h-full flex">
        <div class="md:ml-0 ml-2 w-1/3 h-full absolute-center">
          <div
            :style="{
              backgroundImage: `url(${require('@/assets/images/defaultAvatar.jpg')})`,
            }"
            class="w-11 h-11 rounded-full bg-center bg-cover bg-no-repeat overflow-hidden"
          ></div>
        </div>

        <div class="w-2/3 h-full flex flex-col justify-center">
          <p class="md:text-base text-sm">Admin</p>
          <p
            class="md:text-[15px] text-[10px] border-[1px] border-button w-fit p-[3px] rounded-lg"
          >
            Wibu thuỷ tổ
          </p>
          <p class="md:text-base text-[10px]">
            Thích: {{ postData?.like }} | Bình luận:
            {{ postData?.comments.length }} | Lượt xem: {{ postData?.view }}
          </p>
        </div>
      </div>

      <div class="md:w-1/4 w-1/3 h-full flex items-center justify-evenly">
        <div
          ref="bookmarkButton"
          @click="handleBookmark"
          class="select-none cursor-pointer animate__animated animate__faster"
          :class="{
            'text-button': wasBookmarked,
            animate__zoomIn: wasBookmarked,
          }"
        >
          <VueButton buttonType="bookmark" />
        </div>
        <div
          @click.stop="handleDropdown"
          class="select-none cursor-pointer animate__animated relative"
        >
          <VueButton buttonType="dots-horizontal" />
          <div
            ref="dropDown"
            class="hidden animate__animated animate__faster absolute top-[25px] -left-[85px] w-28 h-fit bg-white border-[1px] border-gray-400 rounded-lg shadow-lg flex flex-col items-center justify-around"
          >
            <p
              @click.stop="handleDeletePost"
              v-if="isPostOwner || isAdmin"
              class="absolute-center h-10 mb-2 select-none hover:text-button cursor-pointer"
            >
              Xoá
            </p>
            <p
              v-if="isPostOwner"
              class="absolute-center h-10 mb-2 select-none hover:text-button cursor-pointer"
            >
              Chỉnh sửa
            </p>
            <p
              v-if="!isPostOwner"
              @click.stop="handleToggleReportForm"
              class="absolute-center h-10 select-none hover:text-button cursor-pointer"
            >
              Báo cáo
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- content  -->
    <div
      id="content"
      class="md:w-[60%] w-[80%] my-6 mx-auto h-fit"
      v-html="postData?.content"
    ></div>

    <div class="w-full h-14 flex items-center mx-4 mb-2 cursor-pointer">
      <div
        @click.stop="activeLike"
        class="w-[150px] h-[50px] bg-main flex absolute-center rounded-lg select-none"
      >
        <div
          class="animate__animated"
          :class="{ animate__heartBeat: isLiked, active: isLiked }"
        >
          <VueButton
            :buttonType="isLiked ? 'heart-active' : 'heart'"
            :styles="isLiked ? 'active' : ''"
          />
        </div>
        <span class="mx-2">Thích</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import VueButton from "@/components/VueButton.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepository = repositoryFactory.get("posts");
const userRepository = repositoryFactory.get("users");

import { USER_UPDATE } from "@/constants";

export default {
  components: {
    VueButton,
  },
  setup(_, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const postData = ref(null);

    const isPostOwner = ref(false);
    const isAdmin = ref(false);

    const bookmarkButton = ref(null);
    const dropDown = ref(null);

    const isDropdown = ref(false);
    const wasBookmarked = ref(false);
    const isLiked = ref(false);
    const params = computed(() => route.params.postTypes);
    const app = document.querySelector("#app");

    const profile = store.getters["user/getProfile"];
    const { user_name } = profile;

    const fetchPost = async () => {
      try {
        const res = await postRepository.getPost(params.value);
        if (res?.data.success) {
          postData.value = res.data.post;

          //define post owner:
          isPostOwner.value = user_name === postData.value?.author_name;
          isAdmin.value = user_name === "admin";
        } else {
          //handle 404 page
          console.log("not found post");
          router.push({ name: "notFound" });
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleBookmark = async () => {
      wasBookmarked.value = !wasBookmarked.value;
      const { _id } = postData.value;
      if (wasBookmarked.value) {
        //add bookmark
        try {
          const res = await userRepository.addBookmarkPost(user_name, {
            id: _id,
          });
          //bookmark fail => assign wasBookmarked state is false
          if (!res?.data.success) {
            wasBookmarked.value = false;
          } else {
            //update vue store
            profile.bookmark_posts.push(_id);
            await store.dispatch(`user/${USER_UPDATE}`, profile);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        //remove bookmark
        try {
          const res = await userRepository.removeBookmarkPost(user_name, {
            id: _id,
          });
          //remove bookmark fail => reverse wasBookmarked state
          if (!res?.data.success) {
            wasBookmarked.value = !wasBookmarked.value;
          } else {
            //update vue store
            profile.bookmark_posts = profile.bookmark_posts.filter(
              (postId) => postId !== _id
            );
            await store.dispatch(`user/${USER_UPDATE}`, profile);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    const activeLike = async () => {
      isLiked.value = !isLiked.value;
      const { _id } = postData.value;
      try {
        //add like post
        if (isLiked.value) {
          const res = await userRepository.addLikePost(user_name, { id: _id });
          //if like api failed => reverse state
          if (!res?.data.success) {
            isLiked.value = false;
          } else {
            //update vue store
            profile.like_list.push(_id);
            await store.dispatch(`user/${USER_UPDATE}`, profile);
          }
        }
        //remove like post
        else {
          const res = await userRepository.removeLikePost(user_name, {
            id: _id,
          });
          //if remove fail
          if (!res?.data.success) {
            isLiked.value = !isLiked.value;
          } else {
            //update vue store
            profile.like_list = profile.like_list.filter(
              (postId) => postId !== _id
            );
            await store.dispatch(`user/${USER_UPDATE}`, profile);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const activeBookmarkAndLike = () => {
      const { bookmark_posts, like_list } = profile;
      if (bookmark_posts?.find((postId) => postId === postData.value?._id)) {
        wasBookmarked.value = true;
      }
      if (like_list?.find((postId) => postId === postData.value?._id)) {
        isLiked.value = true;
      }
    };

    //active bookmarked & like button
    watch(postData, () => {
      activeBookmarkAndLike();
    });

    const handleDropdown = () => {
      if (!isDropdown.value) {
        dropDown.value.classList.add("animate__fadeIn");
        dropDown.value.classList.remove("hidden", "animate__fadeOut");
      } else {
        dropDown.value.classList.add("animate__fadeOut", "hidden");
        dropDown.value.classList.remove("animate__fadeIn");
      }
      isDropdown.value = !isDropdown.value;
    };

    const handleClickToApp = () => {
      isDropdown.value = false;
      dropDown.value.classList.add("animate__fadeOut", "hidden");
      dropDown.value.classList.remove("animate__fadeIn");
    };

    const handleDeletePost = async () => {
      if (window.confirm("Chắc chứ bạn?")) {
        if (window.confirm("Vẫn là chắc chứ? nhưng nó là lần 2 🤡")) {
          if (
            window.confirm(
              "Tôi nghĩ bạn không chắc lắm, lần cuối nào, chắc không 🐧?"
            )
          ) {
            try {
              const res = await postRepository.deletePost({
                slug: postData?.value.slug,
              });
              if (res?.data.success) {
                window.alert("Xoá thành công!");
                router.push({ name: "home" });
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    };

    const handleToggleReportForm = () => {
      emit("handleReport", {
        toggle: true,
        post_id: postData.value._id,
        post_slug: postData.value.slug,
      });
    };

    onMounted(() => {
      //add events
      app.addEventListener("click", handleClickToApp);
      //scroll to top:
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    onUnmounted(() => {
      app.removeEventListener("click", handleClickToApp);
    });

    // fetch post to get data:
    fetchPost();
    //active bookmark & like button:
    activeBookmarkAndLike();

    return {
      postData,
      handleBookmark,
      bookmarkButton,
      wasBookmarked,
      handleDropdown,
      dropDown,
      isPostOwner,
      isAdmin,
      activeLike,
      isLiked,
      handleDeletePost,
      handleToggleReportForm,
    };
  },
};
</script>

<style lang="scss">
#content {
  h1 {
    @apply font-bold text-lg;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    @apply my-4;
  }
  p {
    @apply my-2;
    img {
      @apply rounded-md overflow-hidden shadow-lg w-3/4 mx-auto;
    }
  }
}
.active {
  @apply text-red-500;
}
</style>
