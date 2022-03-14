<template>
  <div class="w-full h-full">
    <StatusCreator />
    <VueStatus v-for="item in fakeData" :key="item" />
  </div>
</template>

<script>
import StatusCreator from "@/components/StatusCreator.vue";
import VueStatus from "@/components/VueStatus.vue";

export default {
  components: {
    StatusCreator,
    VueStatus,
  },
  setup() {
    const fakeData = [...Array(10).keys()];

    return { fakeData };
  },
};
</script>
