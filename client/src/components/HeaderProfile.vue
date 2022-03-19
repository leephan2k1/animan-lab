<template>
  <div
    class="w-full lg:h-[40%] rounded-xl min-h-[300px] bg-white flex flex-col items-center"
  >
    <!-- content wrapper  -->
    <div class="w-1/2 h-full flex flex-col items-center justify-center">
      <!-- avatar -->
      <div class="md:w-40 md:h-40 w-28 h-28 mt-4 rounded-full overflow-hidden">
        <div
          class="w-full h-full bg-center bg-cover bg-no-repeat"
          :style="{
            backgroundImage: `url(${require('@/assets/images/defaultAvatar.jpg')})`,
          }"
        ></div>
      </div>
      <!-- usr name  -->
      <div class="w-full h-fit">
        <p class="text-center text-gray-600 text-xl font-bold">Admin</p>
      </div>
      <!-- level  -->
      <div class="w-full h-fit">
        <p class="text-center text-gray-600 text-lg">Cấp bậc: Wibu thuỷ tổ</p>
      </div>
      <!-- achievements  -->
      <div class="w-full h-fit">
        <p class="text-center text-gray-600 text-lg">
          Nghiên cứu đã viết: 50 | Lượt like: 100
        </p>
      </div>
    </div>

    <!-- profile navigation  -->
    <nav class="grid-1200 wide h-fit">
      <ul class="w-[85%] lg:w-3/4 mx-auto h-full grid grid-cols-4 lg:mt-0 mt-6">
        <router-link
          class="cursor-pointer md:my-0 my-2 text-gray-500 col-span-2 md:col-span-1 text-center absolute-center"
          :class="{ active: currentPath === 'profilePosts' }"
          :to="{ name: 'profilePosts' }"
        >
          Nghiên cứu đã viết
        </router-link>
        <router-link
          class="cursor-pointer md:my-0 my-2 text-gray-500 col-span-2 md:col-span-1 text-center absolute-center"
          :class="{ active: currentPath === 'profileAchievements' }"
          :to="{ name: 'profileAchievements' }"
        >
          Thành tích
        </router-link>
        <router-link
          class="cursor-pointer md:my-0 my-2 text-gray-500 col-span-2 md:col-span-1 text-center absolute-center"
          :class="{ active: currentPath === 'profilePending' }"
          :to="{ name: 'profilePending' }"
        >
          Chờ kiểm định
        </router-link>
        <router-link
          class="cursor-pointer md:my-0 my-2 text-gray-500 col-span-2 md:col-span-1 text-center absolute-center"
          :class="{ active: currentPath === 'profileWaifu' }"
          :to="{ name: 'profileWaifu' }"
        >
          Danh sách waifu
        </router-link>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const currentPath = computed(() => route.name);

    return { currentPath };
  },
};
</script>

<style scoped lang="scss">
.active {
  @apply text-gray-800 relative;
  &::before {
    @apply content-[""] absolute -bottom-1 rounded-full left-[50%] translate-x-[-50%] w-[30%] h-1 bg-button;
  }
}
</style>
