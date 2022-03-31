<template>
  <div class="w-full h-[300px] mt-11 mb-4">
    <!-- title  -->
    <div
      class="border-l-4 border-button px-2 flex items-center cursor-pointer hover:text-button"
    >
      <h1 class="text-sm font-semibold uppercase">
        {{ title }}
      </h1>
      <VueButton buttonType=">" />
    </div>
    <!-- contents  -->
    <div class="w-full h-full absolute-center flex-wrap gap-4">
      <!-- list rank  -->
      <div
        v-for="(user, index) in usersRankData"
        :key="user?._id || index"
        class="w-[40%] h-[40%] absolute-center"
      >
        <router-link
          :to="{
            name: 'profileAchievements',
            params: { username: user?.user_name },
          }"
          class="lg:w-3/4 w-full h-full bg-white rounded-xl shadow-xl flex cursor-pointer"
        >
          <!-- rank  -->
          <div class="basis-1/6 absolute-center">
            <VueButton buttonType="hash" styles="text-button" />
            <span class="text-2xl text-button">{{ index + 1 }}</span>
          </div>
          <div
            class="basis-5/6 flex md:flex-row flex-col items-center justify-center md:justify-start"
          >
            <!-- avatar  -->
            <div>
              <div
                class="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-center bg-cover bg-no-repeat"
                :style="{
                  backgroundImage: `url(${avatarHandler(user)})`,
                }"
              ></div>
            </div>
            <!-- user name & points -->
            <div class="overflow-hidden">
              <p class="px-2 text-[12px] md:text-lg lg:text-lg">
                {{ user?.user_name }}
              </p>
              <p class="px-2 text-[12px] md:text-lg lg:text-lg">
                Points: {{ user?.points }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import VueButton from "@/components/VueButton.vue";

import repositoryFactory from "@/api/repositoryFactory";
const userRepo = repositoryFactory.get("users");

import { avatarHandler } from "@/utils/userHandler";

export default {
  props: {
    title: {
      type: String,
    },
  },
  components: {
    VueButton,
  },
  setup() {
    const OPTIONS = {
      qtyItem: 4,
    };
    const fakeData = [...Array(OPTIONS.qtyItem).keys()];
    const usersRankData = ref([]);

    const fetchUsrRanking = async () => {
      try {
        const params = {
          limit: OPTIONS.qtyItem,
          sortpoint: "desc",
        };
        const res = await userRepo.search(params);
        if (res?.data.success) {
          usersRankData.value = res.data?.users.docs;
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsrRanking();

    return { fakeData, usersRankData, avatarHandler };
  },
};
</script>
