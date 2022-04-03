<template>
  <div class="w-full h-full relative">
    <StatusCreator @openStatusEditor="handleOpenStatusEditor" />
    <StatusEditor :openEditor="triggerOpenEditor" />
    <VueStatus @infinite="loadMore" :data="data" />
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

import StatusCreator from "@/components/StatusCreator.vue";
import StatusEditor from "@/components/StatusEditor.vue";
import VueStatus from "@/components/VueStatus.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepo = repositoryFactory.get("posts");

export default {
  components: {
    StatusCreator,
    VueStatus,
    StatusEditor,
  },
  setup() {
    const fakeData = [...Array(10).keys()];
    const triggerOpenEditor = ref(false);

    const data = ref([]);
    const page = ref(1);
    const hasNextPage = ref(false);

    const OPTIONS = {
      limit: 5,
      sort: "desc",
      tags: "short",
      populate: "user",
    };

    const handleOpenStatusEditor = () => {
      triggerOpenEditor.value = !triggerOpenEditor.value;
    };

    const fetchData = async () => {
      try {
        const params = {
          page: page.value,
          limit: OPTIONS.limit,
          sort: OPTIONS.sort,
          tags: OPTIONS.tags,
          populate: OPTIONS.populate,
        };
        const res = await postRepo.searchPost(params);
        if (res?.data.success) {
          if (page.value === 1) {
            data.value = res.data?.posts.docs;
          } else {
            data.value = data.value.concat(res.data?.posts.docs);
          }
          hasNextPage.value = res.data?.posts.hasNextPage;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const loadMore = (state) => {
      //setTimeout make sure skeleton always is loaded
      setTimeout(async () => {
        try {
          if (hasNextPage.value) {
            //next page:
            page.value++;
            //fetch next page:
            await fetchData();
            //loading
            state.loaded();
          } else {
            hasNextPage.value = false;
            state.complete();
          }
        } catch (err) {
          state.error();
        }
      }, 500);
    };

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    fetchData();

    return {
      fakeData,
      handleOpenStatusEditor,
      triggerOpenEditor,
      data,
      loadMore,
    };
  },
};
</script>
