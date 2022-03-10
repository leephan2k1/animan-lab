<template>
  <div class="bg-white lg:hidden h-screen w-1/2 absolute left-0 top-0">
    <div class="flex flex-col">
      <div class="w-full h-fit absolute-center mt-10">
        <div class="w-2/3 border-[1px] border-gray-700 rounded-xl p-2 flex">
          <input
            type="text"
            placeholder="tìm kiếm..."
            class="w-[90%] rounded-md"
          />
          <VueButton buttonType="search" />
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

  setup() {},
};
</script>
