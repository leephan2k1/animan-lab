<template>
  <div class="container mx-auto h-full">
    <!-- form container  -->
    <div class="md:h-[40rem] min-h-full w-full py-4 absolute-center flex-cols">
      <!-- form warper  -->
      <div
        class="bg-white rounded-2xl overflow-hidden shadow-2xl w-3/4 md:w-1/2 lg:w-[30%] h-fit"
      >
        <template v-if="!isSuccess">
          <!-- nav  -->
          <div class="w-full h-16 flex items-center justify-around py-2">
            <p class="font-semibold uppercase text-sm md:text-xl text-gray-800">
              Quên mật khẩu
            </p>

            <router-link :to="{ name: 'login' }">
              <button
                class="rounded-full w-8 h-8 absolute-center border-[1px] border-gray-300 hover:scale-110 transition-all"
              >
                <OptionalButton buttonType="x" />
              </button>
            </router-link>
          </div>

          <!-- logo  -->
          <div class="absolute-center">
            <span class="font-logo text-5xl">Animan Lab</span>
          </div>

          <form @submit.prevent="onSubmit" class="">
            <div class="row">
              <label for="email" class="my-1">
                <span>Email: </span>
              </label>
              <input
                v-model="email"
                type="email"
                required
                :class="{ error: !validEmail }"
                @keyup="validEmail = true"
                class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
                placeholder="Email đã đăng ký Animan Lab."
              />
              <div v-if="!validEmail" class="message text-red-500 text-sm">
                <p>Email chưa được đăng ký</p>
              </div>
            </div>

            <div class="row absolute-center">
              <input
                class="submit-btn"
                type="submit"
                value="Đặt lại mật khẩu"
              />
            </div>
          </form>
        </template>

        <template v-else>
          <div
            class="w-full h-[350px] flex flex-col items-center justify-center"
          >
            <h1 class="font-bold text-lg text-center">
              Đường dẫn đặt lại mật khẩu đã gửi đến
              <a
                href="https://mail.google.com"
                target="_blank"
                class="text-button"
                >email</a
              >!
            </h1>
            <p class="text-center">
              Kiểm tra email để lấy đường dẫn đặt lại mật khẩu!
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import OptionalButton from "@/components/VueButton.vue";

import repositoryFactory from "@/api/repositoryFactory";
const userRepo = repositoryFactory.get("users");

import { useToast } from "vue-toastification";

export default {
  components: {
    OptionalButton,
  },
  setup() {
    const toast = useToast();
    const TOAST_OPTIONS = {
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

    const email = ref("");
    const validEmail = ref(true);

    const isSuccess = ref(false);

    const onSubmit = async () => {
      try {
        const res = await userRepo.resetPassEmail({ email: email.value });
        if (res?.data.success) {
          isSuccess.value = true;
          toast.success("Link đã gửi đến email!", TOAST_OPTIONS);
        } else {
          if (res.data.message === "The Email is not registered with us") {
            validEmail.value = false;
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    return { email, onSubmit, validEmail, isSuccess };
  },
};
</script>

<style lang="scss" scoped>
.row {
  @apply w-full my-2 h-fit flex flex-col px-4 md:px-12;
}
.submit-btn {
  @apply my-4 w-fit px-5 py-3 border-[1px] border-gray-500 rounded-lg bg-button cursor-pointer hover:scale-110 transition-all text-white;
}
.error {
  @apply outline outline-pink-500;
}
</style>
