<template>
  <div
    class="w-full min-h-[400px] h-fit bg-white rounded-lg shadow-md flex flex-col z-0"
  >
    <template
      v-if="postData && !isEmptyObject(postData) && !isEmptyObject(postOwner)"
    >
      <h1 class="lg:pl-7 p-4 text-2xl font-bold">
        {{ postData?.title }}
      </h1>
      <!-- author  -->
      <div class="w-full h-16 md:h-20 flex justify-between">
        <div class="lg:w-[35%] w-[80%] h-full flex">
          <div class="md:ml-0 ml-2 w-1/3 h-full absolute-center cursor-pointer">
            <router-link
              :to="{
                name: 'profileAchievements',
                params: { username: postData?.author_name },
              }"
              target="_blank"
              :style="{
                backgroundImage: `url(${postOwner?.avatar})`,
              }"
              class="w-11 h-11 rounded-full bg-center bg-cover bg-no-repeat overflow-hidden"
            ></router-link>
          </div>

          <div class="w-2/3 h-full flex flex-col justify-center">
            <router-link
              :to="{
                name: 'profileAchievements',
                params: { username: postData?.author_name },
              }"
              class="font-bold md:text-[16px] text-[10px] w-fit p-[3px] rounded-lg cursor-pointer"
            >
              {{ postData?.author_name }}
            </router-link>
            <router-link
              :to="{
                name: 'profileAchievements',
                params: { username: postData?.author_name },
              }"
              target="_blank"
              class="md:text-[15px] text-[10px] border-[1px] border-button w-fit p-[3px] rounded-lg cursor-pointer"
            >
              {{ computeRoleName(postOwner.points) }}
            </router-link>
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
              <router-link
                :to="{
                  name: 'editPost',
                  params: { postTypes: 'editor' },
                }"
                v-if="isPostOwner"
                @click.stop="handleEditPost"
                class="absolute-center h-10 mb-2 select-none hover:text-button cursor-pointer"
              >
                Chỉnh sửa
              </router-link>
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

      <!-- tags  -->
      <p class="w-full mx-4 mb-2">Tags:</p>
      <div class="w-full min-h-14 h-fit flex flex-wrap mx-4 mb-2">
        <router-link
          v-for="(tag, index) in postData.tags"
          :key="tag || index"
          :to="{ name: 'general', params: { general: tag } }"
          :class="tagColor(TAG_COLORS, index)"
          class="absolute-center w-fit px-4 mx-4 h-10 rounded-lg text-white"
        >
          {{ tag }}
        </router-link>
      </div>

      <!-- Interactive  -->
      <div class="w-full h-14 flex items-center justify-between mx-4 mb-2">
        <div
          @click.stop="activeLike"
          class="w-[150px] h-[50px] bg-main flex absolute-center rounded-lg select-none cursor-pointer"
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
        <div
          @click.stop="activeComment"
          class="w-[150px] h-[50px] bg-main flex absolute-center rounded-lg select-none cursor-pointer mr-6"
        >
          <div class="animate__animated">
            <VueButton buttonType="chat" />
          </div>
          <span class="mx-2">Bình luận</span>
        </div>
      </div>
    </template>
    <div v-else>
      <ContentLoader viewBox="0 0 400 460">
        <circle cx="31" cy="31" r="15" />
        <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
        <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
        <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
      </ContentLoader>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import { useHead } from "@vueuse/head";

import VueButton from "@/components/VueButton.vue";
import { ContentLoader } from "vue-content-loader";

import repositoryFactory from "@/api/repositoryFactory";
const postRepository = repositoryFactory.get("posts");
const userRepository = repositoryFactory.get("users");

import { isEmptyObject } from "@/utils/checkType";
import { tagColor } from "@/utils/postHandler";
import computeRoleName from "@/utils/computeLevelName";

import usePost from "@/hooks/post";

