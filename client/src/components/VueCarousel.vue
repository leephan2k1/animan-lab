<template>
  <div class="my-4">
    <div class="w-full my-2 flex items-center justify-between">
      <!-- title  -->
      <router-link
        class="border-l-4 border-button px-2 flex items-center cursor-pointer hover:text-button"
        :to="{ name: 'short' }"
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
    >
      <template v-if="data && data.length">
        <swiper-slide
          class="absolute-center"
          v-for="item in testItems"
          :key="item"
        >
          <!-- card item  -->
          <div
            class="overflow-hidden rounded-xl shadow-xl w-4/5 lg:w-3/4 lg:h-[230px] h-[180px] bg-white bg-center bg-cover bg-no-repeat flex flex-col justify-between cursor-pointer"
            :style="{
              backgroundImage: `url(${require('@/assets/images/anime-girl-sky.png')})`,
            }"
          >
            <div class="w-full m-2">
              <div
                :style="{
                  backgroundImage: `url(https://cdn.dribbble.com/users/642793/screenshots/17616403/media/3ce69a229fb30af0cd324dc940ad94a8.png)`,
                }"
                class="w-8 h-8 rounded-full overflow-hidden bg-center bg-cover bg-no-repeat"
              ></div>
            </div>
            <p
              class="text-sm rounded-b-xl whitespace-nowrap text-ellipsis w-full max-h-[40px] overflow-hidden p-2 text-white bg-black/40 backdrop-blur-md"
            >
              User name
            </p>
          </div>
        </swiper-slide>
      </template>
      <!-- loader  -->
      <template v-else>
        <swiper-slide
          class="absolute-center"
          v-for="item in testItems"
          :key="item"
        >
          <!-- card item  -->
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
      </template>
    </SwiperContainer>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";

import VueButton from "@/components/VueButton.vue";
import { ContentLoader } from "vue-content-loader";

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

    return {
      onSwiper,
      swp,
      breakpoints,
      testItems,
      data,
    };
  },
};
</script>
