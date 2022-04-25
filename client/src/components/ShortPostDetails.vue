<template>
  <div
    ref="imageReviewDOM"
    class="rounded-2xl overflow-hidden z-40 md:w-[90%] w-screen md:h-[85%] h-screen lg:h-screen top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white fixed hidden animate__animated animate__faster"
  >
    <!-- nav control  -->
    <div class="w-full h-[10%] flex justify-end items-center">
      <button
        @click.stop="handleCloseImageReview"
        class="w-7 h-7 rounded-full border-[1px] border-gray-500 mr-6 absolute-center"
      >
        <VueButton />
      </button>
    </div>

    <!-- content wrapper -->
    <div class="w-full h-full grid grid-cols-12 items-center">
      <!-- image content  -->
      <div class="h-[750px] md:col-span-8 lg:col-span-9 col-span-12">
        <img
          :src="postPayload?.images_url"
          alt="image-review"
          class="min-w-1/2 w-fit max-w-3/4 h-[85%] aspect-3/5 mx-auto rounded-2xl overflow-hidden py-2"
        />
      </div>

      <!-- text content  -->
      <div
        class="flex-col h-full md:flex hidden md:col-span-4 lg:col-span-3 bg-main rounded-tl-2xl"
      >
        <!-- post content detail  -->
        <div class="w-full h-fit">
          <!-- owner info  -->
          <div class="h-[100px] w-full flex items-center justify-around">
            <!-- avatar post owner  -->
            <div
              :style="{
                backgroundImage: `url(${avatarHandler(postAuthor)})`,
              }"
              class="ml-2 w-14 h-14 rounded-full bg-center bg-cover bg-no-repeat"
            ></div>
            <!-- user name post owner  -->
            <p
              class="ml-2 w-3/4 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ postAuthor?.user_name }}
            </p>
          </div>
          <!-- title content  -->
          <p class="ml-2 w-4/5 h-fit mx-2 flex-wrap">
            {{ postPayload?.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

import VueButton from "@/components/VueButton.vue";

import { avatarHandler } from "@/utils/userHandler";

export default {
  components: {
    VueButton,
  },

  props: {
    triggerOpenImageReview: {
      type: Boolean,
      default: false,
    },
    postPayload: {
      type: Object,
    },
  },

  setup(props) {
    const imageReviewDOM = ref(null);
    const postAuthor = ref({});

    const postPayload = computed(() => props.postPayload);
    const triggerOpen = computed(() => props.triggerOpenImageReview);

    watch([postPayload, triggerOpen], () => {
      postAuthor.value = postPayload.value?.author_id;
      console.log(">>> ", postPayload.value);

      //style:
      imageReviewDOM.value.classList.remove("hidden", "animate__fadeOut");
      imageReviewDOM.value.classList.add("animate__fadeIn");

      app.appendChild(overlay);
    });

    const app = document.querySelector("#app");
    const overlay = document.createElement("div");
    overlay.classList.add(
      "w-full",
      "h-full",
      "absolute",
      "top-0",
      "left-0",
      "bg-overlay",
      "z-20"
    );

    const handleCloseImageReview = () => {
      app.removeChild(overlay);
      overlay.remove();

      imageReviewDOM.value.classList.remove("animate__fadeIn");
      imageReviewDOM.value.classList.add("animate__fadeOut");
      setTimeout(() => {
        imageReviewDOM.value.classList.add("hidden");
      }, 300);
    };

    onMounted(() => {
      if (overlay) {
        overlay.addEventListener("click", handleCloseImageReview);
      }
    });

    onUnmounted(() => {
      if (overlay) {
        overlay.removeEventListener("click", handleCloseImageReview);
        overlay.remove();
      }
    });

    return {
      imageReviewDOM,
      handleCloseImageReview,
      avatarHandler,
      postAuthor,
      postPayload,
    };
  },
};
</script>
