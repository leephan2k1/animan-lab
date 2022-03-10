<template>
  <div class="grid-1200 wide h-screen overflow-x-hidden">
    <VueNavbar />
    <VueSidebar />
    <slot />
  </div>
</template>

<script>
import VueNavbar from "@/components/VueNavbar.vue";
import VueSidebar from "@/components/VueSidebar.vue";

export default {
  components: {
    VueNavbar,
    VueSidebar,
  },
  setup() {
    return {};
  },
};
</script>
