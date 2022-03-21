<template>
  <div class="w-full min-h-[300px] lg:min-h-[300px] md:min-h-[600px] h-fit">
    <NewPost />
  </div>
</template>

<script>
import NewPost from "@/components/NewPost.vue";

export default {
  components: {
    NewPost,
  },
  setup() {},
};
</script>
