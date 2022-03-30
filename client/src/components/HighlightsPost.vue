<template>
  <div class="w-full md:h-[400px] h-[500px]">
    <div
      class="select-none border-l-4 border-button px-2 flex items-center hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">
        {{ title }}
      </h1>
    </div>
    <div class="my-3 w-full h-[90%] flex md:flex-row flex-col">
      <!-- big frame  -->
      <template
        v-if="postsData && postsData?.length && !isEmptyObject(postsData[0])"
      >
        <div class="basis-3/5 h-full absolute-center md:justify-start">
          <router-link
            :to="{ name: 'post', params: { postTypes: postsData[0]?.slug } }"
            :style="{
              backgroundImage: `url(${postsData[0]?.images_url[0]})`,
            }"
            class="w-[95%] md:w-[90%] h-full lg:ml-6 rounded-2xl shadow-2xl bg-white bg-cover bg-center bg-no-repeat flex items-end overflow-hidden cursor-pointer"
          >
            <div
              class="px-4 text-white rounded-b-2xl w-full max-h-[80px] bg-black/40 backdrop-blur-md flex flex-col"
            >
              <h2
                class="post-title max-h-[56px] overflow-hidden lg:text-lg basis-2/3"
              >
                {{ postsData[0].title }}
              </h2>
              <p class="basis-1/3 text-sm pb-1">
                {{ postsData[0].author_name }} |
                {{ convertISODate(postsData[0].createdAt) }}
              </p>
            </div>
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="basis-3/5 h-full absolute-center md:justify-start">
          <ContentLoader
            class="w-full h-full absolute-center"
            viewBox="0 0 550 400"
            backgroundColor="#f0f0f0"
            foregroundColor="#dedede"
          >
            <rect x="43" y="304" rx="4" ry="4" width="271" height="9" />
            <rect x="44" y="323" rx="3" ry="3" width="119" height="6" />
            <rect x="42" y="77" rx="10" ry="10" width="550" height="217" />
          </ContentLoader>
        </div>
      </template>

      <div
        class="basis-2/5 md:w-[30%] h-full flex justify-center md:flex-col md:items-center md:mt-0 md:justify-around mt-2 gap-4"
      >
        <template
          v-if="
            postsData &&
            postsData?.length &&
            !isEmptyObject(postsData[1]) &&
            !isEmptyObject(postsData[2])
          "
        >
          <router-link
            v-for="(item, index) in skipFirstElem(postsData)"
            :key="item?.id || index"
            :to="{ name: 'post', params: { postTypes: item?.slug } }"
            class="md:w-full w-[45%] lg:w-[80%] md:basis-1/2 rounded-2xl shadow-2xl lg:mr-6 bg-cover bg-center bg-no-repeat flex justify-center items-end cursor-pointer"
            :style="{
              backgroundImage: `url(${item.images_url[0]})`,
            }"
          >
            <div
              class="px-4 text-white rounded-b-2xl w-full max-h-[50px] bg-black/40 backdrop-blur-md flex flex-col"
            >
              <h2
                class="h-[50%] max-w-full overflow-hidden whitespace-nowrap text-ellipsis lg:text-lg md:text-base text-[15px]"
              >
                {{ item?.title }}
              </h2>
              <p class="text-[10px] md:text-sm h-[50%] pb-1">
                {{ item.author_name }} | {{ convertISODate(item.createdAt) }}
              </p>
            </div>
          </router-link>
        </template>
        <template v-else>
          <div
            v-for="item in fakeData"
            :key="item"
            class="md:w-full w-[45%] lg:w-[80%] h-[50%] md:basis-1/2 rounded-2xl lg:mr-6 absolute-center overflow-hidden"
          >
            <ContentLoader
              viewBox="0 0 450 400"
              backgroundColor="#f0f0f0"
              foregroundColor="#dedede"
            >
              <rect x="43" y="304" rx="4" ry="4" width="271" height="9" />
              <rect x="44" y="323" rx="3" ry="3" width="119" height="6" />
              <rect x="42" y="77" rx="10" ry="10" width="388" height="217" />
            </ContentLoader>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { ContentLoader } from "vue-content-loader";

import repositoryFactory from "@/api/repositoryFactory";
const postRepository = repositoryFactory.get("posts");

import { isEmptyObject } from "@/utils/checkType";
import { convertISODate } from "@/utils/dateHandler";

export default {
  components: {
    ContentLoader,
  },
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    const postsData = ref([]);
    const fakeData = [...Array(2).keys()];

    const fetchHighlightPosts = async () => {
      try {
        const params = {
          limit: 3,
          sortlike: "desc",
        };
        const res = await postRepository.searchPost(params);
        if (res?.data.success) {
          postsData.value = res?.data.posts.docs;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const skipFirstElem = (arr) => {
      return arr.slice(1, arr.length);
    };

    fetchHighlightPosts();
    return {
      postsData,
      fakeData,
      isEmptyObject,
      convertISODate,
      skipFirstElem,
    };
  },
};
</script>
