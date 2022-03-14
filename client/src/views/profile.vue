<template>
  <div class="w-full h-fit">
    <HeaderProfile @handleContentProfile="activeComponent" />
    <template
      v-if="
        currentComponent === 'myResearch' ||
        currentComponent === 'myPostPending'
      "
    >
      <VuePost v-if="fakeData.length > 0" />
      <div v-else class="w-full lg:h-[400px] h-[400px] md:h-[800px]">
        <div class="w-3/4 md:w-1/2 h-full mx-auto flex flex-col items-center">
          <h3 class="text-center text-xl text-gray-600 my-4">
            Hiện tại quý bửu đây chưa có công trình nghiên cứu nào. Hãy học tập,
            trao dồi kiến thức và thực hiện vài công trình nghiên cứu nào!
          </h3>
          <div
            class="h-10 w-10 border-[1px] border-gray-400 bg-white rounded-2xl cursor-pointer absolute-center hover:scale-110 transition-all"
          >
            <VueButton buttonType="pencil-alt" />
          </div>
        </div>
      </div>
    </template>
    <VueAchievements v-if="currentComponent === 'myAchievements'" />
    <VueWaifu v-if="currentComponent === 'myWaifu'" />
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from "vue";

import HeaderProfile from "@/components/HeaderProfile.vue";
import VuePost from "@/components/VuePost.vue";
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    HeaderProfile,
    VuePost,
    VueButton,
    VueWaifu: defineAsyncComponent(() =>
      import(/* webpackChunkName: "VueWaifu" */ "@/components/VueWaifu.vue")
    ),
    VueAchievements: defineAsyncComponent(() =>
      import(
        /* webpackChunkName: "VueAchievements" */ "@/components/VueAchievements.vue"
      )
    ),
  },
  setup() {
    const currentComponent = ref("myResearch");

    const fakeData = [1];

    const activeComponent = (message) => {
      currentComponent.value = message;
      console.log("hihi", message);
    };

    return { fakeData, activeComponent, currentComponent };
  },
};
</script>
