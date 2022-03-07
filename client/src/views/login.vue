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
            Đăng nhập
          </p>
          <router-link :to="{ name: 'home' }">
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
              <span>Email: <span class="text-red-500">*</span> </span>
            </label>
            <input
              type="text"
              ref="emailRef"
              required
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập email của bạn..."
            />
          </div>
          <div class="row">
            <label for="password" class="my-1">
              <span>Mật khẩu: <span class="text-red-500">*</span> </span>
            </label>
            <input
              type="password"
              required
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập mật khẩu..."
            />
          </div>
          <div class="row">
            <div class="w-full flex items-center mt-1">
              <a class="hover:underline hover:decoration-solid" href="#"
                >Quên mật khẩu?</a
              >
            </div>
          </div>
          <div class="row absolute-center">
            <input class="submit-btn" type="submit" value="Đăng nhập" />
          </div>
          <div class="row absolute-center pb-2">
            <p>
              Chưa có tài khoản?
              <router-link class="text-blue-500" :to="{ name: 'register' }"
                >Đăng ký</router-link
              >
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import OptionalButton from "@/components/VueButton.vue";
import { ref, onMounted } from "vue";

export default {
  components: {
    OptionalButton,
  },
  setup() {
    const emailRef = ref();

    function onSubmit() {
      console.log("submit");
    }

    onMounted(() => {
      if (emailRef.value) {
        emailRef.value.focus();
      }
    });

    return { onSubmit, emailRef };
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
