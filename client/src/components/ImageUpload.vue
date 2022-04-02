<template>
  <div class="h-full w-full">
    <file-pond
      name="avatar"
      ref="pond"
      label-idle="Kéo thả ảnh hoặc click vào đây!"
      :allow-multiple="false"
      accepted-file-types="image/jpeg, image/png"
      max-file-size="500KB"
      allow-image-crop="true"
      :server="filePondOptions"
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
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageCrop
);

export default {
  components: {
    FilePond,
  },
  setup(_, { emit }) {
    const myFiles = ref("");

    const filePondOptions = {
      process: (
        fieldName,
        file,
        metadata,
        load,
        error,
        progress,
        abort,
        transfer,
        options
      ) => {
        // fieldName is the name of the input field
        // file is the actual file object to send
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("upload_preset", "animanlab");

        const request = new XMLHttpRequest();
        request.open("POST", process.env.VUE_APP_CLOUDINARY);

        // Should call the progress method to update the progress to 100% before calling load
        // Setting computable to false switches the loading indicator to infinite mode
        request.upload.onprogress = (e) => {
          progress(e.lengthComputable, e.loaded, e.total);
        };

        // Should call the load method when done and pass the returned server file id
        // this server file id is then used later on when reverting or restoring a file
        // so your server knows which file to return without exposing that info to the client
        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            // the load method accepts either a string (id) or an object
            load(request.responseText);
            const data = JSON.parse(request.response);
            emit("urlUpload", data.secure_url);
          } else {
            // Can call the error method if something is wrong, should exit after
            error("oh no");
          }
        };

        request.send(formData);

        // Should expose an abort method so the request can be cancelled
        return {
          abort: () => {
            // This function is entered if the user has tapped the cancel button
            request.abort();

            // Let FilePond know the request has been cancelled
            abort();
          },
        };
      },
    };

    const handleFilePondInit = () => {};

    return { handleFilePondInit, myFiles, filePondOptions };
  },
};
</script>
