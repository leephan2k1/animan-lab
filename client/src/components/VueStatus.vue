<template>
  <div class="w-full md:h-[600px] h-[450px] mt-4 absolute-center">
    <div
      class="shadow-xl lg:w-[50%] lg:h-full md:w-[70%] md:h-[90%] w-[80%] h-full bg-white rounded-xl overflow-hidden"
    >
      <!-- info  -->
      <div class="w-full h-[15%] flex">
        <!-- avatar  -->
        <div class="md:w-[15%] w-[25%] h-full flex items-center pl-5">
          <div
            class="w-10 h-10 rounded-full bg-center bg-cover bg-no-repeat"
            :style="{
              backgroundImage: `url(${require('@/assets/images/defaultAvatar.jpg')})`,
            }"
          ></div>
        </div>
        <!-- info detail  -->
        <div
          class="md:w-[85%] w-[75%] h-20 overflow-hidden text-gray-600 flex flex-col justify-center"
        >
          <p class="h-1/2 mt-2 flex items-center text-lg font-bold">
            User name
          </p>
          <p class="h-1/2 w-[80%] text-sm post-title overflow-hidden">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
            nobis esse cumque consequuntur earum asperiores delectus libero,
            voluptatum, optio nihil officia excepturi voluptate aut minima
            voluptates magni dolorum commodi quaerat?
          </p>
        </div>
      </div>

      <!-- content  -->
      <div class="w-full h-[85%] md:mt-0 mt-4 flex items-center">
        <!-- content image  -->
        <div class="w-[70%] h-full absolute-center">
          <div
            class="w-[80%] h-[80%] md:h-[95%] rounded-xl bg-center bg-cover bg-no-repeat"
            :style="{
              backgroundImage: `url(${require('@/assets/images/anime-girl-sky.png')})`,
            }"
          ></div>
        </div>
        <!-- content interact  -->
        <div class="w-[30%] h-full flex flex-col justify-center">
          <div
            @click="handleLikeButton"
            ref="likeButton"
            class="animate__animated cursor-pointer mt-8 w-10 h-10 rounded-full bg-main absolute-center"
            :class="{ animate__heartBeat: isActiveLike, active: isActiveLike }"
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
  </div>
</template>

<script>
//animate__pulse
import { ref } from "vue";

import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },

  setup() {
    const isActiveLike = ref(false);
    const likeButton = ref(null);

    const handleLikeButton = () => {
      isActiveLike.value = !isActiveLike.value;
      console.log(isActiveLike.value);
    };

    return { isActiveLike, handleLikeButton, likeButton };
  },
};
</script>

<style lang="scss" scoped>
.active {
  @apply text-red-500;
}
</style>
