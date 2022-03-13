<template>
  <div class="w-full lg:h-[450px] h-[450px] md:h-[350px] my-4">
    <!-- title  -->
    <div
      class="select-none border-l-4 border-button px-2 flex items-center hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">
        {{ title }}
      </h1>
    </div>

    <!-- content wrapper -->
    <div class="grid grid-cols-4 h-full my-3">
      <!-- controller swiper  -->
      <div class="md:col-span-3 col-span-4 relative">
        <div
          @click="swp.slidePrev()"
          class="select-none cursor-pointer z-50 absolute absolute-center rounded-full hover:scale-75 transition-all w-10 h-10 border-2 border-gray-400 bg-white top-1/2"
        >
          <VueButton buttonType="<" />
        </div>
        <div
          @click="swp.slideNext()"
          class="select-none cursor-pointer z-50 absolute absolute-center rounded-full hover:scale-75 transition-all w-10 h-10 border-2 border-gray-400 bg-white top-1/2 right-0"
        >
          <VueButton buttonType=">" />
        </div>

        <!-- swiper -->
        <swiper
          class="w-full h-full"
          :slides-per-view="1"
          :space-between="50"
          :grabCursor="true"
          :loop="true"
          :effect="'creative'"
          :creativeEffect="{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }"
          :modules="modules"
          @swiper="onSwiper"
        >
          <swiper-slide class="absolute-center w-full h-full">
            <div
              class="w-[90%] h-full bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden flex flex-col justify-end"
              :style="{
                backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/02/romcom-anime-spring-april-2022.jpg)`,
              }"
            >
              <div
                class="px-4 text-white rounded-b-2xl w-full h-[100px] bg-black/40 backdrop-blur-md flex flex-col justify-center"
              >
                <h2
                  class="md:h-[50%] h-[70%] overflow-hidden w-full md:text-lg post-title flex items-center pt-4"
                >
                  6 RomCom Anime Coming in April 2022 Will Make Spring Filled
                  With Romance
                </h2>
                <p
                  class="md:h-[50%] h-[30%] pb-1 flex items-center md:text-base text-sm"
                >
                  User name | March 10, 2022
                </p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="absolute-center w-full h-full">
            <div
              class="w-[90%] h-full bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden flex flex-col justify-end"
              :style="{
                backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/03/arifureta-season-2-episode-9-thumbnail.png)`,
              }"
            >
              <div
                class="px-4 text-white rounded-b-2xl w-full h-[100px] bg-black/40 backdrop-blur-md flex flex-col justify-center"
              >
                <h2
                  class="md:h-[50%] h-[70%] overflow-hidden w-full md:text-lg post-title flex items-center pt-4"
                >
                  6 RomCom Anime Coming in April 2022 Will Make Spring Filled
                  With Romance
                </h2>
                <p
                  class="md:h-[50%] h-[30%] pb-1 flex items-center md:text-base text-sm"
                >
                  User name | March 10, 2022
                </p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="absolute-center w-full h-full">
            <div
              class="w-[90%] h-full bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden flex flex-col justify-end"
              :style="{
                backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/03/Kisekoi-09-20.png)`,
              }"
            >
              <div
                class="px-4 text-white rounded-b-2xl w-full h-[100px] bg-black/40 backdrop-blur-md flex flex-col justify-center"
              >
                <h2
                  class="md:h-[50%] h-[70%] overflow-hidden w-full md:text-lg post-title flex items-center pt-4"
                >
                  6 RomCom Anime Coming in April 2022 Will Make Spring Filled
                  With Romance
                </h2>
                <p
                  class="md:h-[50%] h-[30%] pb-1 flex items-center md:text-base text-sm"
                >
                  User name | March 10, 2022
                </p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="absolute-center w-full h-full">
            <div
              class="w-[90%] h-full bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden flex flex-col justify-end"
              :style="{
                backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/03/jujutsu-game-opening-mappa-eve.jpg)`,
              }"
            >
              <div
                class="px-4 text-white rounded-b-2xl w-full h-[100px] bg-black/40 backdrop-blur-md flex flex-col justify-center"
              >
                <h2
                  class="md:h-[50%] h-[70%] overflow-hidden w-full md:text-lg post-title flex items-center pt-4"
                >
                  6 RomCom Anime Coming in April 2022 Will Make Spring Filled
                  With Romance
                </h2>
                <p
                  class="md:h-[50%] h-[30%] pb-1 flex items-center md:text-base text-sm"
                >
                  User name | March 10, 2022
                </p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!-- category  -->
      <div
        class="md:col-span-1 col-span-4 grid grid-cols-2 gap-2 md:gap-0 md:flex flex-col text-lg items-center"
      >
        <h2 class="text-center col-span-2">Tags</h2>
        <div
          :style="{
            backgroundImage: `url(https://cdn.dribbble.com/users/2648505/screenshots/17548805/media/7baec254633283f78906f3d4d57824af.jpg)`,
          }"
          class="cursor-pointer category-item absolute-center w-full h-full md:h-[25%] col-span-1 rounded-2xl my-2 bg-center bg-cover bg-no-repeat overflow-hidden"
        >
          <span class="text-white z-20 uppercase font-bold">Anime</span>
        </div>
        <div
          :style="{
            backgroundImage: `url(${require('@/assets/images/manga.jpg')})`,
          }"
          class="cursor-pointer category-item absolute-center w-full h-full md:h-[25%] col-span-1 rounded-2xl my-2 bg-center bg-cover bg-no-repeat overflow-hidden"
        >
          <span class="text-white z-20 uppercase font-bold">Manga</span>
        </div>
        <div
          :style="{
            backgroundImage: `url(${require('@/assets/images/jp-culture.jpg')})`,
          }"
          class="cursor-pointer category-item absolute-center w-full h-full md:h-[25%] col-span-1 rounded-2xl my-2 bg-center bg-cover bg-no-repeat overflow-hidden"
        >
          <span class="text-white z-20 uppercase font-bold">Văn hoá JP</span>
        </div>
        <div
          :style="{
            backgroundImage: `url(${require('@/assets/images/character-love.png')})`,
          }"
          class="cursor-pointer category-item absolute-center w-full h-full md:h-[25%] col-span-1 rounded-2xl my-2 bg-center bg-cover bg-no-repeat overflow-hidden"
        >
          <span class="text-white z-20 uppercase font-bold">Nhân vật</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCreative } from "swiper";
import { ref } from "vue";

import "swiper/css/effect-creative";

import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    Swiper,
    SwiperSlide,
    VueButton,
  },
  props: {
    title: {
      type: String,
    },
  },
  setup() {
    const swp = ref(null);

    const onSwiper = (swiper) => {
      swp.value = swiper;
    };

    return {
      onSwiper,
      modules: [EffectCreative],
      swp,
    };
  },
};
</script>

<style lang="scss" scoped>
.category-item {
  @apply relative z-0;
  &::before {
    @apply content-[""] absolute w-full h-full top-0 left-0 bg-black/20 z-10;
  }
}
</style>
