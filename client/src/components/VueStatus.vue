<template>
  <div class="w-full h-full">
    <div class="w-full min-h-[600px] h-fit mt-4 flex flex-col items-center">
      <template v-if="data?.length > 0 && data && !isString(data)">
        <div
          v-for="(post, index) in data"
          :key="post?._id || index"
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
                class="w-[80%] h-[80%] md:h-[95%] rounded-xl bg-center bg-cover bg-no-repeat"
                :style="{
                  backgroundImage: `url(${post?.images_url[0]})`,
                }"
              ></div>
            </div>
            <!-- content interact  -->
            <div class="w-[30%] h-full flex flex-col justify-center">
              <div
                @click="handleLikeButton"
                ref="likeButton"
                class="animate__animated cursor-pointer mt-8 w-10 h-10 rounded-full bg-main absolute-center"
                :class="{
                  animate__heartBeat: isActiveLike,
                  active: isActiveLike,
                }"
              >
                <VueButton
                  :buttonType="isActiveLike ? 'heart-active' : 'heart'"
                  :styles="isActiveLike ? 'active' : ''"
                />
              </div>
              <div
                class="cursor-pointer mt-8 w-10 h-10 rounded-full bg-main absolute-center"
              >
                <VueButton buttonType="chat" />
              </div>
            </div>
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

import VueButton from "@/components/VueButton.vue";

import { isString } from "@/utils/checkType";
import { avatarHandler } from "@/utils/userHandler";

import { ContentLoader } from "vue-content-loader";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

export default {
  components: {
    VueButton,
    ContentLoader,
    InfiniteLoading,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  setup() {
    const isActiveLike = ref(false);
    const likeButton = ref(null);

    const handleLikeButton = () => {
      isActiveLike.value = !isActiveLike.value;
    };

    return {
      isActiveLike,
      handleLikeButton,
      likeButton,
      isString,
      avatarHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.active {
  @apply text-red-500;
}
</style>
