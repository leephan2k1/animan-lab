<template>
  <div class="w-full h-[600px] mt-11">
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
    <!-- contents  -->
    <div class="w-full h-full flex flex-col items-center">
      <!-- list rank  -->
      <div
        v-for="(item, index) in fakeData"
        :key="item"
        class="w-[80%] lg:w-[50%] h-[20%] bg-white rounded-xl shadow-xl my-2 flex cursor-pointer"
      >
        <!-- rank  -->
        <div class="basis-1/6 absolute-center">
          <VueButton buttonType="hash" styles="text-button" />
          <span class="text-2xl text-button">{{ index + 1 }}</span>
        </div>
        <div class="basis-5/6 flex items-center">
          <!-- avatar  -->
          <div
            class="w-10 h-10 lg:w-16 lg:h-16 bg-red-500 rounded-full bg-center bg-cover bg-no-repeat"
            :style="{
              backgroundImage: `url(${require('@/assets/images/defaultAvatar.jpg')})`,
            }"
          ></div>
          <!-- user name & points -->
          <div>
            <p class="px-4 lg:text-lg">User name</p>
            <p class="px-4 lg:text-lg">Points: 1000</p>
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
    const fakeData = [...Array(5).keys()];

    return { fakeData };
  },
};
</script>
