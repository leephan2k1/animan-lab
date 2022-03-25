div
<template>
  <div class="w-full lg:w-3/4 mx-auto">
    <div v-if="postSuccessfully">
      <div class="w-full h-fit">
        <div class="absolute-center flex-col">
          <VueButton buttonType="smile" styles="w-16 h-16" />
          <p>Đăng bài thành công!</p>
        </div>
        <p class="tex-center absolute-center md:px-0 px-4">
          Hiền giả đây có thể ngồi ăn miếng bánh, uống ngụm trà, cày vài bộ
          Anime, Manga trong lúc chờ duyệt bài!
        </p>
        <div class="flex justify-center items-center">
          <router-link
            class="hover:border-button transition-all p-2 mt-4 rounded-xl border-[1px] border-gray-400 ml-4"
            :to="{
              name: 'profilePending',
              params: { username: userProfile.user_name },
            }"
          >
            Xem lại bài đã đăng
          </router-link>
          <router-link
            class="hover:border-button transition-all p-2 mt-4 rounded-xl border-[1px] border-gray-400 ml-4"
            :to="{ name: 'home' }"
          >
            Quay về trang chủ
          </router-link>
        </div>
      </div>
    </div>
    <div v-else>
      <span v-if="titleInvalid.status" class="text-red-500">{{
        titleInvalid.message
      }}</span>
      <input
        class="bg-main md:w-full w-4/5 h-[150x] mb-7 p-4 mx-auto block border-[1px] border-gray-400"
        @keyup="handleStyles"
        :class="{ 'border-red-500 border-[2px]': titleInvalid.status }"
        v-model="title"
        ref="titleInput"
        type="text"
        required
        placeholder="Nhập tiêu đề"
      />
      <span v-if="contentInvalid" class="text-red-500"
        >Nội dung tối thiểu 10 ký tự</span
      >
      <div
        :class="{ 'border-red-500 border-[2px]': contentInvalid }"
        class="w-full h-fit"
      >
        <QuillEditor
          @textChange="contentInvalid = false"
          ref="quillContent"
          theme="snow"
          :options="options"
        />
      </div>

      <div class="my-4">
        <vue-tags-input
          v-model="tag"
          :tags="tags"
          :validation="tagValidation"
          :autocomplete-items="filteredItems()"
          @tags-changed="(newTags) => (tags = newTags)"
          placeholder="Nhập tag thể loại (Anime, manga,..)"
        />
      </div>

      <div class="w-full h-fit flex justify-end">
        <button
          class="bg-button text-white absolute-center ml-4 mt-4 rounded-lg w-32 h-4 border-[1px] border-gray-400 p-4"
          @click="handleContentPublish"
        >
          Đăng bài
        </button>
        <router-link
          class="bg-white text-gray-600 absolute-center ml-4 mt-4 rounded-lg w-32 h-4 border-[1px] border-gray-400 p-4"
          :to="{ name: 'home' }"
        >
          Huỷ
        </router-link>
      </div>
      <div class="w-3/4 mx-auto my-4">
        Vui lòng đọc
        <router-link
          :to="{ name: 'docs', params: { doctype: 'post-rules' } }"
          target="_blank"
          class="text-button cursor-pointer"
          >quy tắc đăng bài</router-link
        >
        để được duyệt nhanh hơn và tránh bị khoá tài khoản vĩnh viễn!
      </div>
    </div>
  </div>
</template>

<script>
import RepositoryFactory from "@/api/repositoryFactory";
const postsRepository = RepositoryFactory.get("posts");

import VueButton from "@/components/VueButton.vue";
import VueTagsInput from "@sipec/vue3-tags-input";

