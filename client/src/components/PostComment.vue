<template>
  <div
    ref="commentsDOM"
    class="w-[80%] lg:w-3/4 min-h-[620px] md:min-h-[650px] lg:min-h-[600px] h-fit bg-white border-[1px] border-gray-500 absolute top-[5%] left-1/2 -translate-x-1/2 rounded-xl overflow-hidden shadow-xl animate__animated animate__faster hidden"
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
      <div v-else class="w-full h-[130px] flex items-center justify-center">
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
          <input
            v-focus
            class="w-full h-4/5 px-4 rounded-3xl border-[1px] border-gray-500"
            type="text"
            placeholder="Nhập bình luận...."
          />
        </div>
      </div>
    </div>
    <!-- container  -->
    <div class="w-full h-[450px] overflow-y-scroll">
      <!-- comments list  -->
      <div
        v-for="item in fakeData"
        :key="item"
        class="w-full h-[130px] flex items-center justify-center"
      >
        <!-- user avatar  -->
        <div
          class="md:w-20 w-16 md:h-20 h-16 flex flex-col items-center justify-center"
        >
          <div
            :style="{
              backgroundImage: `url(${avatarHandler(profile)})`,
            }"
            class="md:w-12 w-10 md:h-12 h-10 rounded-full bg-black bg-center bg-cover bg-no-repeat"
          ></div>
          <p
            class="text-[13px] whitespace-nowrap text-ellipsis overflow-hidden"
          >
            User name
          </p>
        </div>
        <!-- comment box  -->
        <div
          class="w-3/4 h-1/2 md:ml-2 rounded-3xl absolute-center overflow-hidden"
        >
          <p
            class="w-full h-4/5 px-4 rounded-3xl post-title border-[1px] overflow-hidden border-gray-500 md:text-base text-sm md:py-0 py-2"
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem
            beatae cupiditate ipsa repellat optio, nobis officiis? Eos
            consequuntur provident porro odit quas eius omnis, perferendis
            adipisci labore molestiae suscipit amet.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import VueButton from "@/components/VueButton.vue";

import { avatarHandler } from "@/utils/userHandler";

export default {
  components: {
    VueButton,
  },
  directives: {
    focus: {
      mounted: (el) => el.focus(),
    },
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

    const isActiveComment = ref(false);
    const activeFromProps = computed(() => props.isOpenComment);
    const commentsDOM = ref(null);

    watch(activeFromProps, () => {
      handleOpenComment();
    });

    const handleOpenComment = () => {
      isActiveComment.value = true;
      commentsDOM.value.classList.add("animate__fadeIn");
      commentsDOM.value.classList.remove("animate__fadeOut", "hidden");
      window.scrollTo({ top: 30, behavior: "smooth" });
    };

    const handleCloseComments = () => {
      isActiveComment.value = false;
      commentsDOM.value.classList.remove("animate__fadeIn");
      commentsDOM.value.classList.add("animate__fadeOut");
      setTimeout(() => {
        commentsDOM.value.classList.add("hidden");
      }, 500);
    };

    return {
      isLogged,
      fakeData,
      avatarHandler,
      profile,
      handleCloseComments,
      commentsDOM,
    };
  },
};
</script>
