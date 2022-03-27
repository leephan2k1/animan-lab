<template>
  <div class="w-full min-h-[400px] h-fit">
    <div v-if="isWaifuOwner" class="w-full h-[50px] flex items-center">
      <div
        @click.stop="handleOpenWaifuForm"
        class="absolute-center border-[1px] border-gray-400 p-2 mt-2 rounded-xl cursor-pointer hover:text-button select-none"
      >
        <VueButton buttonType="plus" />
        <span class="mx-4">Thêm waifu</span>
      </div>
    </div>

    <div class="mt-4 w-full grid grid-cols-4 gap-4">
      <!-- list render  -->
      <template
        v-if="waifuData && waifuData.length > 0 && !isString(waifuData)"
      >
        <div
          v-for="data in waifuData"
          :key="data?._id"
          @click.stop="goToDetail"
          :data-waifu-desc="data?.description"
          class="lg:col-span-1 col-span-2 absolute-center z-0 cursor-pointer"
        >
          <div
            class="w-[200px] h-[300px] bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <!-- image  -->
            <div
              class="w-full h-[85%] bg-center bg-cover bg-no-repeat"
              :style="{
                backgroundImage: `url(${data?.image})`,
              }"
            >
              <div class="w-full h-[50px] flex justify-end">
                <button
                  @click.stop="handleRemoveWaifu"
                  :data-waifu-id="data?._id"
                  v-if="isWaifuOwner"
                  class="m-2 cursor-pointer hover:text-red-400 z-50"
                >
                  <VueButton buttonType="trash" />
                </button>
              </div>
            </div>
            <!-- title  -->
            <div class="w-full h-[15%] absolute-center">
              <p>{{ data?.title }}</p>
            </div>
          </div>
        </div>
      </template>
      <template
        v-if="(!waifuData || waifuData.length === 0) && !isString(waifuData)"
      >
        <div
          class="lg:col-span-1 col-span-2 absolute-center z-0 cursor-pointer"
          v-for="item in fakeData"
          :key="item"
        >
          <content-loader
            viewBox="0 0 400 460"
            :speed="1"
            primaryColor="#f3f3f3"
            secondaryColor="#dedede"
          >
            <rect x="78" y="53" rx="2" ry="2" width="249" height="372" />
          </content-loader>
        </div>
      </template>
      <h1
        class="text-center col-span-4"
        v-if="isString(waifuData) && waifuData === 'empty'"
      >
        Bạn chưa có waifu nào, thêm vào nút ở bên trên.
      </h1>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";

import { USER_UPDATE } from "@/constants";
import VueButton from "@/components/VueButton.vue";

import repositoryFactory from "@/api/repositoryFactory";
const userRepository = repositoryFactory.get("users");

import { isString } from "@/utils/checkType";

import { ContentLoader } from "vue-content-loader";

export default {
  components: {
    VueButton,
    ContentLoader,
  },
  props: {
    isWaifuOwner: {
      type: Boolean,
    },
    isFetchingWaifu: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const fakeData = [...Array(4).keys()];
    const waifuData = ref([]);
    const route = useRoute();
    const store = useStore();
    const toast = useToast();

    const isWaifuOwner = computed(() => props.isWaifuOwner);
    const user_name_public = computed(() => route.params.username);
    const isFetchingWaifu = computed(() => props.isFetchingWaifu);

    const handleOpenWaifuForm = () => {
      emit("toggleWaifuForm", true);
    };

    const handleRemoveWaifu = async (e) => {
      if (window.confirm("Bạn chắc chứ??")) {
        if (window.confirm("Tại sao bạn bội bạc thế, chắc khum?")) {
          if (window.confirm("Waifu này làm gì có lỗi? Chắc chứ lần cuối 🐧")) {
            const id = e.currentTarget.getAttribute("data-waifu-id");
            const profile = store.getters["user/getProfile"];
            const { user_name } = profile;

            try {
              const res = await userRepository.removeWaifu(user_name, { id });
              if (res?.data.success) {
                //update view
                waifuData.value = waifuData.value.filter(
                  (waifu) => waifu._id !== id
                );
                if (waifuData.value.length === 0) {
                  waifuData.value = "empty";
                }
                //update vuex store
                profile.myLove_list = profile.myLove_list.filter(
                  (waifu) => waifu !== id
                );
                await store.dispatch(`user/${USER_UPDATE}`, profile);
                //message
                toast.success("Xoá waifu thành công :((", {
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
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    };

    const goToDetail = (e) => {
      window.open(e.currentTarget.getAttribute("data-waifu-desc"));
    };

    const fetchWaifuData = async () => {
      try {
        const res = await userRepository.getWaifu(user_name_public.value);
        if (res?.data.success) {
          waifuData.value = res?.data.myLoves;
          if (waifuData.value.length === 0) {
            waifuData.value = "empty";
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    //fetch again if usr name or isFetching change
    watch([user_name_public, isFetchingWaifu], () => {
      fetchWaifuData();
    });

    //component first mount
    fetchWaifuData();

    return {
      fakeData,
      isWaifuOwner,
      handleOpenWaifuForm,
      waifuData,
      isString,
      handleRemoveWaifu,
      goToDetail,
    };
  },
};
</script>
