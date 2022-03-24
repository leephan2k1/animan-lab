<template>
  <div class="w-full min-h-[300px] lg:min-h-[300px] md:min-h-[600px] h-fit">
    <NewPost v-if="posType === 'new-post' && isLogged" />
    <PostDetails v-if="posType !== 'new-post'" />
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import NewPost from "@/components/NewPost.vue";
import PostDetails from "@/components/PostDetails.vue";

export default {
  components: {
    NewPost,
    PostDetails,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const isLogged = ref();
    const posType = computed(() => route.params.postTypes);

    const validateParams = () => {
      if (posType.value === "new-post") {
        isLogged.value = store.getters["auth/isAuthenticated"];
        if (!isLogged.value) {
          router.push({ name: "login" });
        }
      }
    };
    // just accept create post for logged user
    validateParams();
    return { posType, isLogged };
  },
};
</script>
