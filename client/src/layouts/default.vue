<template>
  <div class="grid-1200 wide h-fit overflow-x-hidden">
    <VueNavbar @activeSidebar="activeSidebar" />
    <VueSidebar :showSidebar="showSidebar" />
    <slot />
  </div>
</template>

<script>
import { ref } from "vue";

import VueNavbar from "@/components/VueNavbar.vue";
import VueSidebar from "@/components/VueSidebar.vue";

export default {
  components: {
    VueNavbar,
    VueSidebar,
  },
  setup() {
    const showSidebar = ref(false);

    const activeSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    return { activeSidebar, showSidebar };
  },
};
</script>
