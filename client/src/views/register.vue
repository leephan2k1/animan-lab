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
          <router-link :to="{ name: 'login' }">
            <OptionalButton
              buttonType="<"
              styles="cursor-pointer hover:scale-110 transition-all"
            />
          </router-link>
          <p class="font-semibold uppercase text-sm md:text-xl text-gray-800">
            Đăng ký tài khoản
          </p>
          <router-link :to="{ name: 'home' }">
            <button
              class="rounded-full w-8 h-8 absolute-center border-[1px] border-gray-300 hover:scale-110 transition-all"
            >
              <OptionalButton buttonType="x" />
            </button>
          </router-link>
        </div>

        <form @submit.prevent="onSubmit" ref="formRef">
          <div class="row">
            <label for="firstName" class="my-1">
              <span>Tên của bạn <span class="text-red-500">*</span> </span>
            </label>
            <input
              type="text"
              required
              name="firstName"
              v-model="formValues.firstName"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập tên của bạn..."
            />
          </div>
          <div class="row">
            <label for="lastName" class="my-1">
              <span>Họ của bạn: <span class="text-red-500">*</span> </span>
            </label>
            <input
              type="text"
              required
              v-model="formValues.lastName"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập họ của bạn..."
            />
          </div>
          <div class="row">
            <label for="userName" class="my-1">
              <span>Tên người dùng: <span class="text-red-500">*</span> </span>
            </label>
            <div
              class="message text-red-500 text-sm"
              v-if="validateForm.existUserName === true"
            >
              <p>User name đã tồn tại</p>
            </div>
            <input
              type="text"
              required
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập tên người dùng..."
              @keyup="onChangeUserName($event)"
            />
            <p class="text-gray-400 h-fit my-2">
              Thông tin này sẽ được hiển thị trên website sau này, không thể
              thay đổi.
            </p>
          </div>
          <div class="row">
            <label for="email" class="my-1">
              <span>Email: <span class="text-red-500">*</span> </span>
            </label>
            <div
              class="message text-red-500 text-sm"
              v-if="!validateForm.validEmail || validateForm.existEmail"
            >
              <p>
                {{
                  !validateForm.validEmail
                    ? "Email không hợp lệ"
                    : "Email đã được sử dụng"
                }}
              </p>
            </div>
            <input
              type="email"
              name="email"
              required
              @keyup="onChangeEmail($event)"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập email của bạn..."
            />
          </div>
          <div class="row">
            <label for="password" class="my-1">
              <span>Mật khẩu: <span class="text-red-500">*</span> </span>
            </label>
            <div
              class="message text-red-500 text-sm"
              v-if="validateForm.weakPassword"
            >
              <p>Yêu cầu mật khẩu từ 6 ký tự...</p>
            </div>
            <input
              type="password"
              name="password"
              required
              v-model="formValues.password"
              @keyup="resetCSSpassword"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập mật khẩu..."
            />
          </div>
          <div class="row">
            <label for="rePassword" class="my-1">
              <span
                >Nhập lại mật khẩu: <span class="text-red-500">*</span>
              </span>
            </label>
            <div
              class="message text-red-500 text-sm"
              v-if="!validateForm.matchPassword"
            >
              <p>Mật khẩu nhập lại không khớp...</p>
            </div>
            <input
              type="password"
              required
              name="re-password"
              @keyup="resetCSSRepassword"
              class="h-8 p-2 rounded-md border-[1px] border-gray-700 focus:ring focus:border-blue-500"
              placeholder="Nhập lại mật khẩu..."
            />
          </div>
          <div class="row">
            <div class="w-full flex items-center">
              <input
                type="checkbox"
                class="mr-2 md:w-4 md:h-4 w-5 h-5"
                required
              />
              <p>
                Tôi đồng ý với
                <a class="text-blue-500" href="#">điều khoản dịch vụ</a>
              </p>
            </div>
          </div>
          <div
            class="row w-full h-20 flex absolute-center flex-col px-2 md:px-12"
          >
            <input class="submit-btn" type="submit" value="Đăng ký" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import OptionalButton from "@/components/VueButton.vue";
import { ref, reactive, onMounted } from "vue";

export default {
  components: {
    OptionalButton,
  },
  setup() {
    const formRef = ref();
    const validateForm = reactive({
      validEmail: true,
      existEmail: false,
      existUserName: false,
      weakPassword: false,
      matchPassword: true,
    });
    const formValues = reactive({
      firstName: "",
      lastName: "",
      user_name: "",
      email: "",
      password: "",
    });
    let debounceInput = ref(null);

    function onSubmit() {
      //checking strong password:
      if (!validatePassword(formValues.password)) {
        validateForm.weakPassword = true;
        formRef.value["password"].classList.add("error");
        return;
      }
      //checking match re-password:
      if (formRef.value["re-password"].value !== formValues.password) {
        validateForm.matchPassword = false;
        formRef.value["re-password"].classList.add("error");
        return;
      }

      //call api register
      console.log("form values: ", formValues);
    }

    function onChangeUserName(event) {
      if (debounceInput) {
        clearTimeout(debounceInput);
      }

      debounceInput = setTimeout(() => {
        formValues.user_name = event.target.value;

        //call api check user name:
        console.log(formValues.user_name);
      }, 800);
    }

    function onChangeEmail(event) {
      if (debounceInput) {
        clearTimeout(debounceInput);
      }

      debounceInput = setTimeout(() => {
        formValues.email = event.target.value.toLowerCase();
        //validate email:
        const bool = String(formValues.email).match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (!bool) {
          validateForm.validEmail = false;
          formRef.value["email"].classList.add("error");
        } else {
          validateForm.validEmail = true;
          formRef.value["email"].classList.remove("error");
        }

        //call api check email:
        console.log(formValues.email);
      }, 1200);
    }

    function validatePassword(value) {
      return value.length >= 6 ? true : false;
    }

    function resetCSSRepassword() {
      validateForm.matchPassword = true;
      formRef.value["re-password"].classList.remove("error");
    }
    function resetCSSpassword() {
      validateForm.weakPassword = false;
      formRef.value["password"].classList.remove("error");
    }

    onMounted(() => {
      if (formRef.value) {
        formRef.value["firstName"].focus();
      }
    });

    return {
      onSubmit,
      onChangeUserName,
      onChangeEmail,
      formRef,
      validateForm,
      formValues,
      resetCSSRepassword,
      resetCSSpassword,
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
  @apply outline outline-red-500;
}
</style>
