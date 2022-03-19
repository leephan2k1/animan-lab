<template>
  <div class="h-full w-full">
    <file-pond
      name="avatar"
      ref="pond"
      label-idle="Kéo thả file hoặc click vào đây!"
      :allow-multiple="false"
      accepted-file-types="image/jpeg, image/png"
      server="/api"
      :files="myFiles"
      v-on:init="handleFilePondInit"
    />
  </div>
</template>

<script>
import { ref } from "vue";

import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
export default {
  components: {
    FilePond,
  },

  setup() {
    const myFiles = ref("");

    const handleFilePondInit = () => {};

    return { handleFilePondInit, myFiles };
  },
};
</script>
