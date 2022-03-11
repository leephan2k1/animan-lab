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
          <li class="active min-w-1/4 px-2">Trang chủ</li>
          <li class="min-w-1/4 px-2">Anime docs</li>
          <li class="min-w-1/4 px-2">Manga docs</li>
          <li class="min-w-1/4 px-2">Animan sorts</li>
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
import { ref, onMounted, onUnmounted } from "vue";

import VueButton from "@/components/VueButton.vue";
import NavbarProfile from "@/components/NavbarProfile.vue";

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

    const handleClickOpenSearch = () => {
      searchBtn.value.classList.remove("w-10", "justify-end");
      searchBtn.value.classList.add("w-48", "justify-center");
      toggleSearch.value = true;
      console.log(toggleSearch.value);
    };

    const handleClickCloseSearch = () => {
      searchBtn.value.classList.add("w-10", "justify-end");
      searchBtn.value.classList.remove("w-48", "justify-center");
      toggleSearch.value = false;
      console.log(toggleSearch.value);
    };

    onMounted(() => {
      app.addEventListener("click", handleClickCloseSearch);
    });

    onUnmounted(() => {
      app.removeEventListener("click", handleClickCloseSearch);
    });

    return { handleClick, handleClickOpenSearch, searchBtn, toggleSearch };
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
