<template>
  <div class="w-full h-screen">
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

    return { currentPath };
  },
};
</script>
