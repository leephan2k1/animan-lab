<template>
  <div class="grid-1200 wide h-full overflow-x-hidden">
    <VueNavbar @activeSidebar="activeSidebar" />
    <VueSidebar :showSidebar="showSidebar" />
    <slot />
    <div
      @click="handleGoToTop"
      ref="goTopButton"
      class="hidden animate__animated animate__faster cursor-pointer fixed right-7 bottom-4 w-10 h-10 absolute-center rounded-full border-2 border-gray-400 bg-white"
    >
      <VueButton buttonType="up" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

import VueNavbar from "@/components/VueNavbar.vue";
import VueSidebar from "@/components/VueSidebar.vue";
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueNavbar,
    VueSidebar,
    VueButton,
  },
  setup() {
    const showSidebar = ref(false);
    const goTopButton = ref(null);

    const activeSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    const handleGoToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleButtonToTop = () => {
      if (window.pageYOffset > 30) {
        goTopButton.value.classList.remove("hidden", "animate__backOutDown");
        goTopButton.value.classList.add("animate__backInUp");
      } else {
        goTopButton.value.classList.add("animate__backOutDown");
        goTopButton.value.classList.remove("animate__backInUp");
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", handleButtonToTop);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleButtonToTop);
    });

    return { activeSidebar, showSidebar, handleGoToTop, goTopButton };
  },
};
</script>
