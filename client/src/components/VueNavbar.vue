<template>
  <div class="container mx-auto h-20">
    <div class="w-full h-full flex items-center justify-around">
      <div @click.stop="handleClick" class="md:pl-0 pl-4 basis-1/5 lg:hidden">
        <VueButton buttonType="menu" styles="text-gray-500" />
      </div>
      <div
        class="lg:basis-1/5 basis-2/5 lg:pl-0 pl-6 font-logo text-4xl select-none whitespace-nowrap"
      >
        <span class="px-2">Animan Lab</span>
      </div>
      <nav
        class="basis-2/5 font-black text-gray-400 md:text-sm lg:text-lg whitespace-nowrap antialiased w-[500px] lg:block hidden"
      >
        <ul class="flex items-center justify-around cursor-pointer">
          <router-link
            class="nav-element min-w-1/4 px-2 transition-all duration-300"
            :class="{ active: currentPath === 'home' }"
            :to="{ name: 'home' }"
          >
            Trang chủ
          </router-link>
          <router-link
            class="nav-element min-w-1/4 px-2 transition-all duration-300"
            :class="{ active: currentPath === 'anime' }"
            :to="{ name: 'anime' }"
          >
            Anime docs
          </router-link>
          <router-link
            class="nav-element min-w-1/4 px-2 transition-all duration-300"
            :class="{ active: currentPath === 'manga' }"
            :to="{ name: 'manga' }"
          >
            Manga docs
          </router-link>
          <router-link
            class="nav-element min-w-1/4 px-2 transition-all duration-300"
            :class="{ active: currentPath === 'short' }"
            :to="{ name: 'short' }"
          >
            Animan shorts
          </router-link>
        </ul>
      </nav>
      <div class="basis-2/5 flex justify-end pr-4 relative">
        <div
          class="w-10 h-10 bg-white justify-end items-center rounded-xl mr-4 cursor-pointer lg:flex hidden shadow-lg pr-2 transition-all"
          @click.stop="handleClickOpenSearch"
          ref="searchBtn"
        >
          <input
            v-if="toggleSearch"
            class="w-3/4"
            type="text"
            placeholder="Tìm kiếm..."
          />
          <VueButton buttonType="search" styles="text-gray-500" />
        </div>
        <NavbarProfile />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";

import VueButton from "@/components/VueButton.vue";
import NavbarProfile from "@/components/NavbarProfile.vue";
import { NAVBAR_CONTENTS } from "@/constants";

export default {
  components: {
    VueButton,
    NavbarProfile,
  },
  setup(_, { emit }) {
    const handleClick = () => {
      emit("activeSidebar");
    };
    const searchBtn = ref(null);
    const app = document.querySelector("#app");
    const toggleSearch = ref(false);
    const route = useRoute();
    let currentPath = computed(() => route.name);


    const handleClickOpenSearch = () => {
      searchBtn.value.classList.remove("w-10", "justify-end");
      searchBtn.value.classList.add("w-48", "justify-center");
      toggleSearch.value = true;
    };

    const handleClickCloseSearch = () => {
      searchBtn.value.classList.add("w-10", "justify-end");
      searchBtn.value.classList.remove("w-48", "justify-center");
      toggleSearch.value = false;
    };

    onMounted(() => {
      app.addEventListener("click", handleClickCloseSearch);
    });

    onUnmounted(() => {
      app.removeEventListener("click", handleClickCloseSearch);
    });

    return {
      handleClick,
      handleClickOpenSearch,
      searchBtn,
      toggleSearch,
      NAVBAR_CONTENTS,
      currentPath,
    };
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
