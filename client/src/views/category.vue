<template>
  <div
    :class="{ 'h-screen': fakeData.length < 2, 'h-fit': fakeData.length > 3 }"
    class="w-full z-10"
  >
    <h1 class="mt-2 uppercase text-lg">
      Trung tâm nghiên cứu về {{ currentPath }}
    </h1>
    <VuePost :title="'Học liệu ' + currentPath" />
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { computed } from "vue";

import VuePost from "@/components/VuePost.vue";

export default {
  components: {
    VuePost,
  },

  setup() {
    const route = useRoute();
    const currentPath = computed(() => route.name);

    const fakeData = [];

    return { currentPath, fakeData };
  },
};
</script>
