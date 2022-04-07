<template>
  <div class="container mx-auto h-full">
    <!-- form container  -->
    <div class="md:h-[40rem] min-h-full w-full py-4 absolute-center flex-cols">
      <!-- form warper  -->
      <div
        class="bg-white rounded-2xl overflow-hidden shadow-2xl w-3/4 md:w-1/2 lg:w-[30%] h-fit"
      >
        <!-- nav  -->

        <div class="w-full h-16 flex items-center justify-around py-2">
          <p class="font-semibold uppercase text-sm md:text-xl text-gray-800">
            Đặt lại mật khẩu
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
            <label for="pass" class="my-1">
              <span>Mật khẩu: </span>
            </label>
            <input
              v-model="newPass"
              type="password"
              ref="newPassInput"
              required
              :class="{ error: !validPass.validNewPass }"
              @keyup="validPass.validNewPass = true"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Mật khẩu mới..."
            />
            <div
              v-if="!validPass.validNewPass"
              class="message text-red-500 text-sm"
            >
              <p>Mật khẩu cần có ít nhất 6 ký tự.</p>
            </div>
          </div>

          <div class="row">
            <label for="re-pass" class="my-1">
              <span>Nhập lại mật khẩu: </span>
            </label>
            <input
              v-model="reNewPass"
              type="password"
              ref="reNewPassInput"
              required
              :class="{ error: !validPass.validReNewPass }"
              @keyup="validPass.validReNewPass = true"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập lại mật khẩu mới..."
            />
            <div
              v-if="!validPass.validReNewPass"
              class="message text-red-500 text-sm"
            >
              <p>Mật khẩu nhập lại không đúng!</p>
            </div>
          </div>

          <p v-if="!validLink" class="text-center text-red-500">
            Đường đẫn đặt lại mật khẩu đã hết hiệu lực
          </p>

          <div class="row absolute-center">
            <input class="submit-btn" type="submit" value="Lưu" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import OptionalButton from "@/components/VueButton.vue";
import { useToast } from "vue-toastification";

import repositoryFactory from "@/api/repositoryFactory";
const userRepo = repositoryFactory.get("users");

export default {
  components: {
    OptionalButton,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const newPass = ref("");
    const reNewPass = ref("");

    const validLink = ref(true);

    const newPassInput = ref(null);
    const reNewPassInput = ref(null);

    const token = computed(() => route.query.token);

    const toast = useToast();
    const TOAST_OPTIONS = {
      position: "top-center",
      timeout: 3000,
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

    const validPass = reactive({
      validNewPass: true,
      validReNewPass: true,
    });

    const validateNewPass = () => {
      if (newPass.value === "" || newPass.value.length < 6) {
        validPass.validNewPass = false;
        return false;
      }
      return true;
    };

    const validateRePass = () => {
      validPass.validReNewPass = true;
      if (newPass.value && reNewPass.value !== newPass.value) {
        validPass.validReNewPass = false;
        return false;
      }
      return true;
    };

    const onSubmit = async () => {
      if (!validateRePass() || !validateNewPass()) {
        return;
      }

      try {
        //submit
        const res = await userRepo.resetPassword(
          { password: newPass.value },
          token.value
        );
        //back to login
        if (res?.data.success) {
          validLink.value = true;
          toast.success("Đặt lại mật khẩu thành công!", TOAST_OPTIONS);
          setTimeout(() => {
            router.push({ name: "login" });
          }, 3000);
        } else {
          validLink.value = false;
        }
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(() => {
      const newPass = newPassInput.value;
      if (newPass) newPass.addEventListener("focusout", validateNewPass);
    });

    onUnmounted(() => {
      const newPass = newPassInput.value;
      if (newPass) newPass.removeEventListener("focusout", validateNewPass);
    });

    return {
      newPass,
      reNewPass,
      validPass,
      newPassInput,
      reNewPassInput,
      validateRePass,
      onSubmit,
      validLink,
    };
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