export default {
  components: {
    VueButton,
    ContentLoader,
  },
  setup(_, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const post = usePost();
    const postData = ref(null);

    const postOwner = ref({});
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

    useHead({
      title: computed(() => postData.value?.title),
      meta: [
        {
          name: "description",
          content: computed(() => postData.value?.title),
        },
        {
          property: "og:description",
          content: computed(() => postData.value?.title),
        },
        {
          property: "og:url",
          content: computed(() => window.location.href),
        },
        {
          property: "og:image",
          content: computed(() => postData.value?.images_url[0]),
        },
        {
          property: "og:site_name",
          content: "Animan Lab",
        },
      ],
    });

    onUnmounted(() => {
      useHead({
        title: "Animan Lab",
        meta: [
          {
            name: "description",
            content: "Animan Lab",
          },
          {
            property: "og:description",
            content: "Animan Lab",
          },
          {
            property: "og:url",
            content: computed(() => window.location.href),
          },
          {
            property: "og:image",
            content: computed(() => require("@/assets/images/thumbnail.png")),
          },
          {
            property: "og:site_name",
            content: "Animan Lab",
          },
        ],
      });
    });

    const TAG_COLORS = [
      "bg-button",
      "bg-green-400",
      "bg-cyan-400",
      "bg-violet-400",
      "bg-fuchsia-400",
    ];

    const fetchPost = async () => {
      try {
        const res = await postRepository.getPost(params?.value);

        if (res?.data.success) {
          postData.value = res.data.post;

          //assign id to DOM:
          const postDOM = document.querySelector("#post");
          if (postDOM) {
            postDOM.setAttribute("data-id", postData.value?._id);
          }

          //emit state to parent post:
          emit("dataReady", true);

          //define post owner:
          isPostOwner.value = user_name === postData.value?.author_name;
          isAdmin.value = user_name === "admin";
          //get detail info owner:
          const resOwner = await userRepository.getUser(
            postData.value?.author_name
          );
          if (resOwner?.data.success) {
            postOwner.value = resOwner?.data.user;
          }
        } else {
          //handle 404 page
          const privatePost = await postRepository.getPrivatePost(
            params?.value
          );
          if (privatePost?.data.success) {
            postData.value = privatePost.data.post;
            //define post owner:
            isPostOwner.value = user_name === postData.value?.author_name;
            isAdmin.value = user_name === "admin";
            //get detail info owner:
            const resOwner = await userRepository.getUser(
              postData.value?.author_name
            );
            if (resOwner?.data.success) {
              postOwner.value = resOwner?.data.user;
            }
          } else {
            console.log("not found post");
            router.push({
              name: "notFound",
              params: {
                pathMatch: route.path.split("/").slice(1),
              },
              query: route.query,
              hash: route.hash,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleEditPost = () => {
      emit("editPost", postData.value);
    };

    const handleBookmark = async () => {
      wasBookmarked.value = !wasBookmarked.value;
      const { _id } = postData.value;
      if (wasBookmarked.value) {
        //add bookmark
        wasBookmarked.value = await post.bookmarkPost(
          wasBookmarked.value,
          profile,
          user_name,
          _id
        );
      } else {
        //remove bookmark
        wasBookmarked.value = await post.removeBookmarkPost(
          wasBookmarked.value,
          profile,
          user_name,
          _id
        );
      }
    };

    const activeLike = async () => {
      isLiked.value = !isLiked.value;
      const { _id } = postData.value;
      //add like post
      if (isLiked.value) {
        isLiked.value = await post.likePost(
          isLiked.value,
          profile,
          user_name,
          _id
        );
      }
      //remove like post
      else {
        isLiked.value = await post.removeLikePost(
          isLiked.value,
          profile,
          user_name,
          _id
        );
      }
    };

    const activeComment = () => {
      emit("openComment", true);
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
      //set window title:
      document.title = postData.value?.title;
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

    const handleDeletePost = async () => {
      await post.deletePost(postData.value?.slug);
    };

    const handleClickToApp = () => {
      isDropdown.value = false;
      dropDown.value?.classList.add("animate__fadeOut", "hidden");
      dropDown.value?.classList.remove("animate__fadeIn");
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
      //set window title:
      document.title = postData.value?.title;
    });

    onUnmounted(() => {
      app.removeEventListener("click", handleClickToApp);
      //reset title:
      document.title = "Animan Lab";
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
      activeComment,
      handleDropdown,
      dropDown,
      isPostOwner,
      postOwner,
      isAdmin,
      activeLike,
      isLiked,
      handleDeletePost,
      handleToggleReportForm,
      isEmptyObject,
      handleEditPost,
      computeRoleName,
      tagColor,
      TAG_COLORS,
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
