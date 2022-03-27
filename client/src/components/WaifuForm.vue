<template>
  <div
    ref="waifuForm"
    class="w-3/4 md:h-[80%] h-[65%] bg-white border-[1px] border-gray-500 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-[60%] -translate-y-[70%]"
  >
    <div class="w-full h-12 flex items-center justify-end">
      <div
        @click.stop="handleCloseForm"
        class="border-[1px] border-gray-400 rounded-full h-8 w-8 absolute-center cursor-pointer mr-2 select-none"
      >
        <VueButton />
      </div>
    </div>
    <h2 class="text-center text-lg font-bold">Thêm waifu!</h2>

    <div class="w-full absolute-center my-4">
      <input
        ref="inputForm"
        @keyup="handleSearchWaifu"
        class="w-[60%] p-2 border-[1px] border-gray-400 rounded-lg"
        type="text"
        placeholder="Waifu của bạn là ai?..."
      />
    </div>

    <div class="w-full md:h-[73%] h-[70%] overflow-hidden">
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
              Thêm waifu
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
import { ref, onUnmounted } from "vue";
import VueButton from "@/components/VueButton.vue";
import { useToast } from "vue-toastification";

import jikanjs from "jikanjs";
import { isString } from "@/utils/checkType";

import { useStore } from "vuex";
import { USER_UPDATE } from "@/constants";

import repositoryFactory from "@/api/repositoryFactory";
const userRepository = repositoryFactory.get("users");

export default {
  components: {
    VueButton,
  },
  setup(_, { emit }) {
    // const isOpenForm = ref(true);
    const debounceTime = ref(null);
    const dataResult = ref([]);
    const store = useStore();
    const toast = useToast();
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
          console.log(res?.results);
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
      const profile = store.getters["user/getProfile"];
      const { user_name } = profile;

      const waifuObj = dataResult.value.find(
        (waifu) => String(waifu.mal_id) === id
      );

      const tags = [];
      if (waifuObj?.anime.length > 0) tags.push("anime");
      if (waifuObj?.manga.length > 0) tags.push("manga");

      if (waifuObj) {
        try {
          const res = await userRepository.addWaifu(user_name, {
            title: waifuObj.name,
            description: waifuObj.url,
            image: waifuObj.image_url,
            tags,
          });
          if (res?.data.success) {
            //close form
            emit("toggleWaifuForm", false);
            //reset result
            dataResult.value = [];
            //update vuex store
            profile.myLove_list.push(res.data.myLove._id);
            await store.dispatch(`user/${USER_UPDATE}`, profile);
            //message:
            toast.success("Thêm waifu thành công", {
              position: "top-center",
              timeout: 2000,
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
            });
          } else {
            if (res?.data.message === "Waifu already exist") {
              toast.error("Waifu đã được thêm trước đó", {
                position: "top-center",
                timeout: 2000,
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
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

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
