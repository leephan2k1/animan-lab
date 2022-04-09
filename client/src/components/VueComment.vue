<template>
  <div class="w-3/4 min-h-[52px] h-fit md:ml-2 rounded-3xl absolute-center">
    <div
      class="w-full min-h-[52px] h-fit px-4 rounded-3xl border-[1px] overflow-hidden border-gray-500 md:text-base text-sm md:py-0 flex items-center"
    >
      <p class="w-full h-full">
        {{ item?.content }}
      </p>
    </div>
    <div
      class="w-10 h-10 flex flex-col justify-center items-center md:ml-4 ml-2"
    >
      <button
        @click.stop="activeLike"
        class="animate__animated"
        :class="{ animate__heartBeat: isLiked, active: isLiked }"
      >
        <VueButton
          :buttonType="isLiked ? 'heart-active' : 'heart'"
          :styles="isLiked ? 'active' : ''"
        />
      </button>
      <p
        :key="likeCount"
        class="animate__animated animate__faster animate__fadeInUp px-2 md:text-base text-sm"
      >
        {{ handleNumberLikeCount(likeCount) }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import VueButton from "@/components/VueButton.vue";

import { useStore } from "vuex";
import { useRouter } from "vue-router";

import useComment from "@/hooks/comment";

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  components: {
    VueButton,
  },
  setup(props) {
    const isLiked = ref(false);
    const likeCount = ref(props.item.like);

    const comment = useComment();
    const router = useRouter();
    const store = useStore();
    const isLogged = store.getters["auth/isAuthenticated"];

    const fetchActiveLike = () => {
      if (isLogged) {
        const profile = store.getters["user/getProfile"];
        const like_list = profile.like_comments;
        if (like_list.find((item) => item === props.item._id)) {
          isLiked.value = true;
        }
      }
    };

    const activeLike = async () => {
      if (!isLogged) {
        router.push({ name: "login" });
        return;
      }

      isLiked.value = !isLiked.value;
      const { _id } = props.item;

      if (isLiked.value) {
        isLiked.value = await comment.like(_id);
        likeCount.value++;
      }
      //remove like comment
      else {
        isLiked.value = !(await comment.unLike(_id));
        likeCount.value--;
      }
    };

    const handleNumberLikeCount = (like) => {
      if (like > 9999) {
        return "9999+";
      }
      return like;
    };

    fetchActiveLike();

    return { activeLike, isLiked, likeCount, handleNumberLikeCount };
  },
};
</script>
