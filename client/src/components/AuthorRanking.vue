<template>
  <div class="w-full h-[400px] mt-11 mb-4">
    <!-- title  -->
    <div
      class="border-l-4 border-button px-2 flex items-center cursor-pointer hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">
        {{ title }}
      </h1>
      <VueButton buttonType=">" />
    </div>
    <!-- contents  -->
    <div class="w-full h-full absolute-center flex-wrap gap-4">
      <!-- list rank  -->
      <div
        v-for="(item, index) in fakeData"
        :key="item"
        class="w-[40%] h-[30%] bg-white rounded-xl shadow-xl flex cursor-pointer"
      >
        <!-- rank  -->
        <div class="basis-1/6 absolute-center">
          <VueButton buttonType="hash" styles="text-button" />
          <span class="text-2xl text-button">{{ index + 1 }}</span>
        </div>
        <div class="basis-5/6 flex md:flex-row flex-col items-center justify-center md:justify-start">
          <!-- avatar  -->
          <div>
            <div
              class="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-center bg-cover bg-no-repeat"
              :style="{
                backgroundImage: `url(${require('@/assets/images/defaultAvatar.jpg')})`,
              }"
            ></div>
          </div>
          <!-- user name & points -->
          <div class="overflow-hidden">
            <p class="px-2 text-[12px] md:text-lg lg:text-lg">User name</p>
            <p class="px-2 text-[12px] md:text-lg lg:text-lg">Points: 1000</p>
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
  setup() {
    const fakeData = [...Array(4).keys()];

    return { fakeData };
  },
};
</script>
