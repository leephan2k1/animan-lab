<template>
  <div class="my-4 h-[30%]">
    <div class="w-full my-2 flex items-center justify-between">
      <!-- title  -->
      <router-link
        class="border-l-4 border-button px-2 flex items-center cursor-pointer hover:text-button"
        :to="{ name: 'short', params: { shortType: 'animans' } }"
      >
        <h1 class="text-sm font-semibold uppercase">
          {{ title }}
        </h1>
        <VueButton buttonType=">" />
      </router-link>
      <!-- nav  -->
      <div class="flex pr-4">
        <div
          @click="swp.slidePrev()"
          class="cursor-pointer absolute-center ml-4 w-7 h-w-7 rounded-md bg-white hover:scale-125 transition-all"
        >
          <VueButton buttonType="<" />
        </div>
        <div
          @click="swp.slideNext()"
          class="cursor-pointer absolute-center ml-4 w-7 h-w-7 rounded-md bg-white hover:scale-125 transition-all"
        >
          <VueButton buttonType=">" />
        </div>
      </div>
    </div>
    <!-- slide  -->
    <SwiperContainer
      :slidesPerGroup="2"
      :space-between="0"
      @swiper="onSwiper"
      :breakpoints="breakpoints"
      v-if="data && data.length > 0"
    >
      <!-- card item  -->
      <swiper-slide
        class="absolute-center h-full"
        v-for="(post, index) in data"
        :key="post?.id || index"
      >
        <!-- image  -->
        <router-link
          :to="{ name: 'short', params: { shortType: post?.slug } }"
          class="overflow-hidden rounded-xl shadow-xl w-4/5 lg:w-3/4 lg:h-[230px] h-[180px] bg-white bg-center bg-cover bg-no-repeat flex flex-col justify-between cursor-pointer"
          :style="{
            backgroundImage: `url(${post?.images_url[0]})`,
          }"
        >
          <!-- avatar  -->
          <router-link
            :to="{
              name: 'profileAchievements',
              params: { username: post?.author_id.user_name },
            }"
            class="w-full m-2"
          >
            <div
              :style="{
                backgroundImage: `url(${avatarHandler(post?.author_id)})`,
              }"
              class="w-8 h-8 rounded-full overflow-hidden bg-center bg-cover bg-no-repeat"
            ></div>
          </router-link>
          <p
            class="text-sm rounded-b-xl whitespace-nowrap text-ellipsis w-full max-h-[40px] overflow-hidden p-2 text-white bg-black/40 backdrop-blur-md"
          >
            {{ post?.author_id.user_name }}
          </p>
        </router-link>
      </swiper-slide>

      <!-- loader  -->
    </SwiperContainer>

    <!-- loader  -->
    <SwiperContainer
      :slidesPerGroup="2"
      :space-between="0"
      @swiper="onSwiper"
      :breakpoints="breakpoints"
      v-if="data.length === 0"
    >
      <swiper-slide
        class="absolute-center h-full"
        v-for="item in testItems"
        :key="item"
      >
        <div class="w-4/5 h-full rounded-2xl overflow-hidden absolute-center">
          <content-loader
            viewBox="0 0 400 460"
            :speed="1"
            primaryColor="#f3f3f3"
            secondaryColor="#dedede"
          >
            <rect x="8" y="-36" rx="2" ry="2" width="400" height="531" />
          </content-loader>
        </div>
      </swiper-slide>
    </SwiperContainer>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";

import VueButton from "@/components/VueButton.vue";
import { ContentLoader } from "vue-content-loader";

import { avatarHandler } from "@/utils/userHandler";

import repositoryFactory from "@/api/repositoryFactory";
const postRepo = repositoryFactory.get("posts");

export default {
  components: {
    SwiperContainer: Swiper,
    SwiperSlide,
    VueButton,
    ContentLoader,
  },
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    const swp = ref(null);
    const data = ref([]);
    const testItems = [...Array(12).keys()];

    const onSwiper = (swiper) => {
      swp.value = swiper;
    };

    const breakpoints = {
      1: {
        slidesPerView: 2,
      },
      350: {
        slidesPerView: 3,
      },
      640: {
        slidesPerView: 4,
      },
      860: {
        slidesPerView: 5,
      },
    };

    const fetchData = async () => {
      try {
        const params = {
          sort: "desc",
          limit: 12,
          tags: "short",
          populate: true,
        };

        const res = await postRepo.searchPost(params);

        if (res?.data.success) {
          data.value = res.data.posts.docs; 
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    return {
      avatarHandler,
      onSwiper,
      swp,
      breakpoints,
      testItems,
      data,
    };
  },
};
</script>
