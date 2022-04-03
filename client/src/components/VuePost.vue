<template>
  <div class="w-full min-h-[150px] h-fit mt-7">
    <div v-if="isString(postData)">
      <h1 class="text-center" v-if="postData === 'bookmark empty'">
        Chưa có bài viết nào được bạn bookmark.
      </h1>
      <h1 class="text-center" v-if="postData === 'like list empty'">
        Chưa có bài viết nào được bạn like.
      </h1>
      <h1 class="text-center" v-if="postData === 'my posts empty'">
        Bạn chưa viết bài nào hoặc chưa được phê duyệt!.
      </h1>
    </div>
    <template v-if="postData?.length > 0 && postData && !isString(postData)">
      <router-link
        v-for="item in postData"
        :key="item?._id"
        :to="{ name: 'post', params: { postTypes: item.slug } }"
        class="w-full my-4 h-fit overflow-hidden grid grid-cols-3"
      >
        <div class="w-full h-full cursor-pointer col-span-1 absolute-center">
          <img
            class="w-[80%] max-h-[70%] md:max-h-[90%] rounded-xl"
            :src="item?.images_url[0]"
            alt="thumbnail"
          />
        </div>
        <div class="col-span-2 h-fit py-2 cursor-pointer">
          <!-- title  -->
          <h2
            class="pr-2 md:text-2xl text-lg lg:w-[80%] post-title overflow-hidden hover:text-button"
          >
            {{ item?.title }}
          </h2>
          <div class="pr-2 lg:w-[80%]">
            <div class="overflow-hidden post-desc">
              <p class="md:block hidden" v-html="item.plainText"></p>
            </div>
            <div class="w-full overflow-hidden whitespace-nowrap">
              <span class="text-[15px] text-gray-400 hover:text-button">{{
                item?.author_name
              }}</span>
              <span class="text-[15px] text-gray-400">
                | {{ convertISODate(item?.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </router-link>

      <infinite-loading
        v-if="title !== 'profileView'"
        class="absolute-center"
        v-bind="$attrs"
      >
        <template #spinner>
          <ContentLoader viewBox="0 0 400 200" title="Loading news...">
            <rect
              x="42.84"
              y="9.93"
              rx="5"
              ry="5"
              width="143.55"
              height="86.59"
            />
            <rect
              x="192.84"
              y="9.67"
              rx="0"
              ry="0"
              width="148.72"
              height="12.12"
            />
            <rect x="192.84" y="25.67" rx="0" ry="0" width="89" height="9" />

            <rect
              x="42.84"
              y="107"
              rx="5"
              ry="5"
              width="143.55"
              height="86.59"
            />
            <rect
              x="192.84"
              y="107"
              rx="0"
              ry="0"
              width="148.72"
              height="12.12"
            />
            <rect x="192.84" y="123" rx="0" ry="0" width="89" height="9" />
          </ContentLoader>
        </template>
        <template #complete>
          <span>Chúc mừng hiền giả đã nghiên cứu hết bài viết!</span>
        </template>
      </infinite-loading>
    </template>
    <div v-if="(postData?.length === 0 || !postData) && !isString(postData)">
      <div v-for="item in fakeData" :key="item">
        <ContentLoader viewBox="0 0 400 200" title="Loading news...">
          <rect
            x="42.84"
            y="9.93"
            rx="5"
            ry="5"
            width="143.55"
            height="86.59"
          />
          <rect
            x="192.84"
            y="9.67"
            rx="0"
            ry="0"
            width="148.72"
            height="12.12"
          />
          <rect x="192.84" y="25.67" rx="0" ry="0" width="89" height="9" />

          <rect x="42.84" y="107" rx="5" ry="5" width="143.55" height="86.59" />
          <rect
            x="192.84"
            y="107"
            rx="0"
            ry="0"
            width="148.72"
            height="12.12"
          />
          <rect x="192.84" y="123" rx="0" ry="0" width="89" height="9" />
        </ContentLoader>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";

import { ContentLoader } from "vue-content-loader";
import { computed } from "vue";

import { isString } from "@/utils/checkType";
import { convertISODate } from "@/utils/dateHandler";

export default {
  props: {
    title: {
      type: String,
    },
    postsData: {
      type: [Array, String],
    },
  },
  components: {
    ContentLoader,
    InfiniteLoading,
  },
  setup(props) {
    const title = computed(() => props.title);
    const postData = computed(() => props.postsData);
    const fakeData = [...Array(1).keys()];

    return {
      postData,
      convertISODate,
      fakeData,
      isString,
      title,
    };
  },
};
</script>
