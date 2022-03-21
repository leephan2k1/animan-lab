<template>
  <div class="w-full lg:w-3/4 mx-auto">
    <span v-if="titleInvalid" class="text-red-500"
      >Tiêu đề tối thiểu 3 ký tự</span
    >
    <input
      class="bg-main md:w-full w-4/5 h-[150x] mb-7 p-4 mx-auto block border-[1px] border-gray-400"
      @keyup="resetTitleStyles"
      :class="{ 'border-red-500 border-[2px]': titleInvalid }"
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
        @textChange="resetContentStyles"
        ref="quillContent"
        theme="snow"
        :options="options"
      />
    </div>

    <div class="w-full h-fit flex justify-end">
      <button
        class="bg-button text-white absolute-center ml-4 mt-4 rounded-lg w-32 h-4 border-[1px] border-gray-400 p-4"
        @click="handleContentPublish"
      >
        Đăng bài
      </button>
      <button
        class="bg-white text-gray-600 absolute-center ml-4 mt-4 rounded-lg w-32 h-4 border-[1px] border-gray-400 p-4"
        @click="handleCancel"
      >
        Huỷ
      </button>
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
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

import { QuillEditor, Quill } from "@vueup/vue-quill";
import QuillImageUploader from "quill-image-uploader";
Quill.register("modules/image-uploader", QuillImageUploader);

import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  components: {
    QuillEditor,
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
    const quillContent = ref(null);
    const title = ref("");
    const titleInput = ref(null);
    const titleInvalid = ref(false);
    const contentInvalid = ref(false);

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

    const validateContents = () => {
      if (title.value.length < 3) {
        titleInvalid.value = true;
        return;
      }
      const contents = quillContent.value.getText();
      if (contents.length < 10) {
        contentInvalid.value = true;
        return;
      }
    };

    const resetTitleStyles = () => {
      titleInvalid.value = false;
    };

    const resetContentStyles = () => {
      contentInvalid.value = false;
    };

    const handleContentPublish = () => {
      //validate:
      validateContents();
      //POST to Server
      console.log(quillContent.value.getHTML());
      console.log(title.value);
    };

    onMounted(() => {
      titleInput.value.focus();
    });

    return {
      options,
      quillContent,
      handleContentPublish,
      title,
      titleInput,
      titleInvalid,
      resetTitleStyles,
      resetContentStyles,
      contentInvalid,
      contentInvalid,
    };
  },
};
</script>

<style lang="scss" scoped></style>
