<template>
  <div
    ref="sidebar"
    class="bg-white hidden h-screen w-1/2 absolute left-0 top-0 animate__animated animate__faster z-30"
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
          />
          <VueButton buttonType="search" />
        </div>
      </div>
      <div class="w-full h-fit absolute-center mt-5">
        <ul class="w-full text-gray-400">
          <li class="w-full absolute-center pt-4 md:pt-8 active">Trang chủ</li>
          <li class="w-full absolute-center pt-4 md:pt-8">Anime news</li>
          <li class="w-full absolute-center pt-4 md:pt-8">Manga news</li>
          <li class="w-full absolute-center pt-4 md:pt-8">Quick view</li>
        </ul>
      </div>
    </div>
  </div>
  <div
    ref="overlay"
    @click.stop="handleClick"
    class="w-full h-full absolute top-0 left-0 bg-overlay z-20 hidden"
  >
    hihi
  </div>
</template>

<script>
// animate__animated animate__fadeOutLeft
import { ref, computed, onUpdated } from "vue";
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },
  props: {
    showSidebar: {
      type: Boolean,
    },
  },
  setup(props) {
    const sidebar = ref(null);
    const overlay = ref(null);
    const toggleSidebar = ref(false);
    let isActiveSidebar = computed(() => props.showSidebar);

    const handleClick = () => {
      toggleSidebar.value = true;
      if (toggleSidebar.value) {
        sidebar.value.classList.add("animate__fadeOutLeft");
        sidebar.value.classList.remove("animate__fadeInLeft");
        overlay.value.classList.add("hidden");
      }
    };

    onUpdated(() => {
      sidebar.value.classList.add("animate__fadeInLeft");
      sidebar.value.classList.remove("animate__fadeOutLeft");
      sidebar.value.classList.remove("hidden");
      overlay.value.classList.remove("hidden");
    });

    return { handleClick, sidebar, toggleSidebar, overlay };
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
