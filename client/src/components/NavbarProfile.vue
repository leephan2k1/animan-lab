<template>
  <div
    @click.stop="handleClickProfile"
    class="h-10 w-12 md:w-44 bg-white rounded-xl flex items-center justify-around cursor-pointer shadow-lg select-none"
  >
    <div class="w-8 h-8 rounded-full overflow-hidden absolute-center">
      <img
        :src="
          userProfile.avatar === 'default'
            ? require('@/assets/images/defaultAvatar.jpg')
            : userProfile.avatar
        "
        alt="avatar"
        v-if="isLogged"
      />
      <VueButton v-else buttonType="profile" styles="w-8 h-8" />
    </div>
    <p
      class="md:block hidden max-w-[85px] overflow-hidden whitespace-nowrap text-ellipsis"
    >
      {{ userProfile.user_name }}
    </p>
    <VueButton
      :buttonType="!toggleDropDown ? 'chervon-down' : 'up'"
      :styles="
        !toggleDropDown
          ? 'animate__rotateIn md:block hidden animate__animated animate__faster'
          : 'animate__rotateIn md:block hidden animate__animated animate__faster'
      "
    />
  </div>
  <div
    class="absolute top-[50px] w-[150%] md:w-full lg:w-[49%] h-fit bg-white rounded-2xl shadow-xl animate__animated animate__fadeInDown animate__faster z-20"
    v-if="toggleDropDown"
  >
    <div v-if="!isLogged" class="flex flex-col justify-center items-center">
      <router-link class="py-2 hover:text-button" :to="{ name: 'login' }"
        >Đăng nhập</router-link
      >
      <router-link class="py-2 hover:text-button" :to="{ name: 'register' }"
        >Đăng ký</router-link
      >
    </div>
    <div v-else class="flex flex-col justify-center items-center">
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="user-circle" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'profile', params: { username: 'lee' } }"
          >Trang cá nhân</router-link
        >
      </div>
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="pencil-alt" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'register' }"
          >Đăng bài</router-link
        >
      </div>
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="pencil" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'register' }"
          >Bài viết của tôi</router-link
        >
      </div>
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="sparkles" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'register' }"
          >Waifu của tôi</router-link
        >
      </div>
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="heart" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'register' }"
          >Bài viết yêu thích</router-link
        >
      </div>
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="bookmark" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'register' }"
          >Bài viết bookmark</router-link
        >
      </div>
      <div class="absolute-center w-full cursor-pointer hover:text-button">
        <VueButton buttonType="cog" styles="basis-1/3" />
        <router-link
          class="basis-2/3 py-2 hover:text-button"
          :to="{ name: 'register' }"
          >Cài đặt</router-link
        >
      </div>
      <div
        @click="handleSignOut"
        class="absolute-center w-full cursor-pointer hover:text-button"
      >
        <VueButton buttonType="logout" styles="basis-1/3" />
        <p class="basis-2/3 py-2">Đăng xuất</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { AUTH_LOGOUT } from "@/constants";
import VueButton from "./VueButton.vue";

export default {
  components: {
    VueButton,
  },
  setup() {
    const userProfile = reactive({});
    const isLogged = ref(false);
    const toggleDropDown = ref(false);
    const store = useStore();
    const app = document.querySelector("#app");
    const route = useRouter();

    const getUserProfile = () => {
      const { user_name, avatar } = store.state.user;
      userProfile.user_name = user_name || "Hi there!";
      userProfile.avatar = avatar || "default";
    };

    const checkUserLogin = () => {
      isLogged.value = store.getters["auth/isAuthenticated"];
    };

    const handleSignOut = async () => {
      await store.dispatch(`auth/${AUTH_LOGOUT}`);
      //toggle component
      checkUserLogin();
      //redirect to home
      route.push({ name: "home" });
    };

    const handleClickProfile = () => {
      toggleDropDown.value = !toggleDropDown.value;
    };

    const handleClickApp = () => {
      toggleDropDown.value = false;
    };

    onMounted(() => {
      app.addEventListener("click", handleClickApp);
    });

    onUnmounted(() => {
      app.removeEventListener("click", handleClickApp);
    });

    checkUserLogin();
    getUserProfile();

    return {
      userProfile,
      isLogged,
      toggleDropDown,
      handleClickProfile,
      handleSignOut,
    };
  },
};
</script>
