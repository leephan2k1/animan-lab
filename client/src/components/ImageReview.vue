<template>
  <div
    ref="imageReviewDOM"
    class="fixed rounded-2xl overflow-hidden z-40 md:w-[65%] w-[95%] h-[500px] md:h-[600px] bg-white top-[10%] left-1/2 -translate-x-1/2 hidden animate__animated animate__faster"
  >
    <!-- nav control  -->
    <div class="w-full h-[10%] flex justify-end items-center">
      <button
        @click.stop="handleCloseImageReview"
        class="w-7 h-7 rounded-full border-[1px] border-gray-500 mr-4 absolute-center"
      >
        <VueButton />
      </button>
    </div>

    <!-- content wrapper  -->
    <div
      :style="{
        backgroundImage: `url(${imageURL})`,
      }"
      class="w-[95%] lg:w-1/2 md:w-3/4 h-[90%] mx-auto  rounded-2xl overflow-hidden absolute-center py-2 bg-center bg-cover bg-no-repeat"
    ></div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },

  props: {
    triggerOpenImageReview: {
      type: Boolean,
      default: false,
    },
    imageURL: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    const imageReviewDOM = ref(null);
    const stateProps = computed(() => props.triggerOpenImageReview);

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

    watch(stateProps, () => {
      imageReviewDOM.value.classList.remove("hidden", "animate__fadeOut");
      imageReviewDOM.value.classList.add("animate__fadeIn");

      app.appendChild(overlay);
    });

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

    return { imageReviewDOM, handleCloseImageReview };
  },
};
</script>
