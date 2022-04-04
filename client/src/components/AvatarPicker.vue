<template>
  <div ref="waifuForm" class="w-[99%] mx-auto h-full bg-white rounded-lg">
    <div class="w-full h-12 flex items-center justify-end">
      <div
        @click.stop="handleCloseForm"
        class="border-[1px] border-gray-400 rounded-full h-8 w-8 absolute-center cursor-pointer mr-2 select-none"
      >
        <VueButton />
      </div>
    </div>
    <h2 class="text-center text-lg font-bold">Chọn nhân vật để làm Avatar!</h2>

    <div class="w-full absolute-center my-4">
      <input
        ref="inputForm"
        @keyup="handleSearchWaifu"
        class="w-[60%] p-2 border-[1px] border-gray-400 rounded-lg"
        autocomplete="off"
        type="text"
        name="search"
        placeholder="Nhân vật yêu thích của bạn là ai?..."
      />
    </div>

    <div class="w-full md:h-[73%] h-[70%]">
      <div
        class="w-[95%] md:w-[80%] h-full mx-auto grid grid-cols-4 gap-2 overflow-x-hidden"
      >
        <!-- result waifu 
           -->
        <template
          v-if="
            dataResult &&
            dataResult.length > 0 &&
            !isString(dataResult) &&
            !isTyping
          "
        >
          <div
            v-for="(data, index) in dataResult"
            :key="data?.mal_id || index"
            class="col-span-2 lg:col-span-1 h-[250px] rounded-md overflow-hidden flex flex-col border-[1px] border-gray-300 shadow-xl"
          >
            <div
              :style="{
                backgroundImage: `url(${data?.image_url})`,
              }"
              class="w-full h-[70%] bg-center bg-cover bg-no-repeat rounded-t-lg"
            ></div>
            <p
              class="px-1 w-full h-[10%] whitespace-nowrap text-ellipsis overflow-hidden text-sm text-center"
            >
              {{ data?.name }}
            </p>
            <a
              class="text-center text-button text-sm h-[10%]"
              target="_blank"
              :href="data?.url"
              >Thông tin
            </a>
            <button
              @click.stop="handleAddWaifu"
              :data-mal-id="data?.mal_id"
              class="w-full h-[10%] bg-button text-white text-sm rounded-b-lg"
            >
              Đặt làm Avatar
            </button>
          </div>
        </template>
        <template
          v-if="
            (!dataResult || dataResult.length === 0) &&
            !isString(dataResult) &&
            isTyping
          "
        >
          <div class="w-full h-10 col-span-4 absolute-center">
            <VueButton
              styles="animate__animated animate__rotateIn animate__faster animate__infinite"
              buttonType="refresh"
            />
          </div>
        </template>
        <!-- result waifu  -->
        <h2
          v-if="isString(dataResult) && dataResult === 'error or not found'"
          class="text-center col-span-4"
        >
          (∩︵∩) Waifu của bạn chưa từng tồn tại.
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted, onMounted } from "vue";
import VueButton from "@/components/VueButton.vue";

import jikanjs from "jikanjs";
import { isString } from "@/utils/checkType";

export default {
  components: {
    VueButton,
  },
  setup(_, { emit }) {
    // const isOpenForm = ref(true);
    const debounceTime = ref(null);
    const dataResult = ref([]);
    const inputForm = ref(null);

    const waifuForm = ref(null);
    const isTyping = ref(false);

    const handleCloseForm = () => {
      dataResult.value = [];
      emit("toggleWaifuForm", false);
    };

    const handleSearchWaifu = (e) => {
      isTyping.value = true;
      dataResult.value = [];
      if (debounceTime.value) {
        clearTimeout(debounceTime.value);
      }
      debounceTime.value = setTimeout(async () => {
        isTyping.value = false;
        try {
          const res = await jikanjs.search("character", e.target.value, 1);
          if (res?.results) {
            dataResult.value = res?.results;
          } else {
            dataResult.value = "error or not found";
          }
        } catch (err) {
          console.log(err);
        }
      }, 600);
    };

    const handleAddWaifu = async (e) => {
      const id = e.target.getAttribute("data-mal-id");

      const waifuObj = dataResult.value.find(
        (waifu) => String(waifu.mal_id) === id
      );

      if (waifuObj) {
        emit("avatarURL", waifuObj?.image_url);
      }
    };

    onMounted(() => {
      const input = inputForm.value;
      input.focus();
      input.value = "";
    });

    //clean up result:
    onUnmounted(() => {
      dataResult.value = [];
    });

    return {
      handleSearchWaifu,
      dataResult,
      isString,
      handleAddWaifu,
      waifuForm,
      handleCloseForm,
      isTyping,
      inputForm,
    };
  },
};
</script>
