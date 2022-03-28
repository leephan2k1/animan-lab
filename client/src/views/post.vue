<template>
  <div
    class="w-full min-h-[400px] lg:min-h-[300px] md:min-h-[600px] h-fit relative"
  >
    <NewPost v-if="posType === 'new-post' && isLogged" />
    <PostDetails
      @handleReport="handleToggleReportForm"
      @editPost="handleEditPost"
      v-if="posType !== 'new-post'"
    />
    <ReportForm
      v-if="isReporting"
      @handleReport="handleToggleReportForm"
      @handleSubmitForm="handleSubmitForm"
    />
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import NewPost from "@/components/NewPost.vue";
import PostDetails from "@/components/PostDetails.vue";
import ReportForm from "@/components/ReportForm.vue";

import repositoryFactory from "@/api/repositoryFactory";
const postRepository = repositoryFactory.get("posts");

export default {
  components: {
    NewPost,
    PostDetails,
    ReportForm,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const toast = useToast();

    const isLogged = ref();
    const isReporting = ref(false);

    const posType = computed(() => route.params.postTypes);
    const postIdentifier = ref({});

    const validateParams = () => {
      if (posType.value === "new-post") {
        isLogged.value = store.getters["auth/isAuthenticated"];
        if (!isLogged.value) {
          router.push({ name: "login" });
        }
      }
    };

    const handleToggleReportForm = (value) => {
      isReporting.value = value?.toggle;
      //emit from post detail:
      if (isReporting.value) {
        postIdentifier.value.post_id = value.post_id;
        postIdentifier.value.post_slug = value.post_slug;
      }
    };

    const handleSubmitForm = async (value) => {
      try {
        const res = await postRepository.reportPost(
          postIdentifier.value.post_slug,
          {
            author_name: value.formValue.name,
            author_email: value.formValue.email,
            post_id: postIdentifier.value.post_id,
            report_title: value.formValue.title,
            report_content: value.formValue.content,
          }
        );
        if (res?.data.success) {
          //message
          toast.success("Cảm ơn bạn đã cho Animan biết!", {
            position: "top-center",
            timeout: 3000,
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
          //close form
          isReporting.value = false;
        }
      } catch (err) {
        console.error(err);
      }
    };

    const handleEditPost = (postValue) => {
      console.log(postValue); 
      //handle edit post
    };

    // just accept create post for logged user
    validateParams();
    return {
      posType,
      isLogged,
      handleToggleReportForm,
      isReporting,
      handleSubmitForm,
      handleEditPost,
    };
  },
};
</script>
