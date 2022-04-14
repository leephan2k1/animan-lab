<template>
  <div class="w-3/4 min-h-[52px] h-fit md:ml-2 rounded-3xl absolute-center">
    <div
      class="w-full min-h-[52px] h-fit px-4 rounded-3xl border-[1px] overflow-hidden border-gray-500 md:text-base text-sm md:py-0 flex items-center"
    >
      <p v-if="!isEditing" class="w-full h-full">
        {{ item?.content }}
      </p>
      <input
        ref="inputEdit"
        class="w-full h-full"
        v-else
        type="text"
        @keyup="handleEditContent"
        :value="item?.content"
      />
    </div>
    <div
      class="w-10 h-13 flex flex-col justify-center items-center md:ml-4 ml-2"
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
      <!-- button  -->
      <button
        class="relative"
        @click.stop="toggleSelectBox"
        v-if="commentOwner"
      >
        <VueButton buttonType="dots-horizontal" />

        <div
          ref="selectBox"
          class="w-20 h-14 bg-white border-[1px] border-gray-400 rounded-lg absolute top-5 right-0 z-40 text-sm flex flex-col items-center justify-around animate__animated animate__faster hidden"
        >
          <p @click.stop="handleEditComment" class="hover:text-button">
            Chỉnh sửa
          </p>
          <p @click.stop="handleDeleteComment" class="hover:text-button">Xoá</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import VueButton from "@/components/VueButton.vue";
import { useToast } from "vue-toastification";

import { useStore } from "vuex";
import { useRouter } from "vue-router";

import useComment from "@/hooks/comment";

import { BLACKLIST } from "@/constants";
import { isExactMatch } from "@/utils/stringHandler";

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
    user: {
      type: Object,
      default: {},
    },
    activeComment: {
      type: Boolean,
    },
  },
  components: {
    VueButton,
  },
  setup(props, { emit }) {
    const isLiked = ref(false);
    const likeCount = ref(props.item.like);

    const comment = useComment();
    const router = useRouter();
    const store = useStore();
    const toast = useToast();
    const TOAST_OPTION = {
      position: "top-center",
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: true,
      closeButton: "button",
      icon: true,
      rtl: false,
    };
    const isLogged = store.getters["auth/isAuthenticated"];

    const selectBox = ref(null);
    const selectBoxIsOpen = ref(false);

    const commentOwner = ref(props.user?._id === props.item.author_id._id);

    const commentsDOM = document.querySelector("#comments");
    const activeCommentsDOM = computed(() => props.activeComment);

    const isEditing = ref(false);
    const inputEdit = ref(null);

    const handleEditComment = () => {
      isEditing.value = true;

      handleCloseSelectBox();

      //alert info
      alert("Bình luận sau khi chỉnh sửa sẽ quay về trạng thái chờ phê duyệt!");

      setTimeout(() => {
        inputEdit.value?.focus();
      }, 250);
    };

    const handleDeleteComment = async () => {
      const id = props.item._id;

      const state = await comment.delete_c(id);

      /* 
      wait a second!
      i can't write shorthand like 'if(state) {} else {}' bc state has undefined value!
      undefined value bc user selected 'cancel' in window.confirm!
      i don' want show error or success message when user select 'cancel'
      alright! don't complain this block of code below! hihi :> 
      */
      if (state === false) {
        toast.error("Oops! Có gì đó không ổn, vui lòng thử lại", TOAST_OPTION);
      }
      if (state === true) {
        toast.success("Xoá bình luận thành công!", TOAST_OPTION);
        //update comment list
        emit("refreshComment");
      }
    };

    const handleEditContent = async (e) => {
      //handle submit
      if (e.key === "Enter") {
        const id = props.item._id;
        const content = e.target.value.trim();
        let valid = true;

        //valid content
        BLACKLIST.forEach((word) => {
          if (isExactMatch(content, word)) {
            toast.error("Bình luận có chứa nội dung nhạy cảm!", TOAST_OPTION);
            valid = false;
            return;
          }
        });

        if (!valid) return;

        const state = await comment.update(id, content);
        if (state) {
          toast.success(
            "Bình luận thành công! đang chờ phê duyệt",
            TOAST_OPTION
          );
          //update comment list
          emit("refreshComment");
        } else {
          toast.error(
            "Oops! Có gì đó không ổn, vui lòng thử lại",
            TOAST_OPTION
          );
        }
      }
    };

    watch(activeCommentsDOM, () => {
      if (!activeCommentsDOM.value) {
        handleCloseSelectBox();
      }
      //reset editing state before
      else {
        isEditing.value = false;
      }
    });

    onMounted(() => {
      commentsDOM.addEventListener("click", handleCloseSelectBox);
    });

    onUnmounted(() => {
      commentsDOM.removeEventListener("click", handleCloseSelectBox);
    });

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

    const handleCloseSelectBox = () => {
      selectBoxIsOpen.value = false;

      selectBox.value?.classList.remove("animate__fadeInDown");
      selectBox.value?.classList.add("animate__fadeOutDown");
      setTimeout(() => {
        selectBox.value?.classList.add("hidden");
      }, 300);
    };

    const toggleSelectBox = () => {
      selectBoxIsOpen.value = !selectBoxIsOpen.value;

      if (selectBoxIsOpen.value) {
        selectBox.value?.classList.remove("hidden", "animate__fadeOutDown");
        selectBox.value?.classList.add("animate__fadeInDown");
      } else {
        selectBox.value?.classList.remove("animate__fadeInDown");
        selectBox.value?.classList.add("animate__fadeOutDown");
        setTimeout(() => {
          selectBox.value?.classList.add("hidden");
        }, 300);
      }
    };

    fetchActiveLike();

    return {
      handleEditComment,
      handleDeleteComment,
      handleEditContent,

      isEditing,
      isLiked,

      inputEdit,
      selectBox,
      activeLike,

      likeCount,
      handleNumberLikeCount,
      toggleSelectBox,

      commentOwner,
    };
  },
};
</script>
