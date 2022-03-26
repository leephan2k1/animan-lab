<template>
  <div class="w-full h-fit mt-7">
    <div
      v-for="item in postData"
      :key="item?._id"
      class="w-full my-4 h-fit overflow-hidden grid grid-cols-3"
    >
      <div class="w-full h-full cursor-pointer col-span-1 absolute-center">
        <img
          class="w-[80%] max-h-[70%] md:max-h-[90%] rounded-xl"
          :src="item?.images_url[0]"
          alt="thumbnail"
        />
      </div>
      <div class="col-span-2 h-fit py-2 cursor-pointer">
        <!-- title  -->
        <h2
          class="pr-2 md:text-2xl text-lg lg:w-[80%] post-title overflow-hidden hover:text-button"
        >
          {{ item?.title }}
        </h2>
        <div class="pr-2 lg:w-[80%]">
          <div class="overflow-hidden post-desc">
            <p class="md:block hidden" v-html="item.plainText"></p>
          </div>
          <div class="w-full overflow-hidden whitespace-nowrap">
            <span class="text-[15px] text-gray-400 hover:text-button">{{
              item?.author_name
            }}</span>
            <span class="text-[15px] text-gray-400">
              | {{ convertISODate(item?.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from "vue";

export default {
  props: {
    title: {
      type: String,
    },
    postsData: {
      type: Array,
    },
  },
  setup(props) {
    const postData = computed(() => props.postsData);

    watch(postData, () => {
      // console.log(postData.value);
    });

    const convertISODate = (ISODate) => {
      return new Date(ISODate).toISOString().substring(0, 10);
    };

    return { postData, convertISODate };
  },
};
</script>
