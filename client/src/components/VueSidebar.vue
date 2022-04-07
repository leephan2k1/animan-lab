<template>
  <div
    ref="sidebar"
    class="bg-white hidden h-screen w-1/2 fixed left-0 top-0 animate__animated animate__faster z-[60]"
  >
    <div class="flex flex-col">
      <div class="w-full h-fit absolute-center justify-end pr-5 mt-5">
        <div
          @click="handleClick"
          class="w-8 h-8 absolute-center border-[1px] border-gray-700 rounded-full"
        >
          <VueButton />
        </div>
      </div>
      <div class="w-full h-fit absolute-center mt-5">
        <div class="w-2/3 border-[1px] border-gray-700 rounded-xl p-2 flex">
          <input
            type="text"
            placeholder="tìm kiếm..."
            class="w-[90%] rounded-md"
            v-focus
            @keyup="handleSearch"
          />
          <VueButton buttonType="search" />
        </div>
      </div>
      <div class="w-full h-fit absolute-center mt-5">
        <ul class="w-full text-gray-400">
          <router-link
            class="w-full absolute-center pt-4 md:pt-8 transition-all duration-300"
            :class="{ active: currentPath === 'home' }"
            @click.self="handleClick"
            :to="{ name: 'home' }"
          >
            Trang chủ
          </router-link>
          <router-link
            class="w-full absolute-center pt-4 md:pt-8 transition-all duration-300"
            :class="{ active: currentPath === 'anime' }"
            @click.self="handleClick"
            :to="{ name: 'general', params: { general: 'anime' } }"
          >
            Anime docs
          </router-link>
          <router-link
            class="w-full absolute-center pt-4 md:pt-8 transition-all duration-300"
            :class="{ active: currentPath === 'manga' }"
            @click.self="handleClick"
            :to="{ name: 'general', params: { general: 'manga' } }"
          >
            Manga docs
          </router-link>
          <router-link
            class="w-full absolute-center pt-4 md:pt-8 transition-all duration-300"
            :class="{ active: currentPath === 'short' }"
            @click.self="handleClick"
            :to="{ name: 'short', params: { shortType: 'animans' } }"
          >
            Animan shorts
          </router-link>
        </ul>
      </div>
    </div>
  </div>
  <div
    ref="overlay"
    @click.stop="handleClick"
    class="w-full h-full absolute top-0 left-0 bg-overlay z-40 hidden"
  ></div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },
  directives: {
    focus: {
      mounted: (el) => el.focus(),
    },
  },
  props: {
    showSidebar: {
      type: Boolean,
    },
  },
  setup(props) {
    const sidebar = ref(null);
    const overlay = ref(null);
    const route = useRoute();
    const router = useRouter();

    const currentPath = computed(() => {
      return route.params.general ? route.params.general : route.name;
    });

    //hidden sidebar
    const handleClick = () => {
      sidebar.value.classList.add("animate__fadeOutLeft");
      sidebar.value.classList.remove("animate__fadeInLeft");
      overlay.value.classList.add("hidden");
    };

    const handleSearch = (e) => {
      if (e.key === "Enter") {
        router.push({ name: "general", params: { general: e.target.value } });
        handleClick();
        e.target.value = "";
      }
    };

    //active sidebar from navbar
    watch(props, () => {
      sidebar.value.classList.add("animate__fadeInLeft");
      sidebar.value.classList.remove("animate__fadeOutLeft", "hidden");
      overlay.value.classList.remove("hidden");
    });

    return {
      handleClick,
      handleSearch,
      sidebar,
      overlay,
      currentPath,
    };
  },
};
</script>

<style scoped lang="scss">
.active {
  @apply text-gray-800 relative;
  &::before {
    @apply content-[""] absolute -bottom-1 rounded-full left-[50%] translate-x-[-50%] w-[30%] md:w-[10%] h-1 bg-button;
  }
}
</style>
