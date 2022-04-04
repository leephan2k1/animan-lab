<template>
  <div
    v-if="isUploadingAvatar"
    @click.stop="handleCloseUpload"
    class="w-full h-full absolute top-0 left-0 bg-overlay z-20"
  ></div>

  <div class="w-full min-h-[650px] h-screen relative">
    <!-- file upload  -->
    <div
      ref="uploadAvatarDOM"
      class="hidden animate__animated animate__faster absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] lg:w-1/2 w-3/4 min-h-[450px] max-h-[500px] bg-white rounded-xl overflow-y-scroll z-40"
    >
      <AvatarPicker
        v-if="isUploadingAvatar"
        @avatarURL="getUrlAvatar"
        @toggleWaifuForm="handleCloseUpload"
      />
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
                backgroundImage: `url(${
                  avatarReview || avatarHandler(profile)
                })`,
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
              <input
                v-model="newProfilePayload.gender"
                class="mr-2"
                type="radio"
                value="male"
              />
              <label class="ml-2" for="male">Nam</label>
            </div>
            <div class="flex items-center w-full h-fit">
              <input
                v-model="newProfilePayload.gender"
                class="mr-2"
                type="radio"
                value="female"
              />
              <label class="ml-2" for="male">Nữ</label>
            </div>
            <div class="flex items-center w-full h-fit">
              <input
                v-model="newProfilePayload.gender"
                class="mr-2"
                type="radio"
                value="other"
              />
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
              <label class="w-full">Mật khẩu cũ</label>
              <input
                v-model="newProfilePayload.oldPassword"
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                :class="{ error: !formValid.oldPasswordValid }"
                type="password"
                @keyup="formValid.oldPasswordValid = true"
              />
              <span
                v-if="!formValid.oldPasswordValid"
                class="text-[10px] md:text-sm text-red-500"
                >Mật khẩu cũ không chính xác</span
              >
            </div>
            <div class="flex flex-col w-full h-fit">
              <label class="w-full" for="new-pass">Mật khẩu mới</label>
              <input
                v-model="newProfilePayload.newPassword"
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                :class="{ error: !formValid.newPasswordValid }"
                @keyup="formValid.newPasswordValid = true"
                type="password"
              />
              <span
                v-if="!formValid.newPasswordValid"
                class="text-[10px] md:text-sm text-red-500"
                >Mật khẩu tối thiểu 6 ký tự</span
              >
            </div>
            <div class="flex flex-col w-full h-fit">
              <label class="w-full" for="new-re-pass"
                >Nhập lại mật khẩu mới</label
              >
              <input
                v-model="newProfilePayload.newRePassword"
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                :class="{ error: !formValid.newRePasswordValid }"
                @keyup="formValid.newRePasswordValid = true"
                type="password"
                required
              />
              <span
                v-if="!formValid.newRePasswordValid"
                class="text-[10px] md:text-sm text-red-500"
                >Mật khẩu nhập lại không khớp</span
              >
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
                v-model="newProfilePayload.first_name"
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                :class="{ error: !formValid.firstNameValid }"
                @keyup="formValid.firstNameValid = true"
                type="text"
                required
              />
              <span
                v-if="!formValid.firstNameValid"
                class="text-[10px] md:text-sm text-red-500"
                >Tên không được trống hoặc quá 20 ký tự</span
              >
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
                v-model="newProfilePayload.last_name"
                class="w-[80%] rounded-md border-[1px] border-gray-400 px-4 lg:w-full"
                :class="{ error: !formValid.lastNameValid }"
                @keyup="formValid.lastNameValid = true"
                type="text"
                required
              />
              <span
                v-if="!formValid.lastNameValid"
                class="text-[10px] md:text-sm text-red-500"
                >Họ không được trống hoặc quá 20 ký tự</span
              >
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
                v-model="newProfilePayload.birthday"
                class="w-[90%] rounded-md border-[1px] border-gray-400 px-2 lg:w-full"
                type="date"
                required
              />
            </div>
          </div>
        </div>

        <!-- settings row  -->
        <div class="w-full h-[20%] mt-4 absolute-center">
          <!-- setting save  -->
          <button
            @click.stop="handleUpdate"
            class="w-[150px] h-[50px] bg-button flex flex-col items-center md:text-base text-sm absolute-center rounded-lg hover:scale-110 transition-all text-white"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";

