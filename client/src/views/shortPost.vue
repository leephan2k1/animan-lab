<template>
  <div class="w-full h-full relative">
    <StatusCreator @openStatusEditor="handleOpenStatusEditor" />
    <StatusEditor :openEditor="triggerOpenEditor" />
    <VueStatus v-for="item in fakeData" :key="item" />
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

import StatusCreator from "@/components/StatusCreator.vue";
import StatusEditor from "@/components/StatusEditor.vue";
import VueStatus from "@/components/VueStatus.vue";

export default {
  components: {
    StatusCreator,
    VueStatus,
    StatusEditor,
  },
  setup() {
    const fakeData = [...Array(10).keys()];
    const triggerOpenEditor = ref(false);

    const handleOpenStatusEditor = () => {
      triggerOpenEditor.value = !triggerOpenEditor.value;
    };

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return { fakeData, handleOpenStatusEditor, triggerOpenEditor };
  },
};
</script>
