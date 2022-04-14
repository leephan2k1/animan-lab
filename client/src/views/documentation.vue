<template v-if="!isEmptyObject(contentRef)">
  <div class="w-full min-h-[500px] h-fit bg-white rounded-xl overflow-hidden">
    <h1 v-html="contentRef?.title"></h1>
    <div v-for="(content, index) in contentRef?.contents" :key="index">
      <h2 v-html="content?.title"></h2>
      <div class="ml-4 w-3/4" v-html="content?.desc"></div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  contentsToS,
  contentsDMCA,
  contentsFAQs,
  contentsContact,
  contentsPP,
  contentsRulesOfPost,
} from "@/constants";

import { isEmptyObject } from "@/utils/checkType";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const contentRef = computed(() => {
      switch (route.params.doctype) {
        case "terms-of-service":
          return contentsToS;
        case "faqs":
          return contentsFAQs;
        case "dmca":
          return contentsDMCA;
        case "contact":
          return contentsContact;
        case "privacy-policy":
          return contentsPP;
        case "post-rules":
          return contentsRulesOfPost;
        default:
          router.push({
            name: "notFound",
            params: {
              pathMatch: route.path.split("/").slice(1),
            },
            query: route.query,
            hash: route.hash,
          });
      }
    });

    return { contentRef, isEmptyObject };
  },
};
</script>
