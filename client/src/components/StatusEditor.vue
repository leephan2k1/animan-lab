<template>
  <div
    ref="editor"
    class="w-3/4 lg:w-1/2 min-h-[400px] rounded-2xl overflow-hidden shadow-lg absolute top-10 left-1/2 -translate-x-1/2 bg-white animate__animated animate__faster hidden z-40"
  >
    <!-- nav control  -->
    <div class="w-full h-[50px] flex justify-end items-center">
      <button
        @click.stop="handleCloseEditor"
        class="absolute-center w-7 h-7 border-2 mr-4 border-gray-500 rounded-full"
      >
        <VueButton />
      </button>
    </div>

    <!-- text editor  -->
    <p v-if="!isValidContent.status" class="text-red-400 text-center">
      {{ isValidContent.message }}
    </p>
    <div class="w-full h-[150px] flex flex-col">
      <textarea
        @click.stop="isOpenEmoji = false"
        @keyup="isValidContent.status = true"
        v-model="content"
        class="h-fit p-4"
        :class="{
          'border-[2px]': !isValidContent.status,
          'border-red-500': !isValidContent.status,
        }"
        cols="30"
        rows="10"
        placeholder="Bạn đang nghĩ gì?..."
      ></textarea>
    </div>

    <!-- emoji button   -->
    <div id="emoji-container" class="w-full flex justify-end">
      <button @click.stop="handleToggleEmoji" class="mr-4 mt-2">
        <vue-button buttonType="smile" />
      </button>
    </div>

    <!-- image upload  -->
    <p v-if="!isValidImage.status" class="text-red-400 text-center">
      {{ isValidImage.message }}
    </p>
    <div class="w-full absolute-center">
      <button
        @click.stop="isValidImage.status = true"
        :class="{
          'border-[2px]': !isValidImage.status,
          'border-red-500': !isValidImage.status,
        }"
        class="mb-2 w-[70%] h-fit mx-auto rounded-xl"
      >
        <ImageUpload v-if="!resetImage" @urlUpload="handleSaveURL" />
      </button>
    </div>

    <!-- submit  -->
    <div class="w-full h-[50px] absolute-center mb-4">
      <button
        @click.stop="handleSubmit"
        class="w-3/4 mx-auto h-full rounded-2xl bg-button text-white"
      >
        Đăng
      </button>
    </div>
  </div>

  <!-- emoji picker  -->
  <div
    v-if="isOpenEmoji"
    class="absolute md:top-[4%] top-[6%] w-fit h-fit left-1/2 -translate-x-1/2 rounded-2xl overflow-hidden z-50"
  >
    <VuemojiPicker @emojiClick="handleEmojiClick" />
  </div>
</template>

<script>
import {
  ref,
  watch,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import VueButton from "@/components/VueButton.vue";
import { VuemojiPicker } from "vuemoji-picker";

import { useToast } from "vue-toastification";

import { BLACKLIST } from "@/constants";
import { isExactMatch } from "@/utils/stringHandler";

import usePost from "@/hooks/post";

import { nanoid } from "nanoid";

export default {
  components: {
    VueButton,
    VuemojiPicker,
    ImageUpload: defineAsyncComponent(() =>
      import("@/components/ImageUpload.vue")
    ),
  },
  props: {
    openEditor: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const editor = ref(null);
    const isOpenEditorProps = computed(() => props.openEditor);

    const app = document.querySelector("#app");
    const overlay = document.createElement("div");
    const isOpenEmoji = ref(false);

    const content = ref("");
    const image_url = ref("");
    const resetImage = ref(false);

    const post = usePost();

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

    const isValidContent = reactive({
      status: true,
      message: "",
    });
    const isValidImage = reactive({
      status: true,
      message: "",
    });

    overlay.classList.add(
      "w-full",
      "h-full",
      "absolute",
      "top-0",
      "left-0",
      "bg-overlay",
      "z-30"
    );

    watch(isOpenEditorProps, () => {
      handleOpenEditor();
    });

    const handleSaveURL = (value) => {
      image_url.value = value;
    };

    const handleCloseEditor = () => {
      editor.value.classList.add("animate__fadeOut");
      editor.value.classList.remove("animate__fadeIn");

      overlay.remove();

      isOpenEmoji.value = false;

      content.value = "";

      resetImage.value = true;

      setTimeout(() => {
        editor.value.classList.add("hidden");
      }, 0);
    };

    const handleOpenEditor = () => {
      editor.value.classList.add("animate__fadeIn");
      editor.value.classList.remove("animate__fadeOut", "hidden");
      app.appendChild(overlay);

      resetImage.value = false;

      const textArea = editor.value.querySelector("textarea");
      textArea.focus();
    };

    const handleEmojiClick = (e) => {
      content.value += ` ${e.unicode}`;
      content.value = content.value.trim();

      isOpenEmoji.value = false;
    };

    const validateContent = (str) => {
      if (str.length > 150) {
        isValidContent.status = false;
        isValidContent.message = "Nội dung tối đa 150 ký tự";
        return isValidContent.status;
      }

      if (str.length < 10) {
        isValidContent.status = false;
        isValidContent.message = "Nội dung tối thiểu 10 ký tự";
        return isValidContent.status;
      }

      if (image_url.value === "") {
        isValidImage.status = false;
        isValidImage.message = "Bài đăng cần phải có hình ảnh!";
        return isValidImage.status;
      }

      BLACKLIST.forEach((word) => {
        if (isExactMatch(str, word)) {
          isValidContent.status = false;
          isValidContent.message = "Nội dung có chứa ký tự tục tĩu!";
          return;
        }
      });

      return isValidContent.status;
    };

    const handleSubmit = async () => {
      if (!validateContent(content.value)) {
        return;
      }

      content.value = content.value.trim();

      const postPayload = {
        title: nanoid(),
        content: content.value,
        plainText: content.value,
        tags: ["short"],
        images_url: [image_url.value],
      };

      const res = {};

      await post.publish({}, res, postPayload);

      if (res.value) {
        toast.success(
          "Đăng bài thành công, bài viết sẽ được chờ phê duyệt",
          TOAST_OPTION
        );
        setTimeout(() => {
          handleCloseEditor();
        }, 2500);
      }
    };

    const handleToggleEmoji = () => {
      isOpenEmoji.value = !isOpenEmoji.value;
    };

    onMounted(() => {
      overlay.addEventListener("click", handleCloseEditor);
    });

    onUnmounted(() => {
      if (overlay) {
        overlay.removeEventListener("click", handleCloseEditor);

        overlay.remove();
      }
    });

    return {
      handleCloseEditor,
      isValidImage,
      isValidContent,
      editor,
      handleEmojiClick,
      handleToggleEmoji,
      handleSaveURL,
      isOpenEmoji,
      content,
      handleSubmit,
      resetImage,
    };
  },
};
</script>

<style lang="scss" scoped>
#emoji-container {
  div {
    @apply w-fit h-fit;
    emoji-picker {
      @apply md:w-[400px] md:h-[350px] w-[90%] h-[300px] mx-auto rounded-xl;
    }
  }
}
</style>
