<template>
  <div class="mt-32 w-full h-[400px] bg-white rounded-lg relative">
    <img
      class="w-40 h-32 absolute -top-[116px]"
      src="@/assets/images/megumi-peaking-footer.png"
      alt="megumi"
    />
    <p class="pt-4 text-center text-2xl font-logo">Animan Lab</p>
    <p class="pt-2 text-center text-lg">
      Viện nghiên cứu cao cấp made by quý bửu | For wibu, By wibu.
    </p>
    <div class="w-full h-[45%] flex flex-cols md:text-base text-sm">
      <div class="basis-1/2 h-full text-right">
        <router-link
          @click="handleClickToDocs"
          class="hover:text-button cursor-pointer border-r-2 border-button mt-2 mr-4 w-full px-4 block"
          :to="{ name: 'docs', params: { doctype: 'terms-of-service' } }"
        >
          Điều khoản dịch vụ
        </router-link>
        <router-link
          @click="handleClickToDocs"
          class="hover:text-button cursor-pointer border-r-2 border-button mt-2 mr-4 w-full px-4 block"
          :to="{ name: 'docs', params: { doctype: 'purposes-of-the-website' } }"
        >
          Mục đích của website
        </router-link>
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'dcma' } }"
          class="hover:text-button cursor-pointer border-r-2 border-button mt-2 mr-4 w-full px-4 block"
        >
          DCMA
        </router-link>
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'contact' } }"
          class="hover:text-button cursor-pointer border-r-2 border-button mt-2 mr-4 w-full px-4 block"
        >
          Liên hệ
        </router-link>
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'privacy-policy' } }"
          class="hover:text-button cursor-pointer border-r-2 border-button mt-2 mr-4 w-full px-4 block"
        >
          Chính sách riêng tư
        </router-link>
      </div>
      <div class="basis-1/2 h-full md:text-base text-sm">
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'terms-of-service' } }"
          class="hover:text-button cursor-pointer mt-2 w-full px-4 block"
        >
          Terms of Service
        </router-link>
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'purposes-of-the-website' } }"
          class="hover:text-button cursor-pointer mt-2 w-full px-4 block"
        >
          The purpose of the website.
        </router-link>
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'dcma' } }"
          class="hover:text-button cursor-pointer mt-2 w-full px-4 block"
          >DCMA</router-link
        >
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'contact' } }"
          class="hover:text-button cursor-pointer mt-2 w-full px-4 block"
          >Contact</router-link
        >
        <router-link
          @click="handleClickToDocs"
          :to="{ name: 'docs', params: { doctype: 'privacy-policy' } }"
          class="hover:text-button cursor-pointer mt-2 w-full px-4 block"
        >
          Privacy Policy
        </router-link>
      </div>
    </div>
    <div class="mt-4 w-full h-fit text-center">
      <p>&copy; Lee Phan fd Animan Lab since 2022.</p>
      <div class="w-full flex items-center justify-center">
        <a
          class="mx-4 py-2"
          target="_blank"
          href="https://github.com/leephan2k1"
        >
          <VueButton styles="w-10 h-10" buttonType="github" />
        </a>
        <a
          class="mx-4 py-2"
          target="_blank"
          href="https://discordapp.com/users/lee2001#9563"
        >
          <VueButton styles="w-10 h-10" buttonType="discord" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import VueButton from "@/components/VueButton.vue";

export default {
  components: {
    VueButton,
  },
  setup() {
    const handleClickToDocs = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return { handleClickToDocs };
  },
};
</script>