import { avatarHandler } from "@/utils/userHandler";
import { convertISODate } from "@/utils/dateHandler";

import VueButton from "@/components/VueButton.vue";

import repositoryFactory from "@/api/repositoryFactory";
const userRepo = repositoryFactory.get("users");

export default {
  components: {
    VueButton,
    AvatarPicker: defineAsyncComponent(() =>
      import("@/components/AvatarPicker.vue")
    ),
  },

  setup() {
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
    const store = useStore();

    const profile = store.getters["user/getProfile"];
    const defaultProfile = {
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      gender: profile?.gender,
      birthday: convertISODate(profile?.birthday),
      avatar: profile?.avatar,
    };

    const formValid = reactive({
      oldPasswordValid: true,
      newPasswordValid: true,
      newRePasswordValid: true,
      firstNameValid: true,
      lastNameValid: true,
    });
    const newProfilePayload = reactive({
      first_name: defaultProfile.first_name || "",
      last_name: defaultProfile.last_name || "",
      avatar: "",
      oldPassword: "",
      newPassword: "",
      newRePassword: "",
      gender: defaultProfile.gender || "male",
      birthday: defaultProfile.birthday || "",
    });
    const avatarReview = ref("");
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
      setTimeout(() => {
        uploadAvatarDOM.value.classList.add("hidden");
      }, 100);
    };

    const getUrlAvatar = (url) => {
      //show image review
      if (url) {
        avatarReview.value = url;
        newProfilePayload.avatar = url;
      }
      //close form
      handleCloseUpload();
    };

    const validateForm = () => {
      const fName = newProfilePayload.first_name;
      if (fName.length < 1 || fName.length > 20 || fName === "") {
        formValid.firstNameValid = false;
        return false;
      }

      const lName = newProfilePayload.last_name;
      if (lName.length < 1 || lName.length > 20 || lName === "") {
        formValid.lastNameValid = false;
        return false;
      }

      const newPass = newProfilePayload.newPassword;
      if (newPass !== "" && newPass.length < 6) {
        formValid.newPasswordValid = false;
        return false;
      }

      const newRePass = newProfilePayload.newRePassword;
      if (newPass && newRePass !== newPass) {
        formValid.newRePasswordValid = false;
        return false;
      }

      return true;
    };

    const handleUpdate = async () => {
      if (!validateForm()) {
        return;
      }

      const { user_name } = profile;
      const payload = {};

      if (newProfilePayload.first_name !== defaultProfile.first_name)
        payload.first_name = newProfilePayload.first_name;

      if (newProfilePayload.last_name !== defaultProfile.last_name)
        payload.last_name = newProfilePayload.last_name;

      if (
        newProfilePayload.avatar !== defaultProfile.avatar &&
        newProfilePayload.avatar !== ""
      )
        payload.avatar = newProfilePayload.avatar;

      if (newProfilePayload.newPassword) {
        payload.oldPassword = newProfilePayload.oldPassword;
        payload.newPassword = newProfilePayload.newPassword;
      }
      if (newProfilePayload.gender) payload.gender = newProfilePayload.gender;

      if (newProfilePayload.birthday !== defaultProfile.birthday)
        payload.birthday = newProfilePayload.birthday;

      try {
        const res = await userRepo.updateUser(user_name, payload);

        if (res?.data.success) {
          //message:
          toast.success("Cập nhật thành công", TOAST_OPTION);
          //fetch new data to vuex:
          await store.dispatch(`user/${USER_REQUEST}`, user_name);
        } else {
          //wrong password:
          if (res?.data.message === "Incorrect password") {
            formValid.oldPasswordValid = false;
          }
        }
      } catch (err) {}
    };

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return {
      profile,
      newProfilePayload,
      avatarReview,
      showUploadAvatar,
      isUploadingAvatar,

      handleCloseUpload,
      handleCloseUpload,
      handleUpdate,

      uploadAvatarDOM,
      getUrlAvatar,
      avatarHandler,

      formValid,
    };
  },
};
</script>

<style scoped lang="scss">
.error {
  @apply border-red-500 border-[2px];
}
.avatar {
  @apply ml-4 w-16 md:w-20 h-16 md:h-20 rounded-full bg-center bg-cover bg-no-repeat overflow-hidden cursor-pointer;
  .overlay {
    @apply w-full h-full bg-black/20 hidden;
  }
  &:hover .overlay {
    @apply flex justify-center items-center;
  }
}
</style>
