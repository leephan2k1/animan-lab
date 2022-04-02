<template>
  <div
    ref="commentsDOM"
    class="w-[80%] lg:w-3/4 min-h-[620px] md:min-h-[650px] lg:min-h-[600px] h-fit bg-white border-[1px] border-gray-500 absolute top-[5%] left-1/2 -translate-x-1/2 rounded-xl overflow-hidden shadow-xl animate__animated animate__faster hidden z-40"
  >
    <!-- nav control  -->
    <div class="w-full h-[50px] flex items-center justify-end">
      <button
        @click.stop="handleCloseComments"
        class="w-7 h-7 border-[1px] border-gray-500 rounded-full absolute-center mr-4"
      >
        <VueButton />
      </button>
    </div>

    <!-- create comment  -->
    <div class="w-full min-h-[60px] absolute-center">
      <!-- login message  -->
      <p v-if="!isLogged" class="md:text-lg text-center">
        <router-link
          class="text-button"
          target="_blank"
          :to="{ name: 'login' }"
        >
          Đăng nhập
        </router-link>
        để phản biện nghiên cứu...
      </p>
      <!-- comment create  -->
      <div
        v-else
        class="w-full h-[130px] flex items-center justify-center relative"
      >
        <!-- user avatar  -->
        <div
          :style="{
            backgroundImage: `url(${avatarHandler(profile)})`,
          }"
          class="md:w-16 w-12 md:h-16 h-12 rounded-full bg-black mr-2 bg-center bg-cover bg-no-repeat"
        ></div>
        <!-- comment box  -->
        <div
          class="w-3/4 h-1/2 md:ml-2 rounded-3xl absolute-center overflow-hidden"
        >
          <div
            class="w-full h-4/5 rounded-3xl overflow-hidden border-[1px] border-gray-500 absolute-center"
          >
            <input
              ref="inputDOM"
              class="w-[85%] h-full pr-4 rounded-3xl"
              type="text"
              placeholder="Nhập bình luận...."
              v-model="commentContents"
              @keyup="handleCreateComment"
              @click.stop="isOpenEmoji = false"
            />
            <button @click.stop="handleToggleEmoji" class="h-15% h-full">
              <VueButton buttonType="smile" />
            </button>
          </div>
        </div>
        <!-- emoji box  -->
        <div
          v-if="isOpenEmoji"
          class="absolute top-24 md:left-[55%] left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden"
        >
          <VuemojiPicker @emojiClick="handleEmojiClick" />
        </div>
      </div>
    </div>
    <!-- container  -->
    <div
      v-if="commentsData && commentsData.length > 0 && !isString(commentsData)"
      class="w-full h-[450px] overflow-y-scroll"
    >
      <!-- comments list  -->
      <div
        v-for="(item, index) in commentsData"
        :key="item?._id || index"
        class="w-full min-h-[75px] h-fit flex items-center justify-center"
      >
        <!-- user avatar  -->
        <div
          class="md:w-20 w-16 md:h-20 h-16 flex flex-col items-center justify-center"
        >
          <div
            :style="{
              backgroundImage: `url(${avatarHandler(item?.author_id)})`,
            }"
            class="md:w-12 w-10 md:h-12 h-10 rounded-full bg-black bg-center bg-cover bg-no-repeat"
          ></div>
          <p
            class="text-[13px] whitespace-nowrap text-ellipsis overflow-hidden"
          >
            {{ item?.author_id.user_name }}
          </p>
        </div>
        <!-- comment box  -->
        <div
          class="w-3/4 min-h-[52px] h-fit md:ml-2 rounded-3xl absolute-center"
        >
          <div
            class="w-full min-h-[52px] h-fit px-4 rounded-3xl border-[1px] overflow-hidden border-gray-500 md:text-base text-sm md:py-0 flex items-center"
          >
            <p class="w-full h-full post-desc">
              {{ item?.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- loading list  -->
    <div v-else class="w-full h-[450px] overflow-y-scroll">
      <div
        v-for="item in fakeData"
        :key="item"
        class="w-full h-[25%] overflow-hidden"
      >
        <ContentLoader viewBox="0 0 400 160">
          <rect x="110" y="21" rx="4" ry="4" width="254" height="6" />
          <rect x="111" y="41" rx="3" ry="3" width="185" height="7" />
          <rect x="304" y="-46" rx="3" ry="3" width="350" height="6" />
          <rect x="371" y="-45" rx="3" ry="3" width="380" height="6" />
          <rect x="484" y="-45" rx="3" ry="3" width="201" height="6" />
          <circle cx="48" cy="48" r="25" />
        </ContentLoader>
      </div>
    </div>
    <!-- empty list  -->
    <div
      v-if="commentsData && isString(commentsData) && commentsData === 'empty'"
      class="w-full h-[450px] overflow-y-scroll"
    ></div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import VueButton from "@/components/VueButton.vue";
import { VuemojiPicker } from "vuemoji-picker";
import { useToast } from "vue-toastification";
import { ContentLoader } from "vue-content-loader";

import { avatarHandler } from "@/utils/userHandler";
import { BLACKLIST } from "@/constants";

import { isString } from "@/utils/checkType";
import { isExactMatch } from "@/utils/stringHandler";

import useComment from "@/hooks/comment";

export default {
  components: {
    VueButton,
    VuemojiPicker,
    ContentLoader,
  },
  props: {
    isOpenComment: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const isLogged = computed(() => {
      return store.getters["auth/isAuthenticated"];
    });
    const profile = ref(store.getters["user/getProfile"]);
    const fakeData = [...Array(12).keys()];
    const comment = useComment();
    const route = useRoute();
    const toast = useToast();
    const TOAST_OPTION = {
      position: "top-center",
      timeout: 2500,
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

    const isActiveComment = ref(false);
    const activeFromProps = computed(() => props.isOpenComment);
    const isOpenEmoji = ref(false);

    const commentContents = ref("");
    const commentsDOM = ref(null);
    const inputDOM = ref(null);
    const commentsData = ref([]);

    const app = document.querySelector("#app");
    const overlay = document.createElement("div");
    overlay.classList.add(
      "w-full",
      "h-full",
      "absolute",
      "top-0",
      "left-0",
      "bg-overlay",
      "z-30"
    );

    watch(activeFromProps, () => {
      handleOpenComment();
    });

    const handleToggleEmoji = () => {
      isOpenEmoji.value = !isOpenEmoji.value;
    };

    const handleEmojiClick = (e) => {
      commentContents.value += ` ${e.unicode}`;
      commentContents.value = commentContents.value.trim();

      isOpenEmoji.value = false;
    };

    const handleCreateComment = async (e) => {
      if (e.key === "Enter") {
        const slug = route.params.postTypes;
        let content = commentContents.value;
        let valid = true;
        content = content.trim();

        if (content.length < 3) {
          toast.error("Bình luận phải có ít nhất 3 ký tự!", TOAST_OPTION);
          valid = false;
        }

        BLACKLIST.forEach((word) => {
          if (isExactMatch(content, word)) {
            toast.error("Bình luận có chứa ngôn từ tục tĩu!", TOAST_OPTION);
            valid = false;
          }
        });

        if (!valid) return;

        const state = await comment.create(content, slug);
        if (state) {
          toast.success(
            "Bình luận thành công! sẽ được chờ phê duyệt",
            TOAST_OPTION
          );
          //reset value:
          commentContents.value = "";
        }
      }
    };

    const fetchComment = async () => {
      const post = document.querySelector("#post");
      const { id } = post.dataset;
      const params = {
        postId: id,
        sort: "desc",
        limit: 10,
      };
      const data = await comment.getAll(params);
      //post has 0 comment
      if (data.docs.length === 0) {
        commentsData.value = "empty";
      } else {
        commentsData.value = data.docs;
      } 
    };

    const handleOpenComment = () => {
      isActiveComment.value = true;

      commentsDOM.value.classList.add("animate__fadeIn");
      commentsDOM.value.classList.remove("animate__fadeOut", "hidden");
 
      inputDOM.value.focus();

      window.scrollTo({ top: 30, behavior: "smooth" });
      app.appendChild(overlay);
    };

    const handleCloseComments = () => {
      isActiveComment.value = false;
      commentsDOM.value.classList.remove("animate__fadeIn");
      commentsDOM.value.classList.add("animate__fadeOut");
      setTimeout(() => {
        commentsDOM.value.classList.add("hidden");
      }, 500);
      app.removeChild(overlay);
    };

    onMounted(() => {
      overlay.addEventListener("click", handleCloseComments);
    });

    onUnmounted(() => {
      overlay.removeEventListener("click", handleCloseComments);
      if (overlay) {
        overlay.remove();
      }
    });

    fetchComment();

    return {
      isString,
      handleToggleEmoji,
      handleCreateComment,
      handleEmojiClick,
      isLogged,
      isOpenEmoji,
      fakeData,
      avatarHandler,
      profile,
      handleCloseComments,
      commentsDOM,
      inputDOM,
      commentContents,
      commentsData,
    };
  },
};
</script>

<style lang="scss">
emoji-picker {
  @apply md:w-[400px] md:h-[350px] w-[90%] h-[300px] mx-auto rounded-xl;
}
</style>
