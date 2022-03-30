<template>
  <div
    v-if="isUploadingAvatar"
    @click.stop="handleCloseUpload"
    class="w-full h-full absolute top-0 left-0 bg-overlay z-20"
  ></div>

  <div class="w-full h-screen relative">
    <!-- file upload  -->
    <div
      ref="uploadAvatarDOM"
      class="hidden animate__animated animate__faster absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] lg:w-1/2 lg:min-h-1/2 h-fit w-3/4 bg-white rounded-xl overflow-hidden z-40 flex flex-col"
    >
      <div class="w-full h-[10%] my-4 flex items-center justify-end">
        <div
          @click="handleCloseUpload"
          class="cursor-pointer absolute-center mr-4 w-6 h-6 md:w-8 md:h-8 rounded-full border-[1px] border-gray-700"
        >
          <VueButton buttonType="x" />
        </div>
      </div>
      <!-- input zone  -->
      <div class="w-[70%] h-fit mx-auto cursor-pointer">
        <AvatarUpload v-if="isUploadingAvatar" />
      </div>
    </div>

    <div class="w-[80%] h-full bg-white mx-auto rounded-xl overflow-hidden">
      <!-- settings wrapper  -->
      <div class="w-full lg:w-[50%] h-[80%] mx-auto mt-10 flex flex-col">
        <!-- settings row  -->
        <div class="w-full h-[25%] flex">
          <!-- setting title  -->
          <div class="basis-1/2 flex items-center justify-end">
            <span class="mr-4">Ảnh đại diện :</span>
          </div>
          <!-- setting content  -->
          <div @click="showUploadAvatar" class="basis-1/2 flex items-center">
            <div
              class="avatar"
              :style="{
                backgroundImage: `url(${profile.avatar})`,
              }"
            >
              <div class="overlay">
                <VueButton buttonType="camera" />
              </div>
            </div>
          </div>
        </div>

        <div class="w-[50%] h-[1px] bg-gray-400 mx-auto" />

        <!-- settings row  -->
        <div class="w-full h-[20%] flex">
          <!-- setting title  -->
          <div class="basis-1/2 flex items-center justify-end">
            <span class="mr-4">Giới tính :</span>
          </div>
          <!-- setting content  -->
          <div class="basis-1/2 flex flex-col justify-center">
            <div class="flex items-center w-full h-fit">
              <input class="mr-2" type="radio" value="male" checked />
              <label class="ml-2" for="male">Nam</label>
            </div>
            <div class="flex items-center w-full h-fit">
              <input class="mr-2" type="radio" value="female" />
              <label class="ml-2" for="male">Nữ</label>
            </div>
            <div class="flex items-center w-full h-fit">
              <input class="mr-2" type="radio" value="undefined" />
              <label class="ml-2" for="male">Không rõ</label>
            </div>
          </div>
        </div>

        <div class="w-[50%] h-[1px] bg-gray-400 mx-auto" />

        <!-- settings row  -->
        <div class="w-full h-[35%] lg:h-[40%] my-4 flex">
          <!-- setting title  -->
          <div class="basis-1/2 flex items-center justify-end">
            <span class="mr-4">Đổi mật khẩu :</span>
          </div>
          <!-- setting content  -->
          <div
            class="basis-1/2 h-full flex flex-col items-center justify-center md:text-base text-xs"
          >
            <div class="flex flex-col w-full h-fit">
              <label class="w-full" for="old-pass">Mật khẩu cũ</label>
              <input
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                type="password"
                required
              />
            </div>
            <div class="flex flex-col w-full h-fit">
              <label class="w-full" for="new-pass">Mật khẩu mới</label>
              <input
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                type="password"
                required
              />
            </div>
            <div class="flex flex-col w-full h-fit">
              <label class="w-full" for="new-re-pass"
                >Nhập lại mật khẩu mới</label
              >
              <input
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                type="password"
                required
              />
            </div>
          </div>
        </div>

        <div class="w-[50%] h-[1px] bg-gray-400 mx-auto" />

        <!-- settings row  -->
        <div class="w-full h-[15%] flex">
          <!-- setting title  -->
          <div class="basis-1/2 flex items-center justify-end">
            <span class="mr-4">Tên :</span>
          </div>
          <!-- setting content  -->
          <div
            class="basis-1/2 flex flex-col items-center md:text-base text-sm"
          >
            <div class="flex flex-col justify-center w-full h-full">
              <input
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                type="password"
                required
              />
            </div>
          </div>
        </div>

        <div class="w-[50%] h-[1px] bg-gray-400 mx-auto" />

        <!-- settings row  -->
        <div class="w-full h-[15%] flex">
          <!-- setting title  -->
          <div class="basis-1/2 flex items-center justify-end">
            <span class="mr-4">Họ :</span>
          </div>
          <!-- setting content  -->
          <div
            class="basis-1/2 flex flex-col items-center md:text-base text-sm"
          >
            <div class="flex flex-col justify-center w-full h-full">
              <input
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                type="password"
                required
              />
            </div>
          </div>
        </div>

        <div class="w-[50%] h-[1px] bg-gray-400 mx-auto" />

        <!-- settings row  -->
        <div class="w-full h-[15%] flex">
          <!-- setting title  -->
          <div class="basis-1/2 flex items-center justify-end">
            <span class="mr-4">Ngày sinh :</span>
          </div>
          <!-- setting content  -->
          <div
            class="basis-1/2 flex flex-col items-center md:text-base text-sm"
          >
            <div class="flex flex-col justify-center w-full h-full">
              <input
                class="w-[90%] rounded-md border-[1px] border-gray-400 px-2 lg:w-full"
                type="date"
                required
              />
            </div>
          </div>
        </div>

        <!-- settings row  -->
        <div class="w-full h-[20%] absolute-center">
          <!-- setting save  -->
          <div
            class="w-[30%] h-[50%] bg-button flex flex-col items-center md:text-base text-sm absolute-center rounded-lg cursor-pointer hover:scale-110 transition-all text-white"
          >
            Lưu thay đổi
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from "vue";
import { useStore } from "vuex";

import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
    AvatarUpload: defineAsyncComponent(() =>
      import("@/components/AvatarUpload.vue")
    ),
  },

  setup() {
    const store = useStore();
    const profile = store.getters["user/getProfile"];
    const settings = ref({});
    const isUploadingAvatar = ref(false);
    const uploadAvatarDOM = ref(null);

    const showUploadAvatar = () => {
      isUploadingAvatar.value = true;
      uploadAvatarDOM.value.classList.remove("animate__zoomOut", "hidden");
      uploadAvatarDOM.value.classList.add("animate__zoomIn");
    };

    const handleCloseUpload = () => {
      isUploadingAvatar.value = false;
      uploadAvatarDOM.value.classList.add("animate__zoomOut");
      uploadAvatarDOM.value.classList.remove("animate__zoomIn");
      uploadAvatarDOM.value.classList.add("hidden");
    };

    return {
      profile,
      settings,
      showUploadAvatar,
      isUploadingAvatar,
      handleCloseUpload,
      uploadAvatarDOM,
    };
  },
};
</script>

<style scoped lang="scss">
.avatar {
  @apply ml-4 w-16 md:w-20 h-16 md:h-20 bg-green-400 rounded-full bg-center bg-cover bg-no-repeat overflow-hidden cursor-pointer;
  .overlay {
    @apply w-full h-full bg-black/20 hidden;
  }
  &:hover .overlay {
    @apply flex justify-center items-center;
  }
}
</style>