import { reactive, ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";

import { QuillEditor, Quill } from "@vueup/vue-quill";
import QuillImageUploader from "quill-image-uploader";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
Quill.register("modules/image-uploader", QuillImageUploader);

export default {
  components: {
    QuillEditor,
    VueButton,
    VueTagsInput,
  },
  setup() {
    const options = {
      modules: {
        toolbar: {
          container: [
            { font: [] },
            { size: ["small", false, "large", "huge"] },
            { header: [1, 2, 3, 4, 5, 6, false] },
            "bold",
            "italic",
            "underline",
            "strike",
            { color: [] },
            { list: "ordered" },
            { list: "bullet" },
            { align: [] },
            "link",
            "image",
            "video",
          ],
          handlers: {
            image: imageHandler,
          },
        },
      },
    };
    const store = useStore();

    const title = ref("");
    const quillContent = ref(null);
    const tag = ref("");
    const tags = ref([]);
    const autocompleteItems = [
      {
        text: "Anime",
      },
      {
        text: "Manga",
      },
      {
        text: "Cosplay",
      },
      {
        text: "Characters",
      },
      {
        text: "Japan Culture",
      },
      {
        text: "Japan",
      },
    ];
    const tagValidation = [
      {
        classes: "no-numbers",
        rule: /^([^0-9]*)$/,
      },
      {
        classes: "avoid-item",
        rule: /^(?!Cannot).*$/,
        disableAdd: true,
      },
      {
        classes: "no-braces",
        rule: ({ text }) =>
          text.indexOf("{") !== -1 || text.indexOf("}") !== -1,
      },
    ];

    const titleInput = ref(null);
    const titleInvalid = reactive({
      status: false,
      message: "",
    });
    const contentInvalid = ref(false);
    const postSuccessfully = ref(false);
    const userProfile = reactive(store.state.user.profile);

    //handle image upload to cloudinary
    function imageHandler() {
      const quill = this.quill;

      const input = document.createElement("input");

      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const image = input.files[0];
        const formData = new FormData();

        formData.append("file", image);

        //config preset cloudinary
        formData.append("upload_preset", "animanlab");

        // Save current cursor state
        const range = quill.getSelection(true);

        // Insert temporary loading placeholder image
        quill.insertEmbed(
          range.index,
          "image",
          "https://cdn.dribbble.com/users/1341307/screenshots/5377324/morph_dribbble.gif"
        );

        // Move cursor to right side of image (easier to continue typing)
        quill.setSelection(range.index + 1);

        // THIS NEEDS TO BE HOOKED UP TO AN API
        // RESPONSE DATA WILL THEN BE USED TO EMBED THE IMAGE
        let res;
        try {
          console.log("formData:::: ", formData);
          res = await axios({
            method: "POST",
            url: process.env.VUE_APP_CLOUDINARY,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            data: formData,
          });
        } catch (err) {
          console.error("error", err);
        }

        // Remove placeholder image
        quill.deleteText(range.index, 1);

        // Insert uploaded image
        quill.insertEmbed(range.index, "image", res.data.secure_url);
      };
    }

    //validate content title > 3 && content > 10
    const validateContents = () => {
      if (title.value.length < 3) {
        titleInvalid.status = true;
        titleInvalid.message = "Tiêu đề tối thiểu 3 ký tự";
        return false;
      }
      const contents = quillContent.value.getText();
      if (contents.length < 10) {
        contentInvalid.value = true;
        return false;
      }
      return true;
    };

    //call api, upload to animan lab server
    const handleContentPublish = async () => {
      //validate:
      if (!validateContents()) {
        return;
      }
      //POST to Server
      const pureTags = tags.value.map((e) => e.text);

      const postPayload = {
        title: title.value,
        content: quillContent.value.getHTML(),
        plainText: quillContent.value.getText(),
        tags: pureTags,
      };

      try {
        const res = await postsRepository.createPost(postPayload);
        if (res?.data.message === "Duplicated title") {
          titleInvalid.status = true;
          titleInvalid.message = "Tiêu đề đã bị trùng!";
          return;
        }

        if (res?.data.success) {
          postSuccessfully.value = true;
        }
      } catch (err) {
        console.log(err);
      }
    };

    //active title browser && reset css
    const handleStyles = () => {
      titleInvalid.status = false;
      document.title = title.value;
    };

    //auto complete tags:
    const filteredItems = () => {
      return autocompleteItems.filter((i) => {
        return i.text.toLowerCase().indexOf(tag.value.toLowerCase()) !== -1;
      });
    };

    onUnmounted(() => {
      document.title = "Animan Lab";
      postSuccessfully.value = false;
    });

    onMounted(() => {
      titleInput.value?.focus();
    });

    return {
      options,
      quillContent,
      handleContentPublish,
      title,
      titleInput,
      titleInvalid,
      contentInvalid,
      handleStyles,
      postSuccessfully,
      userProfile,
      tags,
      tag,
      tagValidation,
      filteredItems,
    };
  },
};
</script>

<style lang="scss">
.ti-input,
.ti-valid,
.ti-duplicate,
.ti-invalid {
  @apply bg-main;
}
</style>
