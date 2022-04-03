<template>
  <div class="w-[30%] h-full flex flex-col justify-center">
    <div
      @click.stop="handleLikeButton"
      ref="likeButton"
      class="animate__animated cursor-pointer mt-8 w-10 h-10 rounded-full bg-main absolute-center"
      :class="{
        animate__heartBeat: isActiveLike,
        active: isActiveLike,
      }"
    >
      <VueButton
        :buttonType="isActiveLike ? 'heart-active' : 'heart'"
        :styles="isActiveLike ? 'active' : ''"
      />
    </div>
    <div
      @click.stop="handleCommentButton"
      class="cursor-pointer mt-8 w-10 h-10 rounded-full bg-main absolute-center"
    >
      <VueButton buttonType="chat" />
    </div>
  </div>
</template>

<script>
import VueButton from "@/components/VueButton.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import usePost from "@/hooks/post";

export default {
  components: {
    VueButton,
  },
  props: {
    postId: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const post = usePost();

    const isLogged = store.getters["auth/isAuthenticated"];

    const isActiveLike = ref(false);

    let profile;
    if (isLogged) {
      profile = store.getters["user/getProfile"];
    } 

    //active like
    (function () {
      const { like_list } = profile;
      if (like_list.find((postId) => postId === props.postId)) {
        isActiveLike.value = true;
      }
    })();

    const handleLikeButton = async () => {
      if (!isLogged) {
        router.push({ name: "login" });
        return;
      }
      isActiveLike.value = !isActiveLike.value;

      //add like
      if (isActiveLike.value) {
        isActiveLike.value = await post.likePost(
          isActiveLike.value,
          profile,
          "",
          props.postId
        );
      }
      //remove like
      else {
        isActiveLike.value = await post.removeLikePost(
          isActiveLike.value,
          profile,
          "",
          props.postId
        );
      }
    };

    const handleCommentButton = () => {
      if (!isLogged) {
        router.push({ name: "login" });
        return;
      }
    };

    return { isActiveLike, handleLikeButton, handleCommentButton };
  },
};
</script>

<style lang="scss" scoped>
.active {
  @apply text-red-500;
}
</style>
