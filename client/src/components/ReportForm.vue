<template>
  <div
    class="w-3/4 lg:w-1/2 min-h-1/2 h-fit bg-main absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[40%] rounded-lg overflow-hidden border-2 border-gray-400"
  >
    <div class="w-full h-12 flex items-center justify-end">
      <div
        @click="handleToggleReportForm"
        class="border-[1px] border-gray-400 rounded-full h-8 w-8 absolute-center cursor-pointer mr-2 select-none"
      >
        <VueButton />
      </div>
    </div>
    <h3 class="text-center md:text-lg select-none">
      Có điều gì khiến bạn không hài lòng?
    </h3>

    <form @submit.prevent="onSubmit" class="w-3/4 mx-auto mt-4">
      <div class="w-full flex flex-col">
        <label for="">Tên của bạn: </label>
        <input
          v-model="formValue.name"
          ref="inputName"
          class="border-[1px] border-gray-300 rounded-md p-2"
          type="text"
          placeholder="guest..."
          required
        />
      </div>
      <div class="w-full flex flex-col">
        <label for="">Email: </label>
        <input
          v-model="formValue.email"
          class="border-[1px] border-gray-300 rounded-md p-2"
          type="email"
          placeholder="example@gmail.com"
          required
        />
      </div>
      <div class="w-full flex flex-col">
        <label for="">Lý do báo cáo: </label>
        <input
          v-model="formValue.title"
          class="border-[1px] border-gray-300 rounded-md p-2"
          type="text"
          placeholder="Bài viết có ngôn từ không phù hợp..."
          required
        />
      </div>
      <div class="w-full flex flex-col">
        <label for="">Nội dung: </label>
        <textarea
          v-model="formValue.content"
          class="border-[1px] border-gray-300 rounded-md p-2 mb-4"
          cols="30"
          rows="5"
          required
        ></textarea>
      </div>
      <!-- submit  -->
      <div class="w-full absolute-center my-4">
        <button
          @click.stop="handleReportForm"
          class="bg-button text-white w-20 h-9 border-[1px] border-gray-400 rounded-md"
        >
          Báo cáo
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },
  setup(_, { emit }) {
    const inputName = ref(null);
    const formValue = ref({
      name: "",
      email: "",
      title: "",
      content: "",
    });

    const handleToggleReportForm = () => {
      emit("handleReport", {
        toggle: false,
      });
    };

    const validateForm = (value) => {
      if (!value || !value?.length || value === "") return false;
      return true;
    };

    const validateEmail = (email) => {
      return String(email).match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };

    const handleReportForm = () => {
      formValue.value.email = formValue.value.email.trim().toLowerCase();
      if (
        !validateForm(formValue.value.name) ||
        !validateEmail(formValue.value.email) ||
        !validateForm(formValue.value.title) ||
        !validateForm(formValue.value.content)
      ) {
        window.alert("Email không hợp lệ hoặc còn nội dung rỗng!");
        return;
      }
      emit("handleSubmitForm", {
        formValue: formValue.value,
      });
    };

    onMounted(() => {
      inputName.value.focus();
    });

    return { handleToggleReportForm, inputName, formValue, handleReportForm };
  },
};
</script>
