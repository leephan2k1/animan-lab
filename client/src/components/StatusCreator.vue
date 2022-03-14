<template>
  <div class="w-full h-[80px] flex justify-center">
    <div class="md:w-[50%] w-[70%] h-full rounded-xl bg-white shadow-xl flex">
      <!-- avatar  -->
      <div class="w-[20%] md:ml-0 ml-2 h-full absolute-center">
        <div
          class="w-10 h-10 rounded-full bg-center bg-cover bg-no-repeat"
          :style="{
            backgroundImage: `url(${require('@/assets/images/defaultAvatar.jpg')})`,
          }"
        ></div>
      </div>
      <!-- input  -->
      <div class="w-[80%] lg:pr-6 absolute-center">
        <div
          class="flex items-center justify-evenly cursor-pointer w-[80%] h-[60%] lg:w-[90%] lg:h-[80%] lg:px-0 px-4 bg-main hover:bg-gray-300 rounded-xl"
        >
          <p class="lg:text-base md:text-[15px] text-[10px]">
            Hiền giả có điều gì muốn chia sẻ?
          </p>
          <div>
            <VueButton buttonType="pencil-alt" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },
};
</script>
