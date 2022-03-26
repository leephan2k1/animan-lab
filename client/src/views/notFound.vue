<template>
  <div
    class="w-3/4 mx-auto h-[600px] bg-white border-4 border-button rounded-xl overflow-hidden"
  >
    <div class="w-full h-full grid grid-cols-2 overflow-hidden">
      <div
        class="md:col-span-1 col-span-2 h-full flex flex-col items-center justify-center"
      >
        <h3 class="my-4 text-6xl text-center font-bold">404</h3>
        <p class="w-3/4 lg:w-[40%] my-4 text-center text-lg">
          Cảm ơn bạn đã giúp
          <span class="font-logo text-3xl">Animan Lab</span> Isekai đến một vùng
          đất mới. Tuy nhiên, ở đây không có gì đặc biệt. Hãy giúp Animan Lab
          quay lại thế giới cũ!
        </p>

        <router-link
          :to="{ name: 'home' }"
          class="w-[200px] h-[50px] rounded-3xl bg-button flex items-center justify-end"
        >
          <p class="mr-3 text-white">Quay về trang chủ</p>
          <div
            class="animate__animated animate__fadeInLeft animate__infinite w-10 h-10 rounded-full absolute-center bg-white mr-2"
          >
            <VueButton buttonType=">" />
          </div>
        </router-link>
      </div>
      <div class="md:flex hidden h-full absolute-center">
        <div
          :style="{
            backgroundImage: `url(${require('@/assets/images/zoro-lost.png')})`,
          }"
          class="w-full h-[60%] lg:h-[90%] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
        ></div>
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
