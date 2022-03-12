<template>
  <div class="w-full h-[400px]">
    <div
      class="border-l-4 border-button px-2 flex items-center hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">
        {{ title }}
      </h1>
    </div>
    <div class="my-3 w-full h-[90%] flex md:flex-row flex-col">
      <div class="basis-3/5 h-full absolute-center">
        <div
          :style="{
            backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/03/%E3%80%90%E7%89%B9%E5%A0%B1%E3%80%91%E3%80%8C%E3%81%8B%E3%81%90%E3%82%84%E6%A7%98%E3%81%AF%E5%91%8A%E3%82%89%E3%81%9B%E3%81%9F%E3%81%84-%E3%82%A6%E3%83%AB%E3%83%88%E3%83%A9%E3%83%AD%E3%83%9E%E3%83%B3%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF-%E3%80%8D2022%E5%B9%B44%E6%9C%888%E6%97%A5%E6%94%BE%E9%80%81%E9%96%8B%E5%A7%8B%EF%BC%81-0-16-screenshot.png)`,
          }"
          class="w-[95%] md:w-[90%] h-[95%] rounded-2xl shadow-2xl bg-white bg-cover bg-center bg-no-repeat flex items-end overflow-hidden cursor-pointer"
        >
          <div
            class="px-4 text-white rounded-b-2xl w-full max-h-[80px] bg-white/30 backdrop-blur-md flex flex-col"
          >
            <h2
              class="post-title max-h-[56px] overflow-hidden lg:text-lg basis-2/3"
            >
              Kaguya-sama Phần 3: Ngày công chiếu ngày 8 tháng 4 và Đoạn giới
              thiệu mới Kaguya-sama
            </h2>
            <p class="basis-1/3 text-sm pb-1">User name | March 10, 2022</p>
          </div>
        </div>
      </div>
      <div
        class="basis-2/5 md:w-[30%] h-full flex justify-center md:flex-col md:items-center"
      >
        <div
          class="md:w-full w-[45%] lg:w-full md:basis-1/2 rounded-2xl shadow-2xl bg-red-800 md:mt-2 mr-2 lg:mr-6 bg-cover bg-center bg-no-repeat flex items-end cursor-pointer"
          :style="{
            backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/03/mushoku-s2.png)`,
          }"
        >
          <div
            class="px-4 text-white rounded-b-2xl w-full max-h-[50px] bg-white/30 backdrop-blur-md flex flex-col"
          >
            <h2 class="h-[50%] max-w-full overflow-hidden whitespace-nowrap text-ellipsis lg:text-lg md:text-base text-[15px]">
              Mushoku Tensei: Jobless Reincarnation Season 2 Officially
              Announced  
            </h2>
            <p class="text-[10px] md:text-sm h-[50%]  pb-1">User name | March 10, 2022</p>
          </div>
        </div>

        <div
          class="md:w-full w-[45%] lg:w-full md:basis-1/2 rounded-2xl shadow-2xl bg-red-800 md:mt-2 lg:mr-6 bg-cover bg-center bg-no-repeat flex items-end cursor-pointer"
          :style="{
            backgroundImage: `url(https://animecorner.me/wp-content/uploads/2022/03/magia-record.png)`,
          }"
        >
         <div
            class="px-4 text-white rounded-b-2xl w-full max-h-[50px] bg-white/30 backdrop-blur-md flex flex-col"
          >
            <h2 class="h-[50%] max-w-full overflow-hidden whitespace-nowrap text-ellipsis lg:text-lg md:text-base text-[15px]">
              Magia Record Finale to Air All 4 Episodes on April 3  
            </h2>
            <p class="text-[10px] md:text-sm h-[50%]  pb-1">User name | March 10, 2022</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueButton from "@/components/VueButton.vue";

export default {
  props: {
    title: {
      type: String,
    },
  },
  components: {
    VueButton,
  },
};
</script>

<style lang="scss" scoped>
.post-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}
</style>
