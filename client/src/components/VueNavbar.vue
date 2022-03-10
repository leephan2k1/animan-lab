<template>
  <div class="container mx-auto h-20">
    <div class="w-full h-full flex items-center justify-around">
      <div class="md:pl-0 pl-4 basis-1/5 lg:hidden">
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
          <li class="active">Trang chủ</li>
          <li>Anime news</li>
          <li>Manga news</li>
          <li>Quick view</li>
        </ul>
      </nav>
      <div class="basis-2/5 flex justify-end pr-4 relative">
        <div
          class="w-10 h-10 bg-white absolute-center rounded-xl mr-4 cursor-pointer lg:flex hidden shadow-lg"
        >
          <VueButton buttonType="search" styles="text-gray-500" />
        </div>
        <NavbarProfile />
      </div>
    </div>
  </div>
</template>

<script>
import VueButton from "@/components/VueButton.vue";
import NavbarProfile from "@/components/NavbarProfile.vue";

export default {
  components: {
    VueButton,
    NavbarProfile,
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
