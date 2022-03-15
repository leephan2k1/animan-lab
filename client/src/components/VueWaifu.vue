<template>
  <div
    class="w-full"
    :class="{ 'h-screen': fakeData.length < 5, 'h-fit': fakeData.length > 5 }"
  >
    <div class="w-full h-[50px] flex items-center">
      <div class="absolute-center border-[1px] border-gray-400 p-2 mt-2 rounded-xl cursor-pointer hover:text-button">
        <VueButton buttonType="plus" />
        <span class="mx-4">Thêm waifu</span>
      </div>
    </div>

    <div class="mt-4 w-full grid grid-cols-4 gap-4">
      <!-- list render  -->
      <div
        v-for="item in fakeData"
        :key="item"
        class="lg:col-span-1 col-span-2 absolute-center"
      >
        <div
          class="w-[200px] h-[300px] bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <!-- image  -->
          <div
            class="w-full h-[85%] bg-center bg-cover bg-no-repeat"
            :style="{
              backgroundImage:
                'url(https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx132405-Iy6Lze5SOme8.jpg)',
            }"
          >
          <div class="w-full h-[50px] flex justify-end">
            <div class="m-2 cursor-pointer hover:text-red-400">
              <VueButton buttonType="trash" />
            </div>
          </div>
          </div>
          <!-- title  -->
          <div class="w-full h-[15%] absolute-center">
            <p>My Dress-Up Darling</p>
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

  setup() {
    const fakeData = [...Array(2).keys()];

    return { fakeData };
  },
};
</script>
