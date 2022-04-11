<template>
  <div class="w-full h-full relative">
    <StatusCreator @openStatusEditor="handleOpenStatusEditor" />
    <StatusEditor :openEditor="triggerOpenEditor" />
    <VueStatus @infinite="loadMore" :data="data" />
  </div>
</template>

<script>
import { onMounted, ref, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";

import StatusCreator from "@/components/StatusCreator.vue";
import StatusEditor from "@/components/StatusEditor.vue";
import VueStatus from "@/components/VueStatus.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepo = repositoryFactory.get("posts");
const userRepo = repositoryFactory.get("users");

import { useHead } from "@vueuse/head";

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

    const route = useRoute();
    const params = computed(() => route.params.shortType);

    const OPTIONS = {
      limit: 5,
      sort: "desc",
      tags: "short",
      populate: "user",
    };

    const handleOpenStatusEditor = () => {
      triggerOpenEditor.value = !triggerOpenEditor.value;
    };

    useHead({
      title: computed(() => `Animan Lab`),
      meta: [
        {
          name: "description",
          content: computed(() => `Short Animans - Cảm nhận nhanh`),
        },
        {
          property: "og:description",
          content: computed(() => `Short Animans - Cảm nhận nhanh`),
        },
        {
          property: "og:url",
          content: computed(() => window.location.href),
        },
        {
          property: "og:image",
          content: computed(() => require("@/assets/images/thumbnail.png")),
        },
        {
          property: "og:site_name",
          content: "Animan Lab",
        },
      ],
    });

    onUnmounted(() => {
      useHead({
        title: "Animan Lab",
        meta: [
          {
            name: "description",
            content: "Animan Lab",
          },
          {
            property: "og:description",
            content: "Animan Lab",
          },
          {
            property: "og:url",
            content: computed(() => window.location.href),
          },
          {
            property: "og:image",
            content: computed(() => require("@/assets/images/thumbnail.png")),
          },
          {
            property: "og:site_name",
            content: "Animan Lab",
          },
        ],
      });
    });

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

    const fetchOptionData = async () => {
      try {
        const res = await postRepo.getPost(params.value);
        if (res?.data.success) {
          const post = res.data.post;

          const res_author = await userRepo.getUser(post?.author_name);
          if (res_author?.data.success) {
            //assign author_id because config in VueStatus.vue
            post.author_id = res_author.data?.user;
            data.value.push(post);
          }
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

    const computeURL = () => {
      return window.location.href;
    };

    onMounted(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    if (params.value === "animans") {
      fetchData();
    } else {
      fetchOptionData();
    }

    return {
      fakeData,
      handleOpenStatusEditor,
      triggerOpenEditor,
      data,
      loadMore,
      computeURL,
    };
  },
};
</script>
