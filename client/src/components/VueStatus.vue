<template>
  <div class="w-full h-full relative">
    <ImageReview
      :triggerOpenImageReview="triggerOpenImageReview"
      :imageURL="urlImageReview"
    />

    <!-- comment  -->
    <PostComment
      styles="lg:w-1/2 md:w-3/4 w-[85%] fixed top-[10%] left-1/2 -translate-x-1/2"
      :isOpenComment="commentAppear"
      :postId="postId"
      :postSlug="postSlug"
    />

    <div class="w-full min-h-[600px] h-fit mt-4 flex flex-col items-center">
      <template v-if="data?.length > 0 && data && !isString(data)">
        <div
          v-for="(post, index) in data"
          :key="post?._id || index"
          :data-id="post?._id"
          class="shadow-xl lg:w-[50%] md:w-[70%] w-[80%] lg:h-[650px] md:h-[500px] h-[450px] bg-white rounded-xl overflow-hidden mb-4"
        >
          <!-- info  -->
          <div class="w-full h-[15%] flex lg:mb-0 mb-0 md:mb-4">
            <!-- avatar  -->
            <div class="md:w-[15%] w-[25%] h-full flex items-center pl-5">
              <div
                class="w-10 h-10 rounded-full bg-center bg-cover bg-no-repeat"
                :style="{
                  backgroundImage: `url(${avatarHandler(post.author_id)})`,
                }"
              ></div>
            </div>
            <!-- info detail  -->
            <div
              class="md:w-[85%] w-[75%] h-20 overflow-hidden text-gray-600 flex flex-col justify-center"
            >
              <p class="h-1/2 mt-2 flex items-center text-lg font-bold">
                {{ post?.author_name }}
              </p>
              <p class="h-1/2 w-[80%] text-sm post-title overflow-hidden">
                {{ post?.content }}
              </p>
            </div>
          </div>

          <!-- content  -->
          <div class="w-full h-[85%] flex">
            <!-- content image  -->
            <div class="w-[70%] h-full md:h-[95%] absolute-center">
              <div
                @click.stop="handleOpenImageReview(_, post?.images_url[0])"
                class="cursor-pointer w-[80%] h-[80%] md:h-[95%] rounded-xl bg-center bg-cover bg-no-repeat"
                :style="{
                  backgroundImage: `url(${post?.images_url[0]})`,
                }"
              ></div>
            </div>
            <!-- content interact  -->
            <StatusInteract
              :postId="post?._id"
              :slug="post?.slug"
              @openComment="handleOpenComment"
            />
          </div>
        </div>
        <infinite-loading
          class="lg:w-[50%] md:w-[70%] w-[80%] h-fit absolute-center"
          v-bind="$attrs"
        >
          <template #spinner>
            <content-loader
              viewBox="0 0 400 460"
              :speed="1"
              primaryColor="#f3f3f3"
              secondaryColor="#dedede"
            >
              <circle cx="31" cy="31" r="15" />
              <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
              <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
              <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
            </content-loader>
          </template>
          <template #complete>
            <span>Hiền giả đã lướt bài viết hôm nay, mai quay lại nhé!</span>
          </template>
        </infinite-loading>
      </template>
    </div>
  </div>
</template>

<script>
//animate__pulse
import { ref } from "vue";

import StatusInteract from "@/components/StatusInteract.vue";
import ImageReview from "@/components/ImageReview.vue";
import PostComment from "@/components/PostComment.vue";

import { isString } from "@/utils/checkType";
import { avatarHandler } from "@/utils/userHandler";

import { ContentLoader } from "vue-content-loader";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

export default {
  components: {
    ContentLoader,
    InfiniteLoading,
    StatusInteract,
    PostComment,
    ImageReview,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  setup() {
    const isActiveLike = ref(false);

    const triggerOpenImageReview = ref(false);
    const commentAppear = ref(false);
    const urlImageReview = ref("");
    const postId = ref("");
    const postSlug = ref("");

    const handleOpenImageReview = (_, url) => {
      triggerOpenImageReview.value = !triggerOpenImageReview.value;
      urlImageReview.value = url;
    };

    const handleOpenComment = (obj) => {
      postId.value = obj?.id;
      postSlug.value = obj?.slug;
      commentAppear.value = !commentAppear.value;
    };

    return {
      isActiveLike,
      triggerOpenImageReview,
      urlImageReview,
      commentAppear,
      postId,
      postSlug,
      isString,
      avatarHandler,
      handleOpenImageReview,
      handleOpenComment,
    };
  },
};
</script>
