<template>
  <div class="w-full min-h-[700px] h-fit md:h-[800px]">
    <div class="w-full h-fit grid grid-cols-2">
      <div class="col-span-2 md:col-span-1 flex flex-col items-center">
        <div
          class="w-3/4 md:w-full h-[150px] flex flex-col justify-center text-lg my-4 bg-white rounded-xl shadow-lg"
        >
          <p class="ml-4 hover:text-button cursor-pointer">
            Nghiên cứu đã viết:
            <span class="font-bold">{{ profile?.posts?.length }}</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Nghiên cứu đã thích:
            <span class="font-bold">{{ profile?.like_list?.length }}</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Nghiên cứu đang theo dõi:
            <span class="font-bold">{{ profile?.bookmark_posts?.length }}</span>
          </p>
        </div>
        <div
          class="w-3/4 md:w-full h-[150px] flex flex-col justify-center text-lg my-4 bg-white rounded-xl shadow-lg"
        >
          <p class="ml-4 hover:text-button cursor-pointer">
            Danh hiệu: <span class="font-bold">{{ profile.roleName }}</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Điểm: <span class="font-bold">{{ profile.points }}</span>
          </p>
          <div class="ml-4 my-2">
            <k-progress
              class="whitespace-nowrap"
              :percent="Math.ceil(profile.points / 10)"
              :format="format"
              active
              :color="['#f5af19', '#f12711', '#9254de', '#40a9ff', '#5cdbd3']"
            ></k-progress>
          </div>
        </div>
        <div
          class="w-3/4 md:w-full h-[150px] flex flex-col justify-center text-lg my-4 bg-white rounded-xl shadow-lg"
        >
          <p class="ml-4 hover:text-button cursor-pointer">
            Căn cước công dân wibu:
            <span class="font-bold">{{
              profile.last_name + " " + profile.first_name
            }}</span>
          </p>
          <p class="ml-4 hover:text-button cursor-pointer">
            Trở thành học giả wibu:
            <span class="font-bold">{{ profile.createdAt }}</span>
          </p>
        </div>
      </div>
      <div
        class="col-span-2 md:col-span-1 flex flex-col items-center md:items-end"
      >
        <div
          class="md:mb-0 mb-12 mt-4 w-[90%] h-fit bg-white rounded-xl shadow-xl flex flex-col"
        >
          <h2 class="text-center font-bold py-4">Cách tính điểm</h2>
          <ul class="w-full list-circle list-inside">
            <li class="my-2 ml-4">
              Nghiên cứu được phê duyệt:
              <span class="font-bold">10 points</span>
            </li>
            <li class="my-2 ml-4">
              Nghiên cứu bị xoá bởi admin (Vi phạm luật pháp wibu):
              <span class="font-bold">-10 points</span>
            </li>
            <li class="my-2 ml-4">
              Mỗi like trên nghiên cứu: <span class="font-bold">1 point</span>
            </li>
            <li class="my-2 ml-4">
              Phản biện nghiên cứu (comment dạo):
              <span class="font-bold">1 point</span>
            </li>
            <li class="my-2 ml-4">
              Phản biện được thích (comment được like):
              <span class="font-bold">1 point</span>
            </li>
          </ul>
          <h2 class="text-center font-bold py-4">Cách tính danh hiệu</h2>
          <ul class="w-full list-circle list-inside">
            <li class="my-2 ml-4">
              0 point:
              <span class="font-bold">Con dân wibu</span>
            </li>
            <li class="my-2 ml-4">
              50 points:
              <span class="font-bold">Thạc sĩ wibu</span>
            </li>
            <li class="my-2 ml-4">
              100 points: <span class="font-bold">Tiến sĩ Otachym</span>
            </li>
            <li class="my-2 ml-4">
              300 points :
              <span class="font-bold">Giáo sư weeaboo</span>
            </li>
            <li class="my-2 ml-4">
              500 points:
              <span class="font-bold">Lãnh tụ tinh thần wibu</span>
            </li>
            <li class="my-2 ml-4">
              1000 points:
              <span class="font-bold">Đấng cứu thế wibu được Isekai</span>
            </li>
          </ul>
          <h2 class="text-center font-bold py-4">Animan rules</h2>
          <ul class="w-full list-circle list-inside">
            <li class="my-2 ml-4">
              Vi phạm điều khoản lần đầu:
              <span class="font-bold">Cấm bình luận và đăng bài</span>
            </li>
            <li class="my-2 ml-4">
              Vi phạm điều khoản lần hai:
              <span class="font-bold">Xoá tài khoản</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import KProgress from "k-progress-v3";
import computeLevelName from "@/utils/computeLevelName";

import repositoryFactory from "@/api/repositoryFactory";
const userRepository = repositoryFactory.get("users");

export default {
  components: {
    "k-progress": KProgress,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const public_user_name = computed(() => route.params.username);
    const profile = ref({});

    //tracking user name change:
    watch(public_user_name, () => {
      synchronizeFunction();
    });

    const getProfile = async () => {
      const localProfile = store.getters["user/getProfile"];
      const { user_name } = localProfile;
      //public profile
      if (user_name !== public_user_name.value) {
        try {
          const res = await userRepository.getUser(public_user_name.value);
          if (res?.data.success) {
            profile.value = res.data.user;
          }
        } catch (err) {
          console.error(err);
        }
      }
      //local profile
      else {
        profile.value = localProfile;
      }
    };

    const configProfileData = () => {
      //handle achievement:
      if (!profile?.value.roleName) {
        profile.value.roleName = computeLevelName(profile.value.points);
      }
      //handle ISO date
      if (profile?.value.createdAt) {
        profile.value.createdAt = new Date(profile.value.createdAt)
          .toISOString()
          .substring(0, 10);
      }
    };

    const format = (percent) => {
      if (percent > 1000) {
        percent = 1000;
        return " -Infinity- ";
      }
      return `${Math.ceil(percent / 10)} %`;
    };

    const synchronizeFunction = async () => {
      await getProfile();
      configProfileData();
    };

    synchronizeFunction();

    return { format, profile };
  },
};
</script>
